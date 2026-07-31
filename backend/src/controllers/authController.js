import { User } from '../models/User.js';
import { Wallet } from '../models/Wallet.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export const register = async (req, res, next) => {
  try {
    const { fullName, email, phone, password, role, address, profileImage } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    if (mongoose.connection.readyState !== 1) {
      const mockUser = {
        _id: 'mock-u-' + Date.now(),
        fullName,
        name: fullName,
        email,
        phone,
        role: role || 'customer',
        address,
        profileImage,
        createdAt: new Date()
      };
      const token = jwt.sign({ id: mockUser._id, role: mockUser.role }, process.env.JWT_SECRET || 'secret');
      return res.status(201).json({ user: mockUser, token });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      uid: 'uid-' + Date.now(),
      name: fullName,
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: role || 'customer',
      address,
      profileImage
    });

    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (mongoose.connection.readyState !== 1) {
      const mockUser = {
        _id: 'mock-u-123',
        fullName: 'Suresh Kumar',
        name: 'Suresh Kumar',
        email,
        role: 'customer'
      };
      const token = jwt.sign({ id: mockUser._id, role: mockUser.role }, process.env.JWT_SECRET || 'secret');
      return res.status(200).json({ user: mockUser, token });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
};

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

    if (mongoose.connection.readyState === 1) {
      let wallet = await Wallet.findOne({ userId: req.user._id });
      if (!wallet) {
        wallet = new Wallet({ userId: req.user._id, balance: req.user.walletBalance });
      } else {
        wallet.balance = req.user.walletBalance;
      }
      wallet.transactions.push({
        amount,
        type: 'deposit',
        description: 'Wallet recharge deposit'
      });
      await wallet.save();
    }

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
