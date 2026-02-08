import { Router } from 'express';
import { summary } from '../controllers/dashboardController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.get('/summary', asyncHandler(summary));

export default router;
