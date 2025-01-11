import express from 'express';
import authenticateToken  from '../middlewares/auth.js'; // Import Middleware
import { getUserDetails } from '../controllers/users.js'; // Import Controller

const router = express.Router();

// ใช้ Middleware verifyToken ก่อนเข้าสู่ Controller
router.get('/me', authenticateToken, getUserDetails);

export default router;
