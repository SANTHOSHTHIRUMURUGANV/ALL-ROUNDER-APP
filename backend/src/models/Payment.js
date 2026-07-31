import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  paymentStatus: { type: String },
  gateway: { type: String, enum: ['wallet', 'stripe', 'razorpay'], required: true },
  paymentMethod: { type: String },
  gatewayPaymentId: { type: String },
  transactionId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

paymentSchema.pre('save', function (next) {
  if (this.gateway && !this.paymentMethod) this.paymentMethod = this.gateway;
  if (this.paymentMethod && !this.gateway) this.gateway = this.paymentMethod;
  if (this.status && !this.paymentStatus) this.paymentStatus = this.status;
  if (this.paymentStatus && !this.status) this.status = this.paymentStatus;
  if (this.gatewayPaymentId && !this.transactionId) this.transactionId = this.gatewayPaymentId;
  if (this.transactionId && !this.gatewayPaymentId) this.gatewayPaymentId = this.transactionId;
  next();
});

export const Payment = mongoose.model('Payment', paymentSchema);
