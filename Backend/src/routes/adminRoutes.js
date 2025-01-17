import express from "express";
import { 
    authenticateToken, 
    authorizeRole 
} from "../middleware/auth.js";
import { 
    getAuditLog, 
    manageUserPermissions, 
    generateAdminReport 
} from "../controllers/adminController.js";
const router = express.Router();
const isAdmin = authorizeRole(["admin", "superadmin"]);
router.get("/audit-log", authenticateToken, isAdmin, getAuditLog);
router.post("/manage-permissions", authenticateToken, isAdmin, manageUserPermissions);
router.post("/generate-report", authenticateToken, isAdmin, generateAdminReport);

export default router;
