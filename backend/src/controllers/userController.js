import { User } from '../models/User.js';
import mongoose from 'mongoose';

export const getUsers = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json([
        { id: 'mock-u-123', _id: 'mock-u-123', uid: 'mock-user-123', name: 'Suresh Kumar', fullName: 'Suresh Kumar', email: 'suresh@allrounder.com', phone: '+91 99999 88888', role: 'customer', walletBalance: 0, isBlocked: false, createdAt: new Date() }
      ]);
    }
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ id, name: 'Suresh Kumar', fullName: 'Suresh Kumar', email: 'suresh@allrounder.com', role: 'customer' });
    }
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ id, ...req.body });
    }
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
