import {Router} from "express";
import { getPatientByName,getPatientLabResults,getPatientMedicalHistory,editPatientMedicalHistory,scheduleAppointment} from "../controllers/doctorController.js";
import { authorizeRole } from "../middleware/auth.js";
const router = Router();

router.get('/getpatientName',getPatientByName)
router.get('/getpatientmedicalhistory',getPatientMedicalHistory)
router.put('/editmedicalhistory/:patientId',editPatientMedicalHistory),
router.post('/scheduleappointment',scheduleAppointment)
router.get('/getpatientlabresult',getPatientLabResults)

export default router;
