import { Router } from 'express';
import { createStudyPlan, listStudyPlans } from '../controllers/aiController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/study-plan', authenticate, authorize('admin', 'student'), asyncHandler(createStudyPlan));
router.get('/study-plans', authenticate, authorize('admin', 'student'), asyncHandler(listStudyPlans));

export default router;
