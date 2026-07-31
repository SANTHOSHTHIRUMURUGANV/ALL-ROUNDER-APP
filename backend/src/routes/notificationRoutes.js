import express from 'express';
import { getNotificationsByUserId } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:userId', protect, getNotificationsByUserId);

export default router;
