import { Router } from "express";
import {checkMedicalHistory,checkLabResult,patientAppointment,patientNotification,deleteAppointment,deleteNotification} from "../controllers/patientController.js";
import { authorizeRole } from "../middleware/auth";
const router = Router();


router.get('/checkmedicalhistory',authorizeRole('patient'),checkMedicalHistory),
router.get('/checklabresult',authorizeRole('patient'),checkLabResult),
router.get('/patientappointment',authorizeRole('patient'),patientAppointment),
router.get('patientnotification',authorizeRole('patient'),patientNotification),
router.delete('deleteappointment',authorizeRole('patient'),deleteAppointment),
router.delete('deletenotification',authorizeRole('patient'),deleteNotification)


export default router;