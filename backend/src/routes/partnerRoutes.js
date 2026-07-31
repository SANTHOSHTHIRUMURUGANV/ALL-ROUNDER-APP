import express from 'express';
import { 
  onboardPartner, 
  getNearbyPartners, 
  updatePartnerProfile,
  registerPartner,
  getPartners,
  getPartnerById,
  updatePartner,
  approvePartner,
  rejectPartner,
  deletePartner
} from '../controllers/partnerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/onboard', protect, onboardPartner);
router.post('/register', protect, registerPartner);
router.get('/nearby', protect, getNearbyPartners);
router.put('/profile', protect, updatePartnerProfile);

router.get('/', protect, getPartners);
router.get('/:id', protect, getPartnerById);
router.put('/:id', protect, updatePartner);
router.put('/:id/approve', protect, approvePartner);
router.put('/:id/reject', protect, rejectPartner);
router.delete('/:id', protect, deletePartner);

export default router;
