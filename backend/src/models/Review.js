import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  review: { type: String },
  isFake: { type: Boolean, default: false },
  date: { type: String, default: () => new Date().toISOString().substring(0, 10) },
  createdAt: { type: Date, default: Date.now }
});

reviewSchema.pre('save', function (next) {
  if (this.comment && !this.review) this.review = this.comment;
  if (this.review && !this.comment) this.comment = this.review;
  next();
});

export const Review = mongoose.model('Review', reviewSchema);
