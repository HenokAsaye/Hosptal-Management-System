import Admin  from "../model/adminmodel.js"
import { logger } from "../config/logger.env.js";
import User from "../model/userModel.js"
import fs from 'fs';
import dotenv from "dotenv";
dotenv.config()
import { parse } from 'json2csv';
import { logAction } from "../config/logger.env.js"; 



// export const firstAdminLogin = async(req,res)=>{
//     const {name,email,password,role} = req.body
//     try {
//         const email = process.env.ADMIN_EMAIL;
//         const password = process.env.ADMIN_PASSWORD;
//         if(email !== email)
//     } catch (error) {
        
//     }

// }

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
