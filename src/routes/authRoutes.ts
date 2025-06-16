import express from 'express';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.me);
router.get('/verify-email', authController.verifyEmail);
router.post('/refresh', authController.refresh);

export default router;
