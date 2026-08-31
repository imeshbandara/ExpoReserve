import express from 'express';
import { 
  createReservation, 
  getMyReservations, 
  getReservationDetails, 
  updateReservation, 
  cancelReservation 
} from '../controllers/reservationController.js';
import { auditLog } from '../middlewares/auditMiddleware.js';

const router = express.Router();

router.post('/', auditLog('CREATE_RESERVATION', 'reservations'), createReservation);
router.get('/', getMyReservations);
router.get('/:id', getReservationDetails);
router.put('/:id', auditLog('UPDATE_RESERVATION', 'reservations'), updateReservation);
router.delete('/:id', auditLog('CANCEL_RESERVATION', 'reservations'), cancelReservation);

export default router;
