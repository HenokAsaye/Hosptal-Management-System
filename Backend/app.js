import express from "express";
import cookieParser from 'cookie-parser';
import cors from "cors";
import authRoute from "./src/routes/authRoutes.js";
import doctorroute from "./src/routes/doctorRoute.js";
import patientroute from "./src/routes/patientRoutes.js";
import receptionroute from "./src/routes/receptionRoute.js";
import inventoryroute from "./src/routes/inventoryRoutes.js";
import labroute from "./src/routes/labRoute.js";
import notificationroute from "./src/routes/notificationRoutes.js";
import { authenticateToken } from "./src/middleware/auth.js";
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin:'http:localhost:3000'
}))
app.use(express.urlencoded({extended:true}))
app.use("/auth",authRoute);
app.use("/doctor",doctorroute);
app.use("/patient",patientroute);
app.use("/reception",receptionroute);
app.use("/inventory",inventoryroute);
app.use("lab",labroute);
app.use("/notification",notificationroute)
app.use(authenticateToken);
export default app;
