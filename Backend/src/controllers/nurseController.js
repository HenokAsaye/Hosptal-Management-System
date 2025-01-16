import Patient from "../model/patientModel.js";
import Medication from "../model/medicationModel.js"


export const checkMedicalHistory = async(req,res)=>{
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
}

export const checkMedicationAvailablity = async(req,res)=>{
    try {
        const { name} = req.query;
        if (!name) {
          return res.status(400).json({
            success: false,
            message: "Medication name is required to check availability.",
          });
        }
    
        const medication = await Medication.findOne({ name: new RegExp(name, "i") });
    
        if (!medication) {
          return res.status(404).json({
            success: false,
            message: `Medication "${name}" is not available.`,
          });
        }
        logger.info(`Pharmacist checked availability for medication: ${name}`);
        return res.status(200).json({
          success: true,
          message: `Medication "${name}" is available with ${medication.quantity} units.`,
          data: medication,
        });
      }catch (error) {
        logger.error(`Error checking medication availability: ${error.message}`);
        return res.status(500).json({
          success: false,
          message: "Failed to check medication availability. Please try again later.",
        });
    }
}

export const editMedicationAvailtablity = async(req,res)=>{
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
}