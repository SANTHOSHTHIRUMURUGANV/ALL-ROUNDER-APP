import { Partner } from '../models/Partner.js';
import { Booking } from '../models/Booking.js';
import { User } from '../models/User.js';
import { FraudLog } from '../models/FraudLog.js';

export const approvePartner = async (req, res, next) => {
  try {
    const { id } = req.params;
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

export const getFraudLogs = async (req, res, next) => {
  try {
    const logs = await FraudLog.find({}).sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

export const dismissFraudLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    await FraudLog.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Fraud alert cleared.' });
  } catch (error) {
    next(error);
  }
};

export const getAdminSummary = async (req, res, next) => {
  try {
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
