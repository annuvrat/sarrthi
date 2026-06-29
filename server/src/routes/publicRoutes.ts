import { Router } from 'express';
import { body } from 'express-validator';
import { analyzeReadiness } from '../controllers/notificationController.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post(
  '/readiness',
  [
    body('dailyHours').isFloat({ min: 0, max: 24 }),
    body('mockTests').isInt({ min: 0 }),
    body('stage').isIn(['Beginner', 'Intermediate', 'Advanced']),
    validate,
  ],
  asyncHandler(analyzeReadiness)
);

export default router;
