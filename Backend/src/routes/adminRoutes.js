import express from "express";
import { 
    getAuditLog, 
    manageUserPermissions, 
    generateAdminReport ,
    getAllUsers, 
    updateUserDetails,
    firstAdminLogin,
    inviteAdmin,
    countAllUsers,
    deleteUser
} from "../controllers/adminController.js";
const router = express.Router();
router.get("/users", getAllUsers);
router.put("/user", updateUserDetails);
router.post("/firstadmin",firstAdminLogin)
router.post("/inviteadmin",inviteAdmin)
router.get("/allusers",countAllUsers)
router.delete("/delete-User",deleteUser)
export default router;
