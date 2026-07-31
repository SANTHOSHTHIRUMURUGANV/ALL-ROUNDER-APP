import express from 'express';
import { createStripeIntent, createRazorpayOrder, processWalletPayment, createPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createPayment);
router.post('/stripe/intent', protect, createStripeIntent);
router.post('/razorpay/order', protect, createRazorpayOrder);
router.post('/wallet/pay', protect, processWalletPayment);

export default router;
