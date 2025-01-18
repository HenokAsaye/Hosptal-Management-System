import nodemailer from "nodemailer";
import {
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    cancelledAppointment, 
    invitationEmail
} from "../util/mailTemplate.js";
import dotenv from "dotenv";
import { logger } from "../config/logger.env.js";
dotenv.config();
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false, 
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP Configuration Error:", error);
    } else {
        console.log("SMTP Configuration Success:", success);
    }
});

const sendEmail = async ({ to, subject, htmlContent }) => {
    try {
        const mailOptions = {
            from: `"Your App Team" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: htmlContent,
        };

        console.log("Preparing to send email with options:", mailOptions);

        await transporter.sendMail(mailOptions);
        logger.info(`Email sent successfully to ${to} with subject: ${subject}`);
        return true;
    } catch (error) {
        logger.error(`Error while sending email to ${to}: ${error.message}`);
        console.error("Error during email sending:", error);
        return false; 
    }
};
// Function to send a verification email
export const sendVerificationEmail = async (recipientEmail, verificationToken) => {
    try {
        const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);
        return await sendEmail({
            to: recipientEmail,
            subject: "Verify Your Email",
            htmlContent,
        });
    } catch (error) {
        logger.error("Failed to send verification email:", error);
        return false;
    }
};

// Function to send a password reset email
export const sendPasswordResetEmail = async (recipientEmail, resetURL) => {
    try {
        const htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);
        return await sendEmail({
            to: recipientEmail,
            subject: "Password Reset Request",
            htmlContent,
        });
    } catch (error) {
        logger.error("Failed to send password reset email:", error);
        return false;
    }
};

// Function to notify user of successful password reset
export const sendPasswordResetSuccessEmail = async (recipientEmail) => {
    try {
        const htmlContent = PASSWORD_RESET_SUCCESS_TEMPLATE;
        return await sendEmail({
            to: recipientEmail,
            subject: "Password Reset Successful",
            htmlContent,
        });
    } catch (error) {
        logger.error("Failed to send password reset success email:", error);
        return false;
    }
};

// Function to notify appointment cancellation
export const sendNotificationEmail = async (recipientEmail, doctorName, timeSlot) => {
    try {
        const htmlContent = cancelledAppointment.replace("{doctorName}", doctorName).replace("{timeSlot}", timeSlot);
        return await sendEmail({
            to: recipientEmail,
            subject: "Appointment Cancellation",
            html: htmlContent,
        });
    } catch (error) {
        logger.error("Failed to send Appointment Cancellation Email:", error);
        return false;
    }
};

// Function to send admin invitation email
export const SendAdminInvitationLink = async (recipientEmail, adminPageUrl) => {
    try {
        console.log("Preparing to send email to:", recipientEmail);
        console.log("Admin page URL for invitation:", adminPageUrl);
        const htmlContent = invitationEmail.replace("{resetURL}", adminPageUrl);
        console.log("Generated HTML content:", htmlContent);
        const emailSent = await sendEmail({
            to: recipientEmail,
            subject: "Admin Invitation",
            htmlContent,
        });
        console.log("Email sending result:", emailSent);
        return emailSent;
    } catch (error) {
        console.error(`Failed to send admin invitation to ${recipientEmail}:`, error);
        return false;
    }
};
