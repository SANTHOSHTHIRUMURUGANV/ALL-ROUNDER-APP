import { Partner } from '../models/Partner.js';
import { Booking } from '../models/Booking.js';
import { User } from '../models/User.js';
import { FraudLog } from '../models/FraudLog.js';
import { Payment } from '../models/Payment.js';
import { Review } from '../models/Review.js';
import { Notification } from '../models/Notification.js';
import { MOCK_PARTNERS } from './partnerController.js';
import { IN_MEMORY_BOOKINGS } from './bookingController.js';
import mongoose from 'mongoose';

// In-memory fraud warnings fallback database
const MOCK_FRAUD_LOGS = [
  {
    _id: 'FL-101',
    id: 'FL-101',
    type: 'Biometric Discrepancy',
    target: 'Karan Malhotra (Painter)',
    reason: 'Aadhaar document verification flagged fingerprint indexing mismatch.',
    riskScore: 94,
    status: 'Blocked',
    time: '12 mins ago'
  },
  {
    _id: 'FL-102',
    id: 'FL-102',
    type: 'Booking Velocity anomaly',
    target: 'Client_Vipul89',
    reason: 'Initiated 12 concurrent requests to distinct coordinates in 40 seconds.',
    riskScore: 89,
    status: 'Auditing',
    time: '3 hrs ago'
  }
];

export const approvePartner = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      const partner = MOCK_PARTNERS.find(p => p.id === id || p._id === id);
      if (partner) partner.adminStatus = 'approved';
      return res.status(200).json({ id, adminStatus: 'approved' });
    }

    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner profile not found' });
    }
    partner.adminStatus = 'approved';
    await partner.save();

    res.status(200).json(partner);
  } catch (error) {
    next(error);
  }
};

export const rejectPartner = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      const partner = MOCK_PARTNERS.find(p => p.id === id || p._id === id);
      if (partner) partner.adminStatus = 'rejected';
      return res.status(200).json({ id, adminStatus: 'rejected' });
    }

    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner profile not found' });
    }
    partner.adminStatus = 'rejected';
    await partner.save();

    res.status(200).json(partner);
  } catch (error) {
    next(error);
  }
};

export const reviewPartner = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      const partner = MOCK_PARTNERS.find(p => p.id === id || p._id === id);
      if (partner) partner.adminStatus = 'review';
      return res.status(200).json({ id, adminStatus: 'review' });
    }

    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner profile not found' });
    }
    partner.adminStatus = 'review';
    await partner.save();

    res.status(200).json(partner);
  } catch (error) {
    next(error);
  }
};

export const getFraudLogs = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json(MOCK_FRAUD_LOGS);
    }
    const logs = await FraudLog.find({}).sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

export const dismissFraudLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      const idx = MOCK_FRAUD_LOGS.findIndex(l => l.id === id || l._id === id);
      if (idx !== -1) MOCK_FRAUD_LOGS.splice(idx, 1);
      return res.status(200).json({ success: true, message: 'Fraud alert cleared.' });
    }
    await FraudLog.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Fraud alert cleared.' });
  } catch (error) {
    next(error);
  }
};

export const getAdminSummary = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const activePartnersCount = MOCK_PARTNERS.filter(p => p.isOnline && p.adminStatus === 'approved').length;
      const totalBookingsCount = IN_MEMORY_BOOKINGS.length;
      const totalRevenue = IN_MEMORY_BOOKINGS.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0);
      const commissions = (totalRevenue * 12.5) / 100;
      
      return res.status(200).json({
        totalRevenue,
        commissions,
        activePartnersCount,
        totalBookingsCount,
        customersCount: 1
      });
    }

    const bookings = await Booking.find({});
    const partners = await Partner.find({});
    const customersCount = await User.countDocuments({ role: 'customer' });

    const totalRevenue = bookings.reduce((sum, b) => sum + b.price, 0);
    const commissions = (totalRevenue * 12.5) / 100;

    res.status(200).json({
      totalRevenue,
      commissions,
      activePartnersCount: partners.filter(p => p.isOnline).length,
      totalBookingsCount: bookings.length,
      customersCount
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json([
        { id: 'mock-u-123', _id: 'mock-u-123', uid: 'mock-user-123', name: 'Suresh Kumar', email: 'suresh@allrounder.com', phone: '+91 99999 88888', role: 'customer', walletBalance: 0, isBlocked: false, createdAt: new Date() },
        { id: 'mock-admin-123', _id: 'mock-admin-123', uid: 'admin-mock-123', name: 'Admin Account', email: 'admin@allrounder.com', phone: '+91 99999 00000', role: 'admin', walletBalance: 99999, isBlocked: false, createdAt: new Date() }
      ]);
    }
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const toggleBlockUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ id, isBlocked });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.role = isBlocked ? 'blocked' : 'customer';
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getPartners = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json(MOCK_PARTNERS);
    }
    const partners = await Partner.find({}).sort({ createdAt: -1 });
    res.status(200).json(partners);
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json(IN_MEMORY_BOOKINGS);
    }
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

export const getPayments = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const mockPayments = IN_MEMORY_BOOKINGS.map((b, i) => ({
        id: `pay-${i}`,
        _id: `pay-${i}`,
        userId: b.userId || 'mock-u-123',
        bookingId: b.id,
        amount: b.price,
        currency: 'INR',
        status: b.status === 'completed' ? 'success' : 'pending',
        gateway: b.paymentMethod === 'online' ? 'stripe' : 'wallet',
        gatewayPaymentId: `ch_${Date.now()}_${i}`,
        createdAt: b.createdAt || new Date()
      }));
      return res.status(200).json(mockPayments);
    }
    const payments = await Payment.find({}).sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json([]);
    }
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json([]);
    }
    const notifications = await Notification.find({}).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

export const createBroadcast = async (req, res, next) => {
  try {
    const { title, message, type } = req.body;
    if (mongoose.connection.readyState !== 1) {
      const mockNotif = {
        id: `n-${Date.now()}`,
        _id: `n-${Date.now()}`,
        title,
        message,
        type: type || 'info',
        time: new Date().toLocaleTimeString().substring(0, 5),
        createdAt: new Date()
      };
      return res.status(201).json(mockNotif);
    }
    const notif = await Notification.create({ title, message, type: type || 'info' });
    res.status(201).json(notif);
  } catch (error) {
    next(error);
  }
};
