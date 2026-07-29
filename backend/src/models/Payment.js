import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  gateway: { type: String, enum: ['wallet', 'stripe', 'razorpay'], required: true },
  gatewayPaymentId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Payment = mongoose.model('Payment', paymentSchema);
