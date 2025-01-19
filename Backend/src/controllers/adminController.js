import Admin  from "../model/adminmodel.js"
import { logger } from "../config/logger.env.js";
import User from "../model/userModel.js";
import Patient from "../model/patientModel.js";

import fs from 'fs';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import { SendAdminInvitationLink } from "../service/emailService.js"; 
import bcrypt from "bcrypt";
dotenv.config()
import { parse } from 'json2csv';
import { logAction } from "../config/logger.env.js"; 
import {generateToken} from "../util/jwt.js"

export const firstAdminLogin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const Email = process.env.INITIAL_ADMIN_EMAIL;
        const Password = process.env.INTIAL_ADMIN_PASSWORD;

        if (email !== Email) {
            return res.status(404).json({ message: "You are not Admin" });
        } else if (password !== Password) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
            role: "Admin",
        });

        await newAdmin.save();


        const token = await generateToken(newAdmin, res);

        return res.status(200).json({
            message: "Welcome Admin",
            newAdmin,
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server Error" });
    }
};

export const inviteAdmin = async (req, res) => {
    const { email, name, password } = req.body;
    try {
        console.log("Checking if user already exists for email:", email);
        const existingUser = await Admin.findOne({ email });

        if (existingUser) {
            console.log("User already exists:", existingUser);
            return res.status(400).json({ message: "User with this email already exists." });
        }

        const adminPageUrl = `${process.env.ADMIN_INVITE_BASE_URL}/register`;
        console.log("Generated admin page URL:", adminPageUrl);

        const emailSent = await SendAdminInvitationLink(email, adminPageUrl);
        console.log("Email sent status:", emailSent);

        if (!emailSent || emailSent instanceof Error) {
            console.log("Email sending failed. Returned value:", emailSent);
            return res.status(400).json({ message: "Failed to send invitation email." });
        }

        const newAdmin = new Admin({ name, password, email, role: "Admin" });
        console.log("Saving new admin:", newAdmin);

        await newAdmin.save();
        return res.status(200).json({ message: "Invitation sent successfully, pending admin saved." });

    } catch (error) {
        console.error("Error inviting admin:", error);
        return res.status(500).json({ message: "An error occurred while inviting the admin." });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        const patients = await Patient.find({});
        const Admins = await Admin.find({});

        return res.status(200).json({
            message: "Users and Patients fetched successfully.",
            users,
            patients,
            Admins
        });
    } catch (error) {
        logger.error("Error fetching users:", error.message);
        return res.status(500).json({ message: "Internal server error while fetching users." });
    }
};
export const deleteUser = async (req, res) => {
  const { userId } = req.body; 

  try {
    const user = await User.findById(userId);
    if (user) {
      await User.findByIdAndDelete(userId);
      return res.status(200).json({
        success: true,
        message: "User deleted successfully from User model",
      });
    }
    const patient = await Patient.findById(userId);
    if (patient) {
      await Patient.findByIdAndDelete(userId);
      return res.status(200).json({
        success: true,
        message: "Patient deleted successfully from Patient model",
      });
    }
    const admin = await Admin.findById(userId);
    if (admin) {
      await Admin.findByIdAndDelete(userId);
      return res.status(200).json({
        success: true,
        message: "Admin deleted successfully from Admin model",
      });
    }
    return res.status(404).json({
      success: false,
      message: "User not found in any model",
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const countAllUsers = async (req, res) => {
    try {
      const doctorCount = await User.countDocuments({ role: 'doctor' });
      const userCount = await User.countDocuments({ role: 'receptionist' });
      const pharmacistCount = await User.countDocuments({ role: 'pharmacist' });
      const labTechnicianCount = await User.countDocuments({ role: 'lab-technician' });
      const adminCount = await Admin.countDocuments({ role: 'Admin' });
      const patientCount = await Patient.countDocuments({ role: 'patient' });
      const nurseCount = await User.countDocuments({ role: 'nurse' });
      const totalUsers = userCount + adminCount + patientCount + pharmacistCount + labTechnicianCount + doctorCount + nurseCount;
  
      return res.status(200).json({
        success: true,
        message: "Counts retrieved successfully",
        data: {
          userCount,
          adminCount,
          patientCount,
          doctorCount,
          pharmacistCount,
          labTechnicianCount,
          nurseCount,
          totalUsers,
        },
      });
    } catch (error) {
      console.error("Error counting users:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
  

export const updateUserDetails = async (req, res) => {
    const { userId, name, email, role } = req.body;

    try {
        const user = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            {
                $unionWith: {
                    coll: 'patients',  // The name of the Patient collection
                    pipeline: [
                        { $match: { _id: new mongoose.Types.ObjectId(userId) } },
                    ],
                },
            },
            {
                $unionWith: {
                    coll: 'admins',  
                    pipeline: [
                        { $match: { _id: new mongoose.Types.ObjectId(userId) } },
                    ],
                },
            },
        ]);
        if (!user || user.length === 0) {
            return res.status(404).json({ message: "User not found in any collection." });
        }
        const userToUpdate = user[0];
        userToUpdate.name = name || userToUpdate.name;
        userToUpdate.email = email || userToUpdate.email;
        userToUpdate.role = role || userToUpdate.role;
        if (userToUpdate.__t === 'Patient') {
            await Patient.findByIdAndUpdate(userToUpdate._id, userToUpdate);
        } else if (userToUpdate.__t === 'Admin') {
            await Admin.findByIdAndUpdate(userToUpdate._id, userToUpdate);
        } else {
            await User.findByIdAndUpdate(userToUpdate._id, userToUpdate);
        }

        return res.status(200).json({
            message: "User details updated successfully.",
            user: userToUpdate,
        });
    } catch (error) {
        logger.error("Error updating user details:", error); 
        return res.status(500).json({ message: "Internal server error while updating user details.", error });
    }
};


export const getAuditLog = async (req, res) => {
    const { startDate, endDate, actionType } = req.query;
    try {
        fs.readFile('logs/audit.log', 'utf8', (err, data) => {
            if (err) {
                logger.error(`Error reading the audit log: ${err.message}`);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve audit log, try again later.',
                });
            }
            const logs = data.split('\n').map(line => JSON.parse(line)).filter(log => {
                const logDate = new Date(log.timestamp);
                return logDate >= new Date(startDate) && logDate <= new Date(endDate) &&
                    (actionType ? log.action === actionType : true);
            });
            if (logs.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No audit log entries found for the selected filters.',
                });
            }
            logAction('Viewed Audit Log', req.admin, 'success', `Time range: ${startDate} to ${endDate}, Action: ${actionType || 'All'}`);
            return res.status(200).json({
                success: true,
                auditLog: logs,
            });
        });
    } catch (error) {
        logger.error(`Error retrieving audit log: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the audit log.',
        });
    }
};
export const manageUserPermissions = async (req, res) => {
    const { userId, permissions } = req.body;

    try { 
        const admin = await Admin.findById(req.admin._id);
        if (!admin || !admin.permissions.includes('manage_permissions')) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to manage user permissions.',
            });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }
        user.permissions = permissions;
        await user.save();
        logAction('Updated User Permissions', req.admin, 'success', `Updated permissions for user: ${userId}`);
        return res.status(200).json({
            success: true,
            message: 'User permissions updated successfully.',
        });
    } catch (error) {
        logger.error(`Error updating user permissions: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while updating user permissions.',
        });
    }
};
export const generateAdminReport = async (req, res) => {
    const { startDate, endDate, reportType } = req.body;

    try {
        const report = await generateAuditReport(new Date(startDate), new Date(endDate), reportType);
        logger.info(`Admin generated a ${reportType} report from ${startDate} to ${endDate}`);
        if (reportType === 'csv') {
            const csv = parse(report);
            fs.writeFileSync(`reports/${reportType}_report.csv`, csv);
            return res.status(200).json({
                success: true,
                message: `Report generated and saved as ${reportType}_report.csv`,
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Report generated successfully.',
            report,
        });
    } catch (error) {
        logger.error(`Error generating admin report: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate report.',
        });
    }
};
const generateAuditReport = (startDate, endDate, reportType) => {
    return new Promise((resolve, reject) => {
        fs.readFile('logs/audit.log', 'utf8', (err, data) => {
            if (err) {
                return reject(new Error('Failed to read logs for report generation.'));
            }
            const logs = data.split('\n').map(line => JSON.parse(line)).filter(log => {
                const logDate = new Date(log.timestamp);
                return logDate >= startDate && logDate <= endDate;
            });
            if (reportType === 'csv') {
                resolve(logs); 
            } else {
                resolve({
                    success: logs.filter(log => log.status === 'success'),
                    failure: logs.filter(log => log.status === 'failure'),
                });
            }
        });
    });
};
