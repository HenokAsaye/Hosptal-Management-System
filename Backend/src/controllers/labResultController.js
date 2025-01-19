import Patient  from "../model/patientModel.js";
import User  from "../model/userModel.js";
import labResult  from "../model/labResultModel.js";
import { logger } from "../config/logger.env.js";
import { v4 as uuidv4 } from 'uuid'; 
export const createLabResult = async (req, res) => {
    const { patientEmail, testName, resultDetails, technicianId, approvedBy, isViewAllowed } = req.body;
    try {
        const patient = await Patient.findOne({email:patientEmail});
        if (!patient) {
            logger.warn(`Patient with Email ${patientEmail} not found.`);
            return res.status(404).json({ success: false, message: "Patient not found" });
        }
        const technician = await User.findById(technicianId);
        if (!technician) {
            logger.warn(`Technician with ID ${technicianId} not found.`);
            return res.status(404).json({ success: false, message: "Technician not found" });
        }
        const resultId = uuidv4();
        const existingResult = await labResult.findOne({ PatientId: patient._id, testName: testName });
        if (existingResult) {
            logger.warn(`Duplicate lab result found for patient ${patient._id} and test ${testName}.`);
            return res.status(400).json({ success: false, message: "Lab result already exists for this patient and test" });
        }
        const newLabResult = new labResult({
            resultId,
            PatientId:patient._id,
            testName,
            resultDetails,
            technicianId,
            isViewAllowed,
            approvedBy,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await newLabResult.save();
        logger.info(`Lab result created successfully for patient ${patient._id} and test ${testName}.`);
        return res.status(201).json({
            success: true,
            message: "Lab result created successfully",
            data: newLabResult
        });
    } catch (error) {
        logger.error(`Error creating lab result: ${error.message}`);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
