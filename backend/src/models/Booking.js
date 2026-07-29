import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
  category: { type: String, required: true },
  categoryIcon: { type: String, required: true },
  title: { type: String, required: true },
  providerName: { type: String, default: '' },
  providerPhone: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'], default: 'pending' },
  price: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  rating: { type: Number },
  progress: { type: Number, default: 0 },
  routeCoordinates: [{
    x: { type: Number },
    y: { type: Number }
  }],
  currentPosIndex: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Booking = mongoose.model('Booking', bookingSchema);
