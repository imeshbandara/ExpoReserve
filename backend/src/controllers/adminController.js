import { prisma } from '../config/db.js';
import { validateBody } from '../utils/validation.js';
import { 
  createExhibitionSchema, 
  updateExhibitionSchema, 
  upsertStallInventorySchema 
} from '../utils/validation.js';

// Reservations
export const getAllReservations = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    
    // In a real app, an organizer should only see reservations for their exhibitions
    // For simplicity based on prompt, admins see all (or filter by organizer_id)
    const reservations = await prisma.reservation.findMany({
      where: {
        ...where,
        exhibition: {
          organizer_id: req.user.id
        }
      },
      include: {
        vendor: { select: { name: true, email: true, organization_name: true } },
        exhibition: { select: { name: true } }
      },
      orderBy: { created_at: 'desc' }
    });
    res.json(reservations);
  } catch (err) { next(err); }
};

export const updateReservationStatus = (status) => async (req, res, next) => {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: req.params.id },
      include: { exhibition: true }
    });

    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    if (reservation.exhibition.organizer_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized for this exhibition' });
    }

    const updated = await prisma.reservation.update({
      where: { id: req.params.id },
      data: { status }
    });
    
    // If approved, decrement reserved_count (if logic requires it) or track it.
    // For now, we assume reserved_count is managed separately or tracked here.
    if (status === 'APPROVED' && reservation.status !== 'APPROVED') {
      await prisma.stallInventory.update({
        where: {
          exhibition_id_stall_type_stall_size: {
            exhibition_id: reservation.exhibition_id,
            stall_type: reservation.stall_type,
            stall_size: reservation.stall_size
          }
        },
        data: { reserved_count: { increment: reservation.quantity } }
      });
    } else if (status !== 'APPROVED' && reservation.status === 'APPROVED') {
      // Revert reservation count
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

// Exhibitions
export const createExhibition = async (req, res, next) => {
  try {
    const data = validateBody(createExhibitionSchema, req.body);
    const exhibition = await prisma.exhibition.create({
      data: {
        ...data,
        organizer_id: req.user.id,
      }
    });
    res.status(201).json(exhibition);
  } catch (err) { next(err); }
};

export const getMyExhibitions = async (req, res, next) => {
  try {
    const exhibitions = await prisma.exhibition.findMany({
      where: { organizer_id: req.user.id },
      orderBy: { start_date: 'asc' }
    });
    res.json(exhibitions);
  } catch (err) { next(err); }
};

export const updateExhibition = async (req, res, next) => {
  try {
    const data = validateBody(updateExhibitionSchema, req.body);
    const exhibition = await prisma.exhibition.findUnique({ where: { id: req.params.id }});
    if (!exhibition || exhibition.organizer_id !== req.user.id) {
      return res.status(404).json({ error: 'Exhibition not found or unauthorized' });
    }
    const updated = await prisma.exhibition.update({
      where: { id: req.params.id },
      data
    });
    res.json(updated);
  } catch (err) { next(err); }
};

export const deleteExhibition = async (req, res, next) => {
  try {
    const exhibition = await prisma.exhibition.findUnique({ where: { id: req.params.id }});
    if (!exhibition || exhibition.organizer_id !== req.user.id) {
      return res.status(404).json({ error: 'Exhibition not found or unauthorized' });
    }
    await prisma.exhibition.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) { next(err); }
};

// Stall Inventory
export const upsertStallInventory = async (req, res, next) => {
  try {
    const data = validateBody(upsertStallInventorySchema, req.body);
    
    // Verify ownership
    const exhibition = await prisma.exhibition.findUnique({ where: { id: data.exhibition_id }});
    if (!exhibition || exhibition.organizer_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const inventory = await prisma.stallInventory.upsert({
      where: {
        exhibition_id_stall_type_stall_size: {
          exhibition_id: data.exhibition_id,
          stall_type: data.stall_type,
          stall_size: data.stall_size
        }
      },
      update: { total_count: data.total_count },
      create: {
        exhibition_id: data.exhibition_id,
        stall_type: data.stall_type,
        stall_size: data.stall_size,
        total_count: data.total_count,
        reserved_count: 0
      }
    });
    res.status(200).json(inventory);
  } catch (err) { next(err); }
};
