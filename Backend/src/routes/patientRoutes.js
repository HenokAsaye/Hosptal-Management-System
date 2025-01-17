import { Router } from "express";
import {checkMedicalHistory,checkLabResult,patientAppointment,patientNotification,deleteAppointment,deleteNotification} from "../controllers/patientController.js";
const router = Router();


router.get('/checkmedicalhistory',checkMedicalHistory),
router.get('/checklabresult',checkLabResult),
router.get('/patientappointment',patientAppointment),
router.get('patientnotification',patientNotification),
router.delete('deleteappointment',deleteAppointment),
router.delete('deletenotification',deleteNotification)


export default router;