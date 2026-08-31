import express from 'express';
import { 
  getAllReservations, 
  updateReservationStatus, 
  createExhibition, 
  getMyExhibitions, 
  updateExhibition, 
  deleteExhibition, 
  upsertStallInventory 
} from '../controllers/adminController.js';
import { auditLog } from '../middlewares/auditMiddleware.js';

const router = express.Router();

// Reservations
router.get('/reservations', getAllReservations);
router.patch('/reservations/:id/approve', auditLog('APPROVE_RESERVATION', 'reservations'), updateReservationStatus('APPROVED'));
router.patch('/reservations/:id/reject', auditLog('REJECT_RESERVATION', 'reservations'), updateReservationStatus('REJECTED'));

// Exhibitions
router.post('/exhibitions', auditLog('CREATE_EXHIBITION', 'exhibitions'), createExhibition);
router.get('/exhibitions', getMyExhibitions);
router.put('/exhibitions/:id', auditLog('UPDATE_EXHIBITION', 'exhibitions'), updateExhibition);
router.delete('/exhibitions/:id', auditLog('DELETE_EXHIBITION', 'exhibitions'), deleteExhibition);

// Stall Inventory
router.post('/stall-inventory', auditLog('UPSERT_INVENTORY', 'stall_inventory'), upsertStallInventory);
router.put('/stall-inventory/:id', auditLog('UPDATE_INVENTORY', 'stall_inventory'), upsertStallInventory);

export default router;
