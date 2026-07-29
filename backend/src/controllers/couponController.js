import { Coupon } from '../models/Coupon.js';

export const validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
    
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
    const coupons = await Coupon.find({});
    res.status(200).json(coupons);
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const { code, discount } = req.body;
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discount
    });
    
    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
};
