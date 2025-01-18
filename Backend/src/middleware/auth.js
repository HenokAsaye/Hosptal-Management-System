import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import Patient from '../model/patientModel.js';
import { generateToken } from '../util/jwt.js';
import dotenv from "dotenv";

dotenv.config();


export const authenticateToken = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: "Token is missing or invalid" });
    }

    try {
        // Decode the token to extract the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // First, check for the user in the Patient model
        let user = await Patient.findById(decoded._id);

        // If not found in Patient model, check in the User model
        if (!user) {
            user = await User.findById(decoded._id);
        }

        // If no user is found in either model
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Log the user object to check its structure
        console.log("Authenticated User:", user);

        // Attach the user to the request object
        req.user = user;

        // Ensure that the role exists for the user
        if (!req.user.role) {
            return res.status(403).json({
                success: false,
                message: "Role not found for this user"
            });
        }

        // Log the req.user object to make sure the role is present
        console.log("req.user after attaching:", req.user);

        // Proceed to next middleware or route handler
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};


export const authorizeRole = (roles) => {
    return async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied" });
        }
        next();
    };
};

export const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        const userPermissions = req.user.permissions; 

        if (!userPermissions || !userPermissions.includes(requiredPermission)) {
            return res.status(403).json({ 
                message: "You do not have the required permission to perform this action." 
            });
        }

        next();
    };
};
