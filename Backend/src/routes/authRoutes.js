import {Router} from "express";
import {signup,verifyEmail,login,logOut,forgotPassword,resetPassword} from "../controllers/authController.js";
const router = Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/verifyEmail",verifyEmail);
router.delete("/logout",logOut);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:token", resetPassword);


export default router;