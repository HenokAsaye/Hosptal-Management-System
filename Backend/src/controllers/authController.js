import bcrypt from "bcrypt";
import  User  from "../model/userModel.js"; 
import Admin from "../model/adminmodel.js"
import Patient from "../model/patientModel.js"; 
import { sendVerificationEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail } from "../service/emailService.js";
import { generateToken } from "../util/jwt.js";
import {logger} from "../config/logger.env.js";
import crypto from "crypto";

export const signup = async (req, res) => {
    const { name, email, password, role, region, city, woreda, age, contact } = req.body;
    const validRoles = ["receptionist", "nurse", "doctor", "lab-technician", "pharmacist"];

    try {
        const isPatient = !role || role === "patient";
        const existingUser = isPatient
            ? await Patient.findOne({ email })
            : await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: `Account already exists with email ${email}`,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const emailSent = await sendVerificationEmail(email, verificationToken);
        if (!emailSent) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address. Please try again.",
            });
        }

        const userData = {
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, 
            isVerified: false,
        };

        let token;
        if (isPatient) {
            const patientData = {
                ...userData,
                age,
                contact,
                address: { city, region, woreda },
                role:"patient"
            };
            const newPatient = new Patient(patientData);
            await newPatient.save();
            token =  await generateToken({ _id: newPatient._id, role: 'patient' }, res)
            console.log(token)
        } else {
            if (!validRoles.includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid role selected",
                });
            }
            const newUser = new User({ ...userData, role });
            await newUser.save();
            token = await generateToken(newUser, res); 
            console.log(token)
        }

        return res.status(201).json({
            success: true,
            token,
            message: "Account created successfully. Please verify your email.",
        });
    } catch (error) {
        logger.error(`Error during signup: ${error.message}`);
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ 
            success: false, 
            message: "Verification code is required and must be a valid string." 
        });
    }

    try {
        const query = {
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        };

        const user = await Patient.findOne(query) || await User.findOne(query);

        if (!user) {
            const expiredUser = await Patient.findOne({ verificationToken: code }) 
                || await User.findOne({ verificationToken: code });

            const message = expiredUser 
                ? "Verification token has expired. Please request a new one." 
                : "Invalid verification token.";
            return res.status(400).json({ success: false, message });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Your email has been verified successfully. You can now log in.",
        });
    } catch (error) {
        logger.error(`Error during email verification: ${error.message}`);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await Patient.findOne({ email });
        if (!user) {
            user = await User.findOne({ email });
        }
        if (!user) {
            user = await Admin.findOne({ email });
        }
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: `No account found for email ${email}` 
            });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }
        if (user.role !== "Admin" && !user.isVerified) {
            return res.status(403).json({ 
                success: false, 
                message: "Please verify your email before logging in." 
            });
        }
        const token = await generateToken(user, res);
        logger.info(`User logged in: ${user.email}`);
        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
            user: { ...user._doc, password: undefined }, 
        });
    } catch (error) {
        logger.error(`Error during login: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};
export const logOut = async(req,res)=>{
    res.clearCookie('token');
    return res.status(200).json({success:true,message:"SuccessFully LOgged Out"})
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        let user = await Patient.findOne({ email });
        if (!user) {
            user = await User.findOne({ email });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; 
        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        sendPasswordResetEmail(user.email, resetLink);

        logger.info(`Password reset email sent to: ${email}`);
        return res.status(200).json({ success: true, message: "Password reset email sent." });
    } catch (error) {
        logger.error(`Error during forgot password: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const resetPassword = async (req, res) => {
    const { code, password } = req.body;

    try {
        let user = await Patient.findOne({
            resetToken: code,
            resetTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            user = await User.findOne({
                resetToken: code,
                resetTokenExpiresAt: { $gt: Date.now() },
            });
        }

        if (!user) {
            logger.warn(`Invalid or expired reset token: ${code}`);
            return res.status(404).json({ success: false, message: "Invalid or expired reset token" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiresAt = undefined;
        await user.save();

        sendPasswordResetSuccessEmail(user.email);

        logger.info(`Password reset successfully for user: ${user.email}`);
        return res.status(200).json({
            success: true,
            message: "Password has been reset successfully.",
        });
    } catch (error) {
        logger.error(`Error during password reset: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
