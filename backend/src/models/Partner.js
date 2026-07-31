import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  fullName: { type: String },
  avatar: { type: String, required: true },
  profilePhoto: { type: String },
  category: { type: String, required: true },
  serviceCategory: { type: String },
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 0 },
  isOnline: { type: Boolean, default: true },
  distance: { type: String, default: '1.2 km' },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  phone: { type: String, required: true },
  whatsapp: { type: String, required: true },
  price: { type: Number, required: true },
  experience: { type: String, required: true },
  completedJobs: { type: Number, default: 0 },
  cancelledJobs: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  languages: [{ type: String }],
  businessName: { type: String, required: true },
  location: { type: String, required: true },
  serviceAreas: [{ type: String }],
  workingTime: { type: String, default: '9 AM - 6 PM' },
  portfolio: [{ type: String }],
  adminStatus: { type: String, enum: ['pending', 'review', 'approved', 'rejected'], default: 'pending' },
  verificationStatus: { type: String, enum: ['pending', 'review', 'approved', 'rejected'], default: 'pending' },
  aadhaarNumber: { type: String, required: true },
  aadhaarImage: { type: String },
  certificateImages: [{ type: String }],
  panNumber: { type: String, required: true },
  bankAccount: { type: String, required: true },
  upiId: { type: String, required: true },
  emergencyService: { type: Boolean, default: false },
  doorstepService: { type: Boolean, default: true },
  workingDays: [{ type: String }],
  serviceRadius: { type: Number, default: 10 },
  awards: [{ type: String }],
  responseTime: { type: Number, default: 15 },
  cancellationRate: { type: Number, default: 0 },
  repeatCustomers: { type: Number, default: 90 },
  popularity: { type: Number, default: 85 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

partnerSchema.pre('save', function (next) {
  if (this.name && !this.fullName) this.fullName = this.name;
  if (this.fullName && !this.name) this.name = this.fullName;
  if (this.avatar && !this.profilePhoto) this.profilePhoto = this.avatar;
  if (this.profilePhoto && !this.avatar) this.avatar = this.profilePhoto;
  if (this.category && !this.serviceCategory) this.serviceCategory = this.category;
  if (this.serviceCategory && !this.category) this.category = this.serviceCategory;
  if (this.adminStatus && !this.verificationStatus) this.verificationStatus = this.adminStatus;
  if (this.verificationStatus && !this.adminStatus) this.adminStatus = this.verificationStatus;
  next();
});

export const Partner = mongoose.model('Partner', partnerSchema);
