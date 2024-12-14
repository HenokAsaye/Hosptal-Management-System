import mongoose from "mongoose";
import dotenv from "dotenv";
import {logger} from "./logger.env.js"
dotenv.config()


export const connectToDb = async()=>{
    try {
        await mongoose.connect(process.env.MONOG_URI)
        logger.info("connected to the database")
        process.exit(0)
    } catch (error) {
        logger.error("Failed to connect to the database");
        process.exit(1)
    }
};