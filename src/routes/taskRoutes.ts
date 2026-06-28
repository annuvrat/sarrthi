import { Router } from 'express';
import { body } from 'express-validator';
import { createTask, getStudentTasks, listTasks, updateTaskStatus } from '../controllers/taskController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { TASK_PRIORITY } from '../config/constants.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('admin', 'mentor'),
  [
    body('studentId').notEmpty(),
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('dueDate').isISO8601(),
    body('priority').optional().isIn(TASK_PRIORITY),
    validate,
  ],
  asyncHandler(createTask)
);

router.get('/', authenticate, authorize('admin', 'mentor'), asyncHandler(listTasks));
router.get('/student/me', authenticate, authorize('student'), asyncHandler(getStudentTasks));
router.patch('/:id/status', authenticate, authorize('admin', 'mentor'), asyncHandler(updateTaskStatus));

export default router;
