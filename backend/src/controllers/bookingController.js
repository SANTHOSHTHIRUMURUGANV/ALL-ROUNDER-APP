import { Booking } from '../models/Booking.js';
import { Partner } from '../models/Partner.js';

export const createBooking = async (req, res, next) => {
  try {
    const { category, categoryIcon, title, providerName, providerPhone, price } = req.body;
    
    // Auto find provider model if match
    const partner = await Partner.findOne({ name: providerName });

    const routeCoordinates = [];
    for (let i = 0; i < 10; i++) {
      routeCoordinates.push({
        x: 50 + Math.sin(i) * 30,
        y: 50 + Math.cos(i) * 30
      });
    }

    const booking = await Booking.create({
      customerId: req.user._id,
      partnerId: partner ? partner._id : null,
      category,
      categoryIcon,
      title,
      providerName,
      providerPhone,
      price,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString().substring(0, 5),
      status: 'pending',
      progress: 0,
      routeCoordinates,
      currentPosIndex: 0
    });

    // Emit live booking created notification to Socket clients
    if (req.io) {
      req.io.emit('bookingCreated', booking);
    }

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'partner') {
      const partner = await Partner.findOne({ userId: req.user._id });
      if (partner) {
        query.partnerId = partner._id;
      }
    } else if (req.user.role === 'customer') {
      query.customerId = req.user._id;
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, progress, currentPosIndex } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking entry not found' });
    }

    if (status !== undefined) booking.status = status;
    if (progress !== undefined) booking.progress = progress;
    if (currentPosIndex !== undefined) booking.currentPosIndex = currentPosIndex;

    await booking.save();

    // Broadcast update status changes in real-time
    if (req.io) {
      req.io.emit('bookingUpdated', booking);
    }

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};
