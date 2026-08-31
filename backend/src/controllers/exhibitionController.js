import { prisma } from '../config/db.js';

export const getAvailableExhibitions = async (req, res, next) => {
  try {
    const exhibitions = await prisma.exhibition.findMany({
      where: {
        end_date: {
          gte: new Date()
        }
      },
      include: {
        stall_inventory: true
      },
      orderBy: { start_date: 'asc' }
    });
    res.json(exhibitions);
  } catch (err) { next(err); }
};
