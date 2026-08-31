import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler.js';
import { UPLOAD_DIR } from './middlewares/uploadMiddleware.js';
import { prisma } from './config/db.js';
export { prisma };

import authRoutes from './routes/authRoutes.js';
// We will import new routes here later
import adminRoutes from './routes/adminRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import exhibitionRoutes from './routes/exhibitionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { requireAuth, requireRole } from './middlewares/authMiddleware.js';

import './events/listeners.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json({ limit: '100kb' })); // JSON body parsing
app.use(cookieParser()); // Parse cookies
app.use(morgan('dev')); // Request logger

// Serve static upload files
app.use('/uploads', express.static(UPLOAD_DIR, {
  fallthrough: false,
  index: false,
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
}));

// Auth Route
app.use('/api/auth', authRoutes);

// Other routes
app.use('/api/admin', requireAuth, requireRole('EXHIBITION_ORGANIZER'), adminRoutes);
app.use('/api/reservations', requireAuth, requireRole('STALL_VENDOR'), reservationRoutes);
app.use('/api/exhibitions', requireAuth, exhibitionRoutes);
app.use('/api/user', requireAuth, userRoutes);

// Health check route
app.get('/health', async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: error.message });
  }
});

// Global Error Handler
app.use(errorHandler);

export default app;
