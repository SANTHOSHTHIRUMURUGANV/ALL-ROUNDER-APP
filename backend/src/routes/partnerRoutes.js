import express from 'express';
import { onboardPartner, getNearbyPartners, updatePartnerProfile } from '../controllers/partnerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/onboard', protect, onboardPartner);
router.get('/nearby', protect, getNearbyPartners);
router.put('/profile', protect, updatePartnerProfile);

export default router;
