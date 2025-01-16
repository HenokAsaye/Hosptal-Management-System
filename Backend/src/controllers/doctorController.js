import Patient  from "../model/patientModel.js";
import User  from "../model/userModel.js";
import labResult  from "../model/labResultModel.js";
import Appointment from "../model/appointmentModel.js";
import dotenv from "dotenv";
dotenv.config();
import { isValid, isFuture } from "date-fns";
import { logger } from "../config/logger.env.js";


export const getPatientByName = async (req, res) => {
    const { name } = req.body;
    try {
        const patient = await Patient.find({ name: new RegExp(name, 'i') });
        if (!patient.length) {
            logger.warn(`Patient with name '${name}' not found`);
            return res.status(404).json({ success: false, message: "Patient not found" });
        }
        logger.info(`Retrieved patient(s) with name '${name}'`);
        return res.status(200).json({
            success: true,
            message: "Here are the found patients",
            data: patient
        });
    } catch (error) {
        logger.error(`Error retrieving patient by name: ${error.message}`);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const getPatientMedicalHistory = async (req, res) => {
    const { patientId } = req.body;
    try {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            logger.warn(`Patient with ID '${patientId}' not found`);
            return res.status(404).json({ success: false, message: "Patient not found" });
        }
        if (patient.PaymentStatus === "Not Paid") {
            logger.warn(`Patient ID '${patientId}' has unpaid status`);
            return res.status(400).json({ success: false, message: "Payment status is not valid" });
        }
        logger.info(`Retrieved medical history for patient ID '${patientId}'`);
        return res.status(200).json({
            success: true,
            message: "Here is the medical history of the patient",
            data: patient.medicalHistory
        });
    } catch (error) {
        logger.error(`Error retrieving medical history: ${error.message}`);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const editPatientMedicalHistory = async (req, res) => {
    const { patientId } = req.params;
    const { diagnosis, treatment, note } = req.body;
    try {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            logger.warn(`Patient with ID '${patientId}' not found`);
            return res.status(404).json({ success: false, message: "Patient not found" });
        }
        const newHistory = { diagnosis, treatment, note, addedAt: new Date() };
        patient.medicalHistory.push(newHistory);
        await patient.save();
        logger.info(`Updated medical history for patient ID '${patientId}'`);
        return res.status(200).json({
            success: true,
            message: "Medical history updated successfully",
            data: newHistory
        });
    } catch (error) {
        logger.error(`Error editing medical history: ${error.message}`);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const scheduleAppointment = async (req, res) => {
    const { patientEmail, doctorEmail, reason, timeSlot } = req.body;
    try {
        const appointmentDate = new Date(timeSlot);
        if (!isValid(appointmentDate) || !isFuture(appointmentDate)) {
            logger.warn(`Invalid or past time slot provided: '${timeSlot}'`);
            return res.status(400).json({
                success: false,
                message: "Invalid or past time slot provided"
            });
        }
        const patient = await Patient.findOne({ email: patientEmail });
        if (!patient) {
            logger.warn(`Patient with email '${patientEmail}' not found`);
            return res.status(404).json({ success: false, message: "Patient not found" });
        }

        const doctor = await User.findOne({ email: doctorEmail });
        if (!doctor) {
            logger.warn(`Doctor with email '${doctorEmail}' not found`);
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        const conflictingAppointment = await Appointment.findOne({
            doctorId: doctor._id,
            timeSlot: appointmentDate
        });

        if (conflictingAppointment) {
            logger.warn(`Conflicting appointment for doctor ID '${doctor._id}' at '${timeSlot}'`);
            return res.status(400).json({
                success: false,
                message: "Doctor is already booked for this time slot"
            });
        }
        const newAppointment = new Appointment({
            patientId: patient._id,
            doctorId: doctor._id,
            reason,
            timeSlot: appointmentDate,
            status: "scheduled"
        });

        await newAppointment.save();
        logger.info(`Scheduled appointment for patient '${patientEmail}' with doctor '${doctorEmail}'`);
        return res.status(201).json({
            success: true,
            message: "Appointment scheduled successfully",
            data: newAppointment
        });
    } catch (error) {
        logger.error(`Error scheduling appointment: ${error.message}`);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getPatientLabResults = async (req, res) => {
    try {
        const { patientEmail, testName } = req.query;
        const patient = await Patient.findOne({ email: patientEmail });
        if (!patient) {
            logger.warn(`Patient with email '${patientEmail}' not found`);
            return res.status(404).json({ success: false, message: "Patient not found" });
        }

        const query = { PatientId: patient._id, isViewAllowed: true };
        if (testName) query.testName = testName;

        const labResults = await labResult.find(query)
            .populate("technicianId", "name email")
            .populate("approvedBy", "name email");

        if (labResults.length === 0) {
            logger.warn(`No approved lab results for patient '${patientEmail}'`);
            return res.status(404).json({ success: false, message: "No approved lab results found for this patient" });
        }

        logger.info(`Retrieved lab results for patient '${patientEmail}'`);
        return res.status(200).json({
            success: true,
            message: "Lab results retrieved successfully",
            data: labResults
        });
    } catch (error) {
        logger.error(`Error retrieving lab results: ${error.message}`);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
