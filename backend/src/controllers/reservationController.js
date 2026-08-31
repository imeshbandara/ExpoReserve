import { prisma } from '../config/db.js';
import { validateBody } from '../utils/validation.js';
import { createReservationSchema, updateReservationSchema } from '../utils/validation.js';

export const createReservation = async (req, res, next) => {
  try {
    const data = validateBody(createReservationSchema, req.body);
    
    // Check if exhibition exists and is not in the past (simplified)
    const exhibition = await prisma.exhibition.findUnique({ where: { id: data.exhibition_id } });
    if (!exhibition) return res.status(404).json({ error: 'Exhibition not found' });
    
    // In a robust system, we check stall inventory availability here
    const inventory = await prisma.stallInventory.findUnique({
      where: {
        exhibition_id_stall_type_stall_size: {
          exhibition_id: data.exhibition_id,
          stall_type: data.stall_type,
          stall_size: data.stall_size
        }
      }
    });

    if (!inventory || inventory.total_count - inventory.reserved_count < data.quantity) {
      return res.status(400).json({ error: 'Not enough stall inventory available' });
    }

    const reservation = await prisma.reservation.create({
      data: {
        ...data,
        vendor_id: req.user.id
      }
    });
    res.status(201).json(reservation);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'You already have a reservation for this exhibition' });
    }
    next(err); 
  }
};

export const getMyReservations = async (req, res, next) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { vendor_id: req.user.id },
      include: {
        exhibition: {
          select: { name: true, start_date: true, end_date: true, venue: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    res.json(reservations);
  } catch (err) { next(err); }
};

export const getReservationDetails = async (req, res, next) => {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: req.params.id },
      include: { exhibition: true }
    });
    if (!reservation || reservation.vendor_id !== req.user.id) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (err) { next(err); }
};

export const updateReservation = async (req, res, next) => {
  try {
    const data = validateBody(updateReservationSchema, req.body);
    const reservation = await prisma.reservation.findUnique({ where: { id: req.params.id } });
    
    if (!reservation || reservation.vendor_id !== req.user.id) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    if (reservation.status !== 'PENDING') {
      return res.status(400).json({ error: 'Only pending reservations can be modified' });
    }

    const updated = await prisma.reservation.update({
      where: { id: req.params.id },
      data
    });
    res.json(updated);
  } catch (err) { next(err); }
};

export const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await prisma.reservation.findUnique({ where: { id: req.params.id } });
    
    if (!reservation || reservation.vendor_id !== req.user.id) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const updated = await prisma.reservation.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' }
    });

    // If it was previously approved, free up the inventory
    if (reservation.status === 'APPROVED') {
      await prisma.stallInventory.update({
        where: {
          exhibition_id_stall_type_stall_size: {
            exhibition_id: reservation.exhibition_id,
            stall_type: reservation.stall_type,
            stall_size: reservation.stall_size
          }
        },
        data: { reserved_count: { decrement: reservation.quantity } }
      });
    }

    res.json(updated);
  } catch (err) { next(err); }
};
