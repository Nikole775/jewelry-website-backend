// routes/authRoutes.js
import express from 'express';
import { login, register } from '../controller/authController.js'; // Adjust path if needed

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

export default router;
