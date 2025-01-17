import { Router } from "express";
import { trackExpiryDates,checkMedicationAvailability,addOrUpdateMedication } from "../controllers/inventoryController.js";
import { authorizeRole } from "../middleware/auth.js";

const router = Router();

router.get('/trackexpirydate',trackExpiryDates),
router.get('/checkmedicationavailablity',checkMedicationAvailability)
router.get('/addorupdatemedication',addOrUpdateMedication)


export default router;