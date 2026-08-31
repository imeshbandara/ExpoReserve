import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { getMyReservations } from '../controllers/reservationController.js';
import { auditLog } from '../middlewares/auditMiddleware.js';

const router = express.Router();

router.get('/profile', getProfile);
router.put('/profile', auditLog('UPDATE_PROFILE', 'users'), updateProfile);
// Alias for get my reservations
router.get('/reservations', getMyReservations);

export default router;
