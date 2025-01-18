import nodemailer from "nodemailer";
import {
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    cancelledAppointment, invitationEmail
} from "../util/mailTemplate.js";
import dotenv from "dotenv";
import {logger} from "../config/logger.env.js";
dotenv.config();
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure:true,
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD, 
    },
});
const sendEmail = async ({ to, subject, htmlContent }) => {
    try {
        const mailOptions = {
            from: `"Your App Team" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: htmlContent,
        };
        await transporter.sendMail(mailOptions);
        logger.info(`Email sent successfully to ${to} with subject: ${subject}`);
        return true
    } catch (error) {
        return false
        logger.error(`Error while sending email to ${to}: ${error.message}`);
        throw error;
    }
};
export const sendVerificationEmail = async (recipientEmail, verificationToken) => {
    try {
        const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);
        await sendEmail({
            to: recipientEmail,
            subject: "Verify Your Email",
            htmlContent,
        });
        return true
    } catch (error) {
        logger.error("falied to send verification email")
        return false
    }
    
};
export const sendPasswordResetEmail = async (recipientEmail, resetURL) => {
    try {
        const htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);
        await sendEmail({
            to: recipientEmail,
            subject: "Password Reset Request",
            htmlContent,
        });
        return true
    } catch (error) {
        logger.error("failed to send password reset email")
        return false
    }

};
export const sendPasswordResetSuccessEmail = async (recipientEmail) => {
    try {
        const htmlContent = PASSWORD_RESET_SUCCESS_TEMPLATE;
        await sendEmail({
            to: recipientEmail,
            subject: "Password Reset Successful",
            htmlContent,
        });
        return true
    } catch (error) {
        logger.error("failed to send password reset success email")
        return false
    }

};

export const sendNotificationEmail = async(recipientEmail,doctorName,timeSlot)=>{
    try {
        const htmlContent = cancelledAppointment
        await sendEmail({
            to:recipientEmail,
            subject:"Appointment Cancellation",
            html:htmlContent.replace("{doctorName}",doctorName,"{timeSlot}",timeSlot)
        })
        return true
    } catch (error) {
        logger.error("failed to send Appointment Cancellation Email")
        return false
    }
}
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
