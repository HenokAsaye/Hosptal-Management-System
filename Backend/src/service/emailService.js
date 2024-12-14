import nodemailer from "nodemailer";
import {
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "../util/mailTemplate.js";
import dotenv from "dotenv";
import logger from "./logger.js";
dotenv.config();
const transporter = nodemailer.createTransport({
    service: "gmail",
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
    } catch (error) {
        logger.error(`Error while sending email to ${to}: ${error.message}`);
        throw error;
    }
};
export const sendVerificationEmail = async (recipientEmail, verificationToken) => {
    const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);
    await sendEmail({
        to: recipientEmail,
        subject: "Verify Your Email",
        htmlContent,
    });
};
export const sendPasswordResetEmail = async (recipientEmail, resetURL) => {
    const htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);
    await sendEmail({
        to: recipientEmail,
        subject: "Password Reset Request",
        htmlContent,
    });
};
export const sendPasswordResetSuccessEmail = async (recipientEmail) => {
    const htmlContent = PASSWORD_RESET_SUCCESS_TEMPLATE;
    await sendEmail({
        to: recipientEmail,
        subject: "Password Reset Successful",
        htmlContent,
    });
};
