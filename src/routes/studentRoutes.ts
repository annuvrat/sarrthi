import { Router } from 'express';
import { body } from 'express-validator';
import {
  createStudent,
  getMentorStudents,
  getStudent,
  listStudents,
  updateStudent,
} from '../controllers/studentController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('mobile').notEmpty(),
    body('targetYear').isInt({ min: 2024, max: 2035 }),
    validate,
  ],
  asyncHandler(createStudent)
);

router.get('/', authenticate, authorize('admin'), asyncHandler(listStudents));
router.get('/mentor/assigned', authenticate, authorize('mentor', 'admin'), asyncHandler(getMentorStudents));
router.get('/:id', authenticate, authorize('admin'), asyncHandler(getStudent));
router.patch('/:id', authenticate, authorize('admin'), asyncHandler(updateStudent));

export default router;
