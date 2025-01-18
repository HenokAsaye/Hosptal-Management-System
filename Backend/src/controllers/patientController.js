import Patient from "../model/patientModel.js";
import labResult from "../model/labResultModel.js";
import Notification from "../model/notificationModel.js";
import Appointment from "../model/appointmentModel.js";
import dotenv from "dotenv";
import { logger } from "../config/logger.env.js";
dotenv.config();
import mongoose from "mongoose";

export const checkMedicalHistory = async (req, res) => {
    const { patientId } = req.body;
    const { page = 1, limit = 10 } = req.query;

    try {
        logger.info("Fetching medical history", { patientId, page, limit });

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
            logger.warn("Invalid pagination parameters", { page, limit });
            return res.status(400).json({
                success: false,
                message: "Invalid pagination parameters"
            });
        }

        const user = await Patient.findById(patientId, {
            name: 1,
            medicalHistory: { $slice: [(pageNum - 1) * limitNum, limitNum] }
        });

        if (!user) {
            logger.warn("Patient not found", { patientId });
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        // Correctly count the total number of entries in medicalHistory using aggregation
        const totalEntries = await Patient.aggregate([
            { $match: { _id: user._id } },
            {
                $project: {
                    total: {
                        $size: { $ifNull: ["$medicalHistory", []] }
                    }
                }
            }
        ]);

        const totalCount = totalEntries[0]?.total || 0;

        logger.info("Medical history retrieved successfully", { patientId });
        return res.status(200).json({
            success: true,
            MedicalHistory: user.medicalHistory,
            message: `Here is your medical history, ${user.name}`,
            currentPage: pageNum,
            totalPages: totalCount > 0 ? Math.ceil(totalCount / limitNum) : 1,
            totalEntries: totalCount
        });
    } catch (error) {
        console.error(error);
        logger.error("Error fetching medical history", { error });
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


export const checkLabResult = async (req, res) => {
    const { patientId } = req.body;
    const { page = 1, limit = 10 } = req.query;

    try {
        logger.info("Fetching lab results", { patientId, page, limit });

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
            logger.warn("Invalid pagination parameters", { page, limit });
            return res.status(400).json({
                success: false,
                message: "Invalid Pagination Parameters"
            });
        }

        const patientLabResult = await labResult.find({ patientId })
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);



        const totalLabResult = await labResult.countDocuments({ patientId });
        logger.info("Lab results retrieved successfully", { patientId });
        return res.status(200).json({
            success: true,
            message: "Here is your lab result!",
            labResult: patientLabResult,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalLabResult / limitNum),
                totalResults: totalLabResult
            }
        });
    } catch (error) {
        logger.error("Error fetching lab results", { error });
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const patientNotification = async (req, res) => {
    const { patientId } = req.body;
    const { page = 1, limit = 10 } = req.query;

    try {
        logger.info("Fetching patient notifications", { patientId, page, limit });

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
            logger.warn("Invalid pagination parameters", { page, limit });
            return res.status(400).json({
                success: false,
                message: 'Invalid Pagination Parameters',
            });
        }

        const patientNotification = await Notification.aggregate([
            { $match: { receiverId: patientId } },
            { $sort: { createdAt: -1 } },
            { $skip: (pageNum - 1) * limitNum },
            { $limit: limitNum },
            { $project: { type: 1, message: 1, scheduledtime: 1 } },
        ]);

        const totalNotification = await Notification.countDocuments({ receiverId: patientId });

        logger.info("Notifications retrieved successfully", { patientId });
        return res.status(200).json({
            success: true,
            message: 'Your Notifications are here!',
            patientNotification,
            pagination: {
                currentPage: pageNum,
                totalEntries: totalNotification,
                totalPages: Math.ceil(totalNotification / limitNum),
            },
        });
    } catch (error) {
        logger.error("Error fetching notifications", { error });
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

export const patientAppointment = async (req, res) => {
    const { patientId } = req.body;
    const { page = 1, limit = 10 } = req.query;

    try {
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid Pagination Parameters"
            });
        }

        const patientAppointment = await Appointment.aggregate([
            { $match: { patientId: new mongoose.Types.ObjectId(patientId) } },
            { $sort: { createdAt: -1 } },
            { $skip: (pageNum - 1) * limitNum },
            { $limit: limitNum },
            {
                $lookup: {
                    from: "Users",
                    localField: "doctorId",
                    foreignField: "_id",
                    as: "doctorName"
                }
            },
            { $unwind: { path: "$doctorName", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    timeSlot: 1,
                    reason: 1,
                    doctorName: { $ifNull: ["$doctorName.name", "Unknown Doctor"] }
                }
            }
        ]);


        const totalAppointment = await Appointment.countDocuments({ patientId });


        return res.status(200).json({
            success: true,
            message: "Here are your appointments",
            appointments: patientAppointment,
            pagination: {
                currentPage: pageNum,
                totalEntries: totalAppointment,
                totalPages: Math.ceil(totalAppointment / limitNum)
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const deleteNotification = async (req, res) => {
    const { notificationId, patientId } = req.body;

    try {
        logger.info("Deleting notification", { notificationId, patientId });

        const notification = await Notification.findById(notificationId);
        if (!notification) {
            logger.warn("Notification not found", { notificationId });
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        if (notification.patientId.toString() !== patientId.toString()) {
            logger.warn("Unauthorized access to delete notification", { notificationId, patientId });
            return res.status(403).json({
                success: false,
                message: "You are not eligible to delete this Notification!"
            });
        }

        await Notification.deleteOne({ _id: notificationId });

        logger.info("Notification deleted successfully", { notificationId });
        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully"
        });
    } catch (error) {
        logger.error("Error deleting notification", { error });
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const deleteAppointment = async (req, res) => {
    const { appointmentId, patientId } = req.body;

    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        if (appointment.patientId.toString() !== patientId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this appointment"
            });
        }

        await Appointment.deleteOne({ _id: appointmentId });

        return res.status(200).json({
            success: true,
            message: "Appointment deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};
