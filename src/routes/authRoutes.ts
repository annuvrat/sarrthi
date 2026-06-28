import { Router } from 'express';
import { body } from 'express-validator';
import { login, logout, refresh } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post(
  '/login',
  [body('email').isEmail().withMessage('Valid email required'), body('password').notEmpty().withMessage('Password required'), validate],
  asyncHandler(login)
);

router.post('/refresh', [body('refreshToken').notEmpty().withMessage('Refresh token required'), validate], asyncHandler(refresh));

router.post('/logout', authenticate, asyncHandler(logout));

export default router;
