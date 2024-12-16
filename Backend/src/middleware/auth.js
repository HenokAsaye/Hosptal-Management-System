import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import Patient from '../model/patientModel.js';
import {generateToken} from '../util/jwt.js'
import dotenv from "dotenv";
dotenv.config();

export const authenticateToken = async (req, res, next) => {
    const token = req.cookies.jwt; 
    if (!token) {
        return res.status(401).json({ message: "Token is missing or invalid" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await User.findById(decoded._id) || await Patient.findById(decoded._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; 
        next(); 
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export const authorizeRole = (role)=>{
    return async(req,res,next)=>{
        if(!role.includes(req.user.role)){
            return res.status(404).json({message:"Access Denied"})
        }
        next();
    }
  
}
