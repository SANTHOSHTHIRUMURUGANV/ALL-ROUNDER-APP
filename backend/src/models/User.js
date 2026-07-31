import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  fullName: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  password: { type: String, default: '' },
  role: { type: String, enum: ['customer', 'partner', 'admin', 'blocked'], default: 'customer' },
  walletBalance: { type: Number, default: 1000 },
  address: { type: String, default: 'Velachery Main Road' },
  profileImage: { type: String, default: '' },
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

userSchema.pre('save', function (next) {
  if (this.name && !this.fullName) {
    this.fullName = this.name;
  }
  if (this.fullName && !this.name) {
    this.name = this.fullName;
  }
  if (this.location && this.location.address && !this.address) {
    this.address = this.location.address;
  }
  next();
});

export const User = mongoose.model('User', userSchema);
