import express from 'express';
import { validateCoupon, getCoupons, createCoupon } from '../controllers/couponController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/validate', protect, validateCoupon);
router.get('/', protect, getCoupons);
router.post('/', protect, createCoupon);

export default router;
