import { logger } from "../config/logger.env.js";
import Notification from "../model/notificationModel.js";
import { getSocketInstance, socketEvents } from "../service/socketService.js";
import cron from "node-cron";
let io;
socketEvents.on("socketInitialized", () => {
  io = getSocketInstance();
});

const sendNotification = async (req, res) => {
  try {
    const { notificationId, receiverId, appointmentId, type, message, scheduledTime } = req.body;

    if (!notificationId || !receiverId || !type || !message || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: "All fields (notificationId, receiverId, type, message, scheduledTime) are required.",
      });
    }

    const newNotification = new Notification({
      notificationId,
      receiverId,
      appointmentId,
      type,
      message,
      scheduledTime,
    });

    await newNotification.save();

    // Emit new notification only if socket is initialized
    if (io) {
      io.emit("newNotification", newNotification);
    }

    return res.status(201).json({
      success: true,
      message: "Notification sent successfully.",
      data: newNotification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send notification. Please try again later.",
    });
  }
};

const getPatientNotifications = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required to fetch notifications.",
      });
    }

    const notifications = await Notification.find({ receiverId: patientId })
      .populate("appointmentId")
      .sort({ scheduledTime: -1 });

    if (notifications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No notifications found for this patient.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully.",
      data: notifications,
    });
  } catch (error) {
    logger.error(`Error fetching notifications: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications. Please try again later.",
    });
  }
};

const markNotificationAsSent = async (req, res) => {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required to mark as sent.",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      { notificationId },
      { sent: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    logger.info(`Notification ${notificationId} marked as sent.`);
    return res.status(200).json({
      success: true,
      message: "Notification marked as sent.",
      data: notification,
    });
  } catch (error) {
    logger.error(`Error marking notification as sent: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as sent. Please try again later.",
    });
  }
};

const scheduleNotifications = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    const pendingNotifications = await Notification.find({
      scheduledTime: { $lte: now },
      sent: false,
    });

    for (const notification of pendingNotifications) {
      if (io) {
        io.emit("newNotification", notification); // Emit notification if socket is initialized
      }
      notification.sent = true;
      await notification.save();

      console.log(`Notification sent: ${notification.message}`);
    }
  });

  console.log("Notification scheduler is running...");
};
export { sendNotification, getPatientNotifications, markNotificationAsSent, scheduleNotifications };
