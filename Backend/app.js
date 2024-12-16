import express from "express";
import cookieParser from 'cookie-parser';
import authRoute from "./src/routes/authRoutes.js";
import { authenticateToken } from "./src/middleware/auth.js";
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use("/auth",authRoute);
app.use(authenticateToken);
export default app;
