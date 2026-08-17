import express from 'express';
import { loginController } from '../controllers/auth.controller.js';
import { loginLimiter } from '../middleware/limitter.js';
const router = express.Router();

router.post('/login', loginController);

export default router;