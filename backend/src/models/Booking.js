import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
  category: { type: String, required: true },
  service: { type: String },
  categoryIcon: { type: String, required: true },
  title: { type: String, required: true },
  providerName: { type: String, default: '' },
  providerPhone: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'], default: 'pending' },
  bookingStatus: { type: String, enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'], default: 'pending' },
  price: { type: Number, required: true },
  amount: { type: Number },
  date: { type: String, required: true },
  bookingDate: { type: String },
  time: { type: String, required: true },
  bookingTime: { type: String },
  location: { type: String, default: 'Velachery, Chennai' },
  paymentStatus: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  notes: { type: String, default: '' },
  rating: { type: Number },
  progress: { type: Number, default: 0 },
  routeCoordinates: [{
    x: { type: Number },
    y: { type: Number }
  }],
  currentPosIndex: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

bookingSchema.pre('save', function (next) {
  if (this.category && !this.service) this.service = this.category;
  if (this.service && !this.category) this.category = this.service;
  if (this.date && !this.bookingDate) this.bookingDate = this.date;
  if (this.bookingDate && !this.date) this.date = this.bookingDate;
  if (this.time && !this.bookingTime) this.bookingTime = this.time;
  if (this.bookingTime && !this.time) this.time = this.bookingTime;
  if (this.price && !this.amount) this.amount = this.price;
  if (this.amount && !this.price) this.price = this.amount;
  if (this.status && !this.bookingStatus) this.bookingStatus = this.status;
  if (this.bookingStatus && !this.status) this.status = this.bookingStatus;
  next();
});

export const Booking = mongoose.model('Booking', bookingSchema);
