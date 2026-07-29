import express from 'express';
import { approvePartner, rejectPartner, getFraudLogs, dismissFraudLog, getAdminSummary } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/partners/:id/approve', protect, authorize('admin'), approvePartner);
router.put('/partners/:id/reject', protect, authorize('admin'), rejectPartner);
router.get('/fraud', protect, authorize('admin'), getFraudLogs);
router.delete('/fraud/:id', protect, authorize('admin'), dismissFraudLog);
router.get('/summary', protect, authorize('admin'), getAdminSummary);

export default router;
