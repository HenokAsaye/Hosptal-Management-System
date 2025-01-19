import Patient  from "../model/patientModel.js";
import User  from "../model/userModel.js";
import labResult  from "../model/labResultModel.js";
import Appointment from "../model/appointmentModel.js";
import dotenv from "dotenv";
dotenv.config();
import { isValid, isFuture } from "date-fns";
import { logger } from "../config/logger.env.js";


export const getPatientByName = async (req, res) => {
    const { name } = req.query; // Use req.query for GET request parameters
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
    const { patientId } = req.query;
    try {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            logger.warn(`Patient with ID '${patientId}' not found`);
            return res.status(404).json({ success: false, message: "Patient not found" });
        }
        if (patient.PaymentStatus.toString() !== "Paid") {
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


export const fetchDoctorAppointments = async (req, res) => {
    try {
        // Extract doctorId from the query parameters
        const { doctorId } = req.query;
        // Validate the doctorId
        if (!doctorId) {
            logger.warn("Doctor ID not provided in request");
            return res.status(400).json({ success: false, message: "Doctor ID is required" });
        }

        // Fetch appointments for the specified doctor ID
        const appointments = await Appointment.find({ doctorId }).populate("patientId", "name email");

        if (appointments.length === 0) {
            logger.info(`No appointments found for doctor ID '${doctorId}'`);
            return res.status(404).json({ success: false, message: "No appointments found" });
        }

        // Return the fetched appointments
        logger.info(`Fetched ${appointments.length} appointments for doctor ID '${doctorId}'`);
        return res.status(200).json({
            success: true,
            message: "Appointments fetched successfully",
            data: appointments,
        });
    } catch (error) {
        logger.error(`Error fetching appointments: ${error.message}`);
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
