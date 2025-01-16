import Router from "express"
import { getPatientNotifications,sendNotification,markNotificationAsSent,scheduleNotifications } from "../controllers/notificationController.js";
const router = Router();

router.get("/getpatientnotifcation",getPatientNotifications)
router.post("/sendNotification",sendNotification)
router.post("/marknotifcationAssent",markNotificationAsSent)
router.post("/scheduleNotification",scheduleNotifications)

export default router;