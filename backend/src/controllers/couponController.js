import { Coupon } from '../models/Coupon.js';
import mongoose from 'mongoose';

const MOCK_COUPONS = [
  { code: 'CAB50', discount: 15, active: true },
  { code: 'FREEVISIT', discount: 20, active: true }
];

export const validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const searchCode = code.toUpperCase();

    if (mongoose.connection.readyState !== 1) {
      const coupon = MOCK_COUPONS.find(c => c.code === searchCode && c.active);
      if (!coupon) {
        return res.status(404).json({ message: 'Invalid or expired coupon code' });
      }
      return res.status(200).json(coupon);
    }

    const coupon = await Coupon.findOne({ code: searchCode, active: true });
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon code' });
    }
    
    res.status(200).json(coupon);
  } catch (error) {
    next(error);
  }
};

export const getCoupons = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json(MOCK_COUPONS);
    }
    const coupons = await Coupon.find({});
    res.status(200).json(coupons);
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const { code, discount } = req.body;
    const newCode = code.toUpperCase();

    if (mongoose.connection.readyState !== 1) {
      const existing = MOCK_COUPONS.find(c => c.code === newCode);
      if (existing) {
        return res.status(400).json({ message: 'Coupon code already exists' });
      }
      const coupon = { code: newCode, discount, active: true };
      MOCK_COUPONS.push(coupon);
      return res.status(201).json(coupon);
    }

    const existing = await Coupon.findOne({ code: newCode });
    if (existing) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    
    const coupon = await Coupon.create({
      code: newCode,
      discount
    });
    
    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
};
