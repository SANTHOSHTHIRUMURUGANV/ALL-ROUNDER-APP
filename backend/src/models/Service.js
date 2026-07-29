import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, required: true },
  group: { type: String, enum: ['Core', 'Health', 'Travel', 'Entertainment', 'Professional'], required: true },
  active: { type: Boolean, default: true }
});

export const Service = mongoose.model('Service', serviceSchema);
