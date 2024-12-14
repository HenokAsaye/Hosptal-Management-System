import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = async (Id, res) => {
    const token = jwt.sign(
        { _id: Id._id, role: Id.role }, 
        process.env.JWT_SECRET
    );
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });
    return token;
};
