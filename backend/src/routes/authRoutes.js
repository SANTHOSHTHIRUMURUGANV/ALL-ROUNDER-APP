import express from 'express';
import { getMe, updateLocation, depositWallet, switchRole } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.put('/location', protect, updateLocation);
router.put('/wallet', protect, depositWallet);
router.put('/role', protect, switchRole);

export default router;
