import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';

export const getMe = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};

export const updateLocation = async (req, res, next) => {
  try {
    const { lat, lng, details } = req.body;
    req.user.location = {
      lat,
      lng,
      address: details?.address || req.user.location.address,
      city: details?.city || req.user.location.city,
      district: details?.district || req.user.location.district,
      state: details?.state || req.user.location.state,
      postcode: details?.postcode || req.user.location.postcode,
      country: details?.country || req.user.location.country
    };
    await req.user.save();
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};

export const depositWallet = async (req, res, next) => {
  try {
    const { amount } = req.body;
    req.user.walletBalance += amount;
    await req.user.save();
    res.status(200).json({ walletBalance: req.user.walletBalance });
  } catch (error) {
    next(error);
  }
};

export const switchRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (['customer', 'partner', 'admin'].includes(role)) {
      req.user.role = role;
      await req.user.save();
      res.status(200).json(req.user);
    } else {
      res.status(400).json({ message: 'Invalid role selection' });
    }
  } catch (error) {
    next(error);
  }
};
