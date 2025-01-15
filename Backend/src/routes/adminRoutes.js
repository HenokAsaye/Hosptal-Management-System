// import express from 'express';
// import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware.js';
// import { addAdmin } from '../controllers/adminController.js';

// const router = express.Router();

// // Route to add new admin (only accessible by the initial admin)
// router.post('/add-admin', authenticateToken, authorizeAdmin, addAdmin);

// export default router;



// export const authorizeAdmin = (req, res, next) => {
//     const initialAdminEmail = process.env.INITIAL_ADMIN_EMAIL;  // 
  
//     // Check if the logged-in user is the initial admin
//     if (req.user.email !== initialAdminEmail) {
//       return res.status(403).json({ message: "You are not authorized to add admins." });
//     }
  
//     next();
//   };