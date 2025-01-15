import Medication from "../model/medicationModel.js";
import { logger } from "../config/logger.env.js";


export const trackExpiryDates = async (req, res) => {
  try {
    const { days } = req.query;
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + Number(days || 30));

    const medications = await Medication.find({ expiryDate: { $lte: thresholdDate } }).populate('despensedBy', 'username');

    if (medications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No medications nearing expiry within the selected timeframe.",
      });
    }
    const expiryCount = medications.length;
    logger.info("Pharmacist viewed medications nearing expiry.");
    return res.status(200).json({
      success: true,
      message: `Found ${expiryCount} medications nearing expiry.`,
      data: medications.map((med) => ({
        medicationId: med.medicationId,
        name: med.name,
        quantity: med.quantity,
        expiryDate: med.expiryDate,
        prescribedQuantity: med.prescribedQuantity,
        despensedBy: med.despensedBy ? med.despensedBy.username : "Not dispensed",
        dispenseDate: med.dispenseDate,
      })),
      expiryCount,
    });
  } catch (error) {
    logger.error(`Error tracking expiry dates: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve medications nearing expiry. Please try again later.",
    });
  }
};

export const checkMedicationAvailability = async (req, res) => {
  try {
    const { name, dispenseQuantity } = req.query;

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

    if (medication.quantity <= 0) {
      medication.status = "unavailable";
      await medication.save();

      return res.status(200).json({
        success: true,
        message: `Medication "${name}" is unavailable.`,
      });
    }

    
    if (dispenseQuantity) {
      const quantityToDispense = parseInt(dispenseQuantity);

      if (quantityToDispense > medication.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${medication.quantity} units of "${name}" are available.`,
        });
      }

      medication.quantity -= quantityToDispense;

      
      if (medication.quantity === 0) {
        medication.status = "unavailable";
      }

      await medication.save();

      logger.info(`Pharmacist dispensed ${quantityToDispense} units of "${name}".`);
      return res.status(200).json({
        success: true,
        message: `Successfully dispensed ${quantityToDispense} units of "${name}".`,
        data: medication,
      });
    }

    logger.info(`Pharmacist checked availability for medication: ${name}`);
    return res.status(200).json({
      success: true,
      message: `Medication "${name}" is available with ${medication.quantity} units.`,
      data: medication,
    });
  } catch (error) {
    logger.error(`Error checking medication availability: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Failed to check medication availability. Please try again later.",
    });
  }
};
export const addOrUpdateMedication = async (req, res) => {
    try {
      const { medicationId, name, quantity, expiryDate } = req.body;
  
      if (!medicationId || !name || !quantity || !expiryDate) {
        return res.status(400).json({
          success: false,
          message: "All fields (medicationId, name, quantity, expiryDate) are required.",
        });
      }
      let medication = await Medication.findOne({ medicationId });
      if (medication) {
        medication.name = name;
        medication.quantity += quantity;
        medication.expiryDate = new Date(expiryDate);
  
        if (medication.quantity > 0) {
          medication.status = "available";
        }
  
        await medication.save();
  
        logger.info(`Updated medication: ${name}`);
        return res.status(200).json({
          success: true,
          message: `Medication "${name}" updated successfully.`,
          data: medication,
        });
      } else {
        medication = new Medication({
          medicationId,
          name,
          quantity,
          expiryDate: new Date(expiryDate),
        });
  
        await medication.save();
  
        logger.info(`Added new medication: ${name}`);
        return res.status(201).json({
          success: true,
          message: `Medication "${name}" added successfully.`,
          data: medication,
        });
      }
    } catch (error) {
      logger.error(`Error adding/updating medication: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: "Failed to add or update medication. Please try again later.",
      });
    }
  };

