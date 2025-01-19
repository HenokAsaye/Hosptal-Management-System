import Patient from "../model/patientModel.js";
import User from "../model/userModel.js"
import Appointment from "../model/appointmentModel.js";
import { sendVerificationEmail} from "../service/emailService.js";
import {logger} from "../config/logger.env.js";
import { sendNotificationEmail } from "../service/emailService.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();


export const registerNewPatient = async (req, res) => {
    const { name, email, password,region, city, woreda, age, contact } = req.body;
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
                role:"patient"
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
    const { patientId, doctorName, reason, timeSlot } = req.body;

    try {
        // Find the patient by ID
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ 
                success: false, 
                message: "Patient not found" 
            });
        }


        // Find the doctor by name
        const doctor = await User.findOne({ name: doctorName, role: "doctor" });
        if (!doctor) {
            return res.status(404).json({ 
                success: false, 
                message: "Doctor not found" 
            });
        }

        // Validate that the time slot is in the future
        if (new Date(timeSlot) <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Time slot must be in the future",
            });
        }

        // Create a new appointment
        const newAppointment = new Appointment({
            patientId,
            doctorId: doctor._id,
            reason,
            timeSlot,
            status: "scheduled",
        });

        // Save the new appointment
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

export const cancelSchedule = async (req, res) => {
    const { doctorName, appointmentId } = req.body; // Receive doctorName and appointmentId from the frontend
    
    try {
        // Step 1: Find the doctor by their name
        const doctor = await User.findOne({ name: doctorName,role:"doctor" });
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: `No doctor found with the name ${doctorName}`
            });
        }

        // Step 2: Find the appointment by its ID
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: `Appointment not found`
            });
        }

        // Step 3: Verify the appointment belongs to the correct doctor and is scheduled
        if (appointment.doctorId.toString() !== doctor._id.toString()) {
            return res.status(400).json({
                success: false,
                message: `This appointment does not belong to Dr. ${doctorName}`
            });
        }

        if (appointment.status !== "scheduled") {
            return res.status(400).json({
                success: false,
                message: `This appointment is not in scheduled status and cannot be cancelled`
            });
        }

        // Step 4: Update the status of the appointment to "cancelled"
        appointment.status = "cancelled";
        await appointment.save();

        // Step 5: Notify the patient via email
        const patient = await Patient.findById(appointment.patientId);
        if (patient) {
            await sendNotificationEmail(patient.email, doctorName, appointment.timeSlot);
        }

        return res.status(200).json({
            success: true,
            message: "Appointment cancelled and patient notified successfully"
        });
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
export const searchAppointmentsByDoctor = async (req, res) => {
    const { doctorName } = req.query; 

    try {
        const doctor = await User.findOne({ 
            name: { $regex: new RegExp(doctorName, "i") }, 
            role: "doctor" 
        });
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: `No doctor found with the name ${doctorName}`
            });
        }

        const appointments = await Appointment.find({ doctorId: doctor._id, status: "scheduled" })
            .populate("patientId", "name"); // Populate patientId to include patient name


        return res.status(200).json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
export const verifyPatientPayment = async (req, res) => {
    const { patientId } = req.body; // Changed to req.body

    try {
        // Find the patient by ID
        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found",
            });
        }

        // Get current date
        const currentDate = new Date();

        // Logic for "Paid" status
        if (patient.PaymentStatus === "Paid") {
            const lastPaymentDate = new Date(patient.updatedAt);
            const daysSinceLastPayment = Math.floor(
                (currentDate - lastPaymentDate) / (1000 * 60 * 60 * 24)
            );

            if (daysSinceLastPayment > 14) {
                // Update status to "Not Paid"
                patient.PaymentStatus = "Not Paid";
                patient.updatedAt = currentDate;
                await patient.save();

                return res.status(200).json({
                    success: true,
                    message: "Patient payment status automatically changed to 'Not Paid' after 14 days.",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Patient payment is still valid and verified.",
            });
        }

        // Logic for "Not Paid" status
        if (patient.PaymentStatus === "Not Paid") {
            // Update status to "Paid"
            patient.PaymentStatus = "Paid";
            patient.updatedAt = currentDate;
            await patient.save();

            return res.status(200).json({
                success: true,
                message: "Patient payment status updated to 'Paid'.",
            });
        }

        // Default response (shouldn't reach here)
        return res.status(400).json({
            success: false,
            message: "Unexpected payment status.",
        });

    } catch (error) {
        console.error("Error verifying patient payment:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const getTodaysAppointments = async (req, res) => {
   try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const appointments = await Appointment.find({
         $expr: {
            $eq: [
               { $dateToString: { format: "%Y-%m-%d", date: "$timeSlot" } },
               { $dateToString: { format: "%Y-%m-%d", date: today } },
            ],
         },
      })
      .populate("patientId", "name email")
      .populate("doctorId", "name email");

      // Ensure no appointment is missing patient or doctor information
      const validAppointments = appointments.filter(appointment => 
         appointment.patientId && appointment.doctorId
      );

      return res.status(200).json({
         success: true,
         data: validAppointments,
      });

   } catch (error) {
      console.error(`Error fetching today's appointments: ${error.message}`);
      return res.status(500).json({
         success: false,
         message: "Failed to fetch today's appointments. Please try again later.",
      });
   }
};

export const getTodaysPatients = async (req, res) => {
  try {
    // Get the current date (without the time part)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get the next day (exclusive upper bound for the date range)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);


    // Fetch appointments with a timeSlot within today
    const appointments = await Appointment.find({
      timeSlot: { $gte: today, $lt: tomorrow },
    }).populate({
      path: "patientId",
      select: "name", // Only fetch the patient's name
    });

    // Ensure that patientId is not null and then map to get patient names
    const patientNames = appointments
      .filter(appointment => appointment.patientId !== null) // Filter out appointments with no patientId
      .map((appointment) => appointment.patientId.name);

    res.status(200).json({
      success: true,
      message: "Fetched today's appointments successfully",
      data: patientNames,
    });
  } catch (error) {
    console.error("Error fetching today's appointments:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch today's appointments",
    });
  }
};
