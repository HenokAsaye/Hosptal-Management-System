import Patient from "../model/patientModel.js";
import User from "../model/userModel.js"
import Appointment from "../model/appointmentModel.js";
import { sendVerificationEmail} from "../service/emailService.js";
import {logger} from "../config/logger.env.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();


export const registerNewPatient = async (req, res) => {
    const { name, email, password, role, region, city, woreda, age, contact } = req.body;
    try {
        const existingUser = await Patient.findOne({ email }) 
            

        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: `Account already exists with email ${email}` 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const emailSent = await sendVerificationEmail(email, verificationToken);
        if (!emailSent) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid email address. Please try again." 
            });
        }
        const userData = {
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, 
            isVerified: false,
        };

        if (true) {
            const patientData = {
                ...userData,
                age,
                contact,
                address: { city, region, woreda },
            };
            const newPatient = new Patient(patientData);
            await newPatient.save();
        } 

        return res.status(201).json({
            success: true,
            message: "Account created successfully. Please verify your email.",
        });
    } catch (error) {
        logger.error(`Error during signup: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};


export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ 
            success: false, 
            message: "Verification code is required and must be a valid string." 
        });
    }

    try {
        const query = {
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        };

        const user = await Patient.findOne(query);

        if (!user) {
            const expiredUser = await Patient.findOne({ verificationToken: code });

            const message = expiredUser 
                ? "Verification token has expired. Please request a new one." 
                : "Invalid verification token.";
            return res.status(400).json({ success: false, message });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Your email has been verified successfully. You can now log in.",
        });
    } catch (error) {
        logger.error(`Error during email verification: ${error.message}`);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};


export const scheduleAppointment = async (req, res) => {
    const { patientId, doctorId, reason, timeSlot } = req.body;

    try {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ 
                success: false, 
                message: "Patient not found" 
            });
        }
        const doctor = await User.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ 
                success: false, 
                message: "Doctor not found" 
            });
        }
        if (new Date(timeSlot) <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Time slot must be in the future",
            });
        }
        const newAppointment = new Appointment({
            patientId,
            doctorId,
            reason,
            timeSlot,
            status: "scheduled",
        });

        await newAppointment.save();

        return res.status(201).json({
            success: true,
            message: "Appointment successfully created",
            appointment: newAppointment,
        });
    } catch (error) {
        console.error("Error scheduling appointment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


import { sendNotification } from "../service/emailService.js";

export const cancelSchedule = async (req, res) => {
    const { doctorId, timeSlot } = req.query;
    try {
        const doctor = await User.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "There is no Doctor Found"
            });
        }
        const cancelledAppointments = await Appointment.find({
            doctorId: doctorId,
            timeSlot: timeSlot,
            status: "scheduled"
        });

        if (!cancelledAppointments || cancelledAppointments.length === 0) {
            return res.status(400).json({
                success: false,
                message: `There is no scheduled appointment with ${timeSlot} for Doctor ${doctor.name}`
            });
        }

        for (const appointment of cancelledAppointments) {
            appointment.status = "cancelled";
            await appointment.save();

            const patient = await Patient.findById(appointment.patientId);
            if (patient) {
                await sendNotification(patient.email, "Appointment Cancelled", `Your appointment with Dr. ${doctor.name} on ${timeSlot} has been cancelled.`);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Appointments cancelled and patients notified successfully"
        });
    } catch (error) {
        console.error("Error cancelling appointments:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const verifyPatientPayment = async (req, res) => {
    const { patientId } = req.query;
    try {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found",
            });
        }
        if (patient.PaymentStatus === "Paid") {
            const currentDate = new Date();
            const lastPaymentDate = new Date(patient.updatedAt);
            const daysSinceLastPayment = Math.floor(
                (currentDate - lastPaymentDate) / (1000 * 60 * 60 * 24)
            );

            if (daysSinceLastPayment > 14) {
                patient.PaymentStatus = "Not Paid";
                patient.updatedAt = currentDate; 
                await patient.save();

                return res.status(200).json({
                    success: true,
                    message: "Patient payment status changed to 'Not Paid' after 14 days.",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Patient payment is verified successfully.",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Patient payment not verified.",
            });
        }
    } catch (error) {
        console.error("Error verifying patient payment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
