import { Router } from 'express';
import { body } from 'express-validator';
import {
  createEvaluation,
  getPendingSubmissions,
  getStudentEvaluations,
  listEvaluations,
} from '../controllers/evaluationController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/pending', authenticate, authorize('admin', 'evaluator'), asyncHandler(getPendingSubmissions));

router.post(
  '/',
  authenticate,
  authorize('admin', 'evaluator'),
  [
    body('submissionId').notEmpty(),
    body('score').isInt({ min: 0, max: 100 }),
    body('strengths').notEmpty(),
    body('weaknesses').notEmpty(),
    body('suggestions').notEmpty(),
    validate,
  ],
  asyncHandler(createEvaluation)
);

router.get('/', authenticate, authorize('admin', 'evaluator'), asyncHandler(listEvaluations));
router.get('/student/me', authenticate, authorize('student'), asyncHandler(getStudentEvaluations));

export default router;
