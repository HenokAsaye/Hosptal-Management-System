import {Router} from "express";
import { getPatientByName,getPatientLabResults,getPatientMedicalHistory,editPatientMedicalHistory,scheduleAppointment} from "../controllers/doctorController.js";
import { authorizeRole } from "../middleware/auth.js";
const router = Router();

router.get('/getpatientName',authorizeRole('doctor'),getPatientByName)
router.get('/getpatientmedicalhistory',authorizeRole('doctor'),getPatientMedicalHistory)
router.put('/editmedicalhistory/:patientId',authorizeRole('doctor'),editPatientMedicalHistory),
router.post('/scheduleappointment',authorizeRole('doctor'),scheduleAppointment)
router.get('/getpatientlabresult',authorizeRole('doctor'),getPatientLabResults)

export default router;
