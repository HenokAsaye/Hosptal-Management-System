import {Router} from 'express';
import { createLabResult } from '../controllers/labResultController.js';
import { authorizeRole } from '../middleware/auth.js';
 const router = Router()

 router.post('/createlabResult',authorizeRole('labtecnicial'),createLabResult)

 export default router;