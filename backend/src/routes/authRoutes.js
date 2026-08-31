import express from 'express';
import { login, callback, getMe, logout } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { authRateLimiter } from '../middlewares/rateLimitMiddleware.js';

const router = express.Router();

router.get('/login', authRateLimiter, login);
router.get('/callback', authRateLimiter, callback);
router.get('/me', requireAuth, getMe);
router.post('/logout', requireAuth, logout);

export default router;
