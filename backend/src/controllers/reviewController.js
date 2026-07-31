import { Review } from '../models/Review.js';
import mongoose from 'mongoose';

export const createReview = async (req, res, next) => {
  try {
    const { bookingId, partnerId, name, rating, comment, review } = req.body;
    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({ id: 'mock-r-new', bookingId, partnerId, name, rating, comment, review, createdAt: new Date() });
    }
    const newReview = new Review({
      bookingId,
      partnerId,
      customerId: req.user?._id,
      name,
      rating,
      comment: comment || review,
      review: review || comment
    });
    await newReview.save();
    res.status(201).json(newReview);
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
