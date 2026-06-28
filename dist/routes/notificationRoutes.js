import { Router } from 'express';
import { getNotifications, markNotificationRead } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router = Router();
router.get('/', authenticate, asyncHandler(getNotifications));
router.patch('/:id/read', authenticate, asyncHandler(markNotificationRead));
export default router;
