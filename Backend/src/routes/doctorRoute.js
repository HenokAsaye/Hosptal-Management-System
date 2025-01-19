import {Router} from "express";
import { getPatientByName,getPatientLabResults,getPatientMedicalHistory,editPatientMedicalHistory,fetchDoctorAppointments} from "../controllers/doctorController.js";
const router = Router();

router.get('/getpatientName',getPatientByName)
router.get('/getpatientmedicalhistory',getPatientMedicalHistory)
router.put('/editmedicalhistory/:patientId',editPatientMedicalHistory),
router.get('/getappointments',fetchDoctorAppointments)
router.get('/getpatientlabresult',getPatientLabResults)

export default router;
