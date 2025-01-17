import {Router} from "express";
import { registerNewPatient,verifyEmail,scheduleAppointment,cancelSchedule,verifyPatientPayment } from "../controllers/ReceptionController.js";
import { authorizeRole } from "../middleware/auth.js";
const router = Router();


router.post('/registernewpatient',registerNewPatient)
router.post('/verifyEmail',verifyEmail),
router.post('/scheduleappointment',scheduleAppointment)
router.delete('/cancelschedule',cancelSchedule)
router.post('/verifypayment',verifyPatientPayment)


export default router;