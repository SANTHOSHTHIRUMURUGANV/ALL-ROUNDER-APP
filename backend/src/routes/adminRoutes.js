import express from 'express';
import { 
  approvePartner, rejectPartner, reviewPartner, getFraudLogs, dismissFraudLog, getAdminSummary,
  getUsers, toggleBlockUser, getPartners, getBookings, getPayments, getReviews, getNotifications, createBroadcast
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/partners/:id/approve', protect, authorize('admin'), approvePartner);
router.put('/partners/:id/reject', protect, authorize('admin'), rejectPartner);
router.put('/partners/:id/review', protect, authorize('admin'), reviewPartner);
router.get('/fraud', protect, authorize('admin'), getFraudLogs);
router.delete('/fraud/:id', protect, authorize('admin'), dismissFraudLog);
router.get('/summary', protect, authorize('admin'), getAdminSummary);

// Collection lists for Google Sheets admin grid
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id/block', protect, authorize('admin'), toggleBlockUser);
router.get('/partners', protect, authorize('admin'), getPartners);
router.get('/bookings', protect, authorize('admin'), getBookings);
router.get('/payments', protect, authorize('admin'), getPayments);
router.get('/reviews', protect, authorize('admin'), getReviews);
router.get('/notifications', protect, authorize('admin'), getNotifications);
router.post('/broadcast', protect, authorize('admin'), createBroadcast);

export default router;
