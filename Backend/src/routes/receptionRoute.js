import {Router} from "express";
import { registerNewPatient,verifyEmail,scheduleAppointment,cancelSchedule,verifyPatientPayment } from "../controllers/ReceptionController.js";
import { authorizeRole } from "../middleware/auth.js";
const router = Router();


router.post('/registernewpatient',authorizeRole('reception'),registerNewPatient)
router.post('/verifyEmail',verifyEmail),
router.post('/scheduleappointment',authorizeRole('reception'),scheduleAppointment)
router.delete('/cancelschedule',authorizeRole('reception'),cancelSchedule)
router.post('/verifypayment',authorizeRole('reception'),verifyPatientPayment)


export default router;