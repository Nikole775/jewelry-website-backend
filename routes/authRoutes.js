// routes/authRoutes.js
import express from 'express';
import { login, register, verifyCode } from '../controller/authController.js'; // Adjust path if needed

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verify-code', verifyCode);

export default router;
