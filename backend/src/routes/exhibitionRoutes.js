import express from 'express';
import { getAvailableExhibitions } from '../controllers/exhibitionController.js';

const router = express.Router();

router.get('/', getAvailableExhibitions);

export default router;
