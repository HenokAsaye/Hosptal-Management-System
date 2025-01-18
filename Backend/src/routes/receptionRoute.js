import {Router} from "express";
import { registerNewPatient,verifyEmail,scheduleAppointment,cancelSchedule,verifyPatientPayment,getTodaysAppointments,getTodaysPatients,searchAppointmentsByDoctor } from "../controllers/ReceptionController.js";
import { authorizeRole } from "../middleware/auth.js";
const router = Router();


router.post('/registerpatient',registerNewPatient)
router.post('/verifyEmail',verifyEmail),
router.post('/scheduleappointment',scheduleAppointment)
router.delete('/cancel',cancelSchedule)
router.post('/verifypayment',verifyPatientPayment)
router.get("/appointments",getTodaysAppointments)
router.get("/checkedinpatients",getTodaysPatients)
router.get('/search',searchAppointmentsByDoctor)


export default router;