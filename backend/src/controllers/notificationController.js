import { Notification } from '../models/Notification.js';
import mongoose from 'mongoose';

export const getNotificationsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json([]);
    }
    const notifications = await Notification.find({
      $or: [
        { userId },
        { userId: null }
      ]
    }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};
