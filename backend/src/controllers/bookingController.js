import { Booking } from '../models/Booking.js';
import { Partner } from '../models/Partner.js';
import mongoose from 'mongoose';

// In-Memory fallback database simulation when offline
export const IN_MEMORY_BOOKINGS = [];

export const createBooking = async (req, res, next) => {
  try {
    const { category, categoryIcon, title, providerName, providerPhone, price, notes } = req.body;
    
    const routeCoordinates = [];
    for (let i = 0; i < 10; i++) {
      routeCoordinates.push({
        x: 50 + Math.sin(i) * 30,
        y: 50 + Math.cos(i) * 30
      });
    }

    const bookingId = `BK-${Date.now().toString().slice(-6)}`;
    const newBookingData = {
      id: bookingId,
      _id: bookingId,
      customerId: req.user?._id || 'mock-customer-id',
      partnerId: 'mock-partner-id',
      category,
      categoryIcon,
      title,
      providerName: providerName || 'Rajesh Kumar',
      providerPhone: providerPhone || '+91 98765 22222',
      price,
      amount: price,
      date: new Date().toLocaleDateString(),
      bookingDate: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString().substring(0, 5),
      bookingTime: new Date().toLocaleTimeString().substring(0, 5),
      status: 'pending',
      bookingStatus: 'pending',
      progress: 0,
      routeCoordinates,
      currentPosIndex: 0,
      notes: notes || '',
      createdAt: new Date()
    };

    if (mongoose.connection.readyState !== 1) {
      IN_MEMORY_BOOKINGS.unshift(newBookingData);
      if (req.io) {
        req.io.emit('bookingCreated', newBookingData);
      }
      return res.status(201).json(newBookingData);
    }

    const partner = await Partner.findOne({ name: providerName });

    const booking = await Booking.create({
      customerId: req.user._id,
      partnerId: partner ? partner._id : null,
      category,
      service: category,
      categoryIcon,
      title,
      providerName,
      providerPhone,
      price,
      amount: price,
      date: new Date().toLocaleDateString(),
      bookingDate: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString().substring(0, 5),
      bookingTime: new Date().toLocaleTimeString().substring(0, 5),
      status: 'pending',
      bookingStatus: 'pending',
      notes: notes || '',
      progress: 0,
      routeCoordinates,
      currentPosIndex: 0
    });

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
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json(IN_MEMORY_BOOKINGS);
    }

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
    const { status, bookingStatus, progress, currentPosIndex, paymentStatus } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const booking = IN_MEMORY_BOOKINGS.find(b => b.id === id || b._id === id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking entry not found' });
      }

      if (status !== undefined) {
        booking.status = status;
        booking.bookingStatus = status;
      }
      if (bookingStatus !== undefined) {
        booking.status = bookingStatus;
        booking.bookingStatus = bookingStatus;
      }
      if (progress !== undefined) booking.progress = progress;
      if (currentPosIndex !== undefined) booking.currentPosIndex = currentPosIndex;
      if (paymentStatus !== undefined) booking.paymentStatus = paymentStatus;

      if (req.io) {
        req.io.emit('bookingUpdated', booking);
      }
      return res.status(200).json(booking);
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking entry not found' });
    }

    if (status !== undefined) {
      booking.status = status;
      booking.bookingStatus = status;
    }
    if (bookingStatus !== undefined) {
      booking.status = bookingStatus;
      booking.bookingStatus = bookingStatus;
    }
    if (progress !== undefined) booking.progress = progress;
    if (currentPosIndex !== undefined) booking.currentPosIndex = currentPosIndex;
    if (paymentStatus !== undefined) booking.paymentStatus = paymentStatus;

    await booking.save();

    if (req.io) {
      req.io.emit('bookingUpdated', booking);
    }

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      const b = IN_MEMORY_BOOKINGS.find(x => x.id === id || x._id === id);
      return res.status(200).json(b || IN_MEMORY_BOOKINGS[0]);
    }
    const booking = await Booking.findById(id).populate('customerId partnerId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      const idx = IN_MEMORY_BOOKINGS.findIndex(x => x.id === id || x._id === id);
      if (idx !== -1) IN_MEMORY_BOOKINGS.splice(idx, 1);
      return res.status(200).json({ message: 'Booking deleted' });
    }
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    next(error);
  }
};
