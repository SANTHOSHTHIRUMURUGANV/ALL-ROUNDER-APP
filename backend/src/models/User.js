import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['customer', 'partner', 'admin'], default: 'customer' },
  walletBalance: { type: Number, default: 1000 },
  location: {
    lat: { type: Number, default: 12.9815 },
    lng: { type: Number, default: 80.2180 },
    address: { type: String, default: 'Velachery Main Road' },
    city: { type: String, default: 'Chennai' },
    district: { type: String, default: 'Chennai District' },
    state: { type: String, default: 'Tamil Nadu' },
    postcode: { type: String, default: '600042' },
    country: { type: String, default: 'India' }
  },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
