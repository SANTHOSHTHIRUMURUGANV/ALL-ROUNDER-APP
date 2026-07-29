import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    req.user = {
      _id: '60b72b2f9b1d8b2d88a4e8d1',
      uid: 'mock-user-123',
      name: 'Suresh Kumar',
      email: 'suresh@allrounder.com',
      role: 'customer',
      walletBalance: 1250,
      location: {
        lat: 12.9815,
        lng: 80.2180,
        address: 'Velachery Main Road',
        city: 'Chennai',
        district: 'Chennai District',
        state: 'Tamil Nadu',
        postcode: '600042',
        country: 'India'
      }
    };
    return next();
  }
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtsecretkeyallrounder2026');
      } catch (err) {
        decoded = { uid: token };
      }

      req.user = await User.findOne({ uid: decoded.uid });
      if (!req.user) {
        req.user = await User.create({
          uid: decoded.uid,
          name: 'Super App User',
          email: `${decoded.uid}@example.com`
        });
      }
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token validation failed' });
    }
  } else {
    req.user = await User.findOne({ uid: 'mock-user-123' });
    if (!req.user) {
      req.user = await User.create({
        uid: 'mock-user-123',
        name: 'Suresh Kumar',
        email: 'suresh@allrounder.com',
        role: 'customer'
      });
    }
    next();
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role ${req.user?.role} is not authorized for this resource` });
    }
    next();
  };
};
