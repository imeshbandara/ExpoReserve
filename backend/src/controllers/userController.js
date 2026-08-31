import { prisma } from '../config/db.js';
import { validateBody } from '../utils/validation.js';
import { updateUserProfileSchema } from '../utils/validation.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    res.json(user);
  } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const data = validateBody(updateUserProfileSchema, req.body);
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data
    });
    res.json(updated);
  } catch (err) { next(err); }
};
