import express from "express";
import cookieParser from 'cookie-parser';
import cors from "cors";
import authRoute from "./src/routes/authRoutes.js";
import { authenticateToken } from "./src/middleware/auth.js";
const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use("/auth",authRoute);
app.use(authenticateToken);
export default app;
