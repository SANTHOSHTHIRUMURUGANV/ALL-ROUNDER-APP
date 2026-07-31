import express from 'express';
import { createBooking, getBookings, updateBookingStatus, getBookingById, deleteBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/', protect, getBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, updateBookingStatus);
router.delete('/:id', protect, deleteBooking);

export default router;
