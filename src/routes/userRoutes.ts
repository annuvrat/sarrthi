import { Router } from 'express';
import { body } from 'express-validator';
import { createUser, listUsers } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { ROLES } from '../config/constants.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(authenticate, authorize('admin'));

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('role').isIn(ROLES.filter((r) => r !== 'student')).withMessage('Invalid role'),
    validate,
  ],
  asyncHandler(createUser)
);

router.get('/', asyncHandler(listUsers));

export default router;
