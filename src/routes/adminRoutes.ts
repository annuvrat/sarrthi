import { Router } from 'express';
import { getAdminAnalytics } from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/analytics', authenticate, authorize('admin'), asyncHandler(getAdminAnalytics));

export default router;
