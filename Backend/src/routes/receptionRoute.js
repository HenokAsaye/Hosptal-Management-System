import {Router} from "express";
import { registerNewPatient,verifyEmail,scheduleAppointment,cancelSchedule,verifyPatientPayment,getTodaysAppointments,getTodaysPatients } from "../controllers/ReceptionController.js";
import { authorizeRole } from "../middleware/auth.js";
const router = Router();


router.post('/registerpatient',registerNewPatient)
router.post('/verifyEmail',verifyEmail),
router.post('/scheduleappointment',scheduleAppointment)
router.delete('/cancelschedule',cancelSchedule)
router.post('/verifypayment',verifyPatientPayment)
router.get("/appointments",getTodaysAppointments)
router.get("/checkedinpatients",getTodaysPatients)


export default router;