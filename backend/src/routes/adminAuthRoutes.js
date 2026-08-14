import express from 'express';
import { loginAdmin, verifyAdminOtp, resendAdminOtp } from '../controllers/adminAuthController.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/verify', verifyAdminOtp);
router.post('/resend', resendAdminOtp);

export default router;
