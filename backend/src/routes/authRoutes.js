import express from 'express';
import { register, login, getMe, updateLocation, depositWallet, switchRole } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/location', protect, updateLocation);
router.put('/wallet', protect, depositWallet);
router.put('/role', protect, switchRole);

export default router;
