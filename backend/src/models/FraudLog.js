import mongoose from 'mongoose';

const fraudLogSchema = new mongoose.Schema({
  type: { type: String, required: true },
  target: { type: String, required: true },
  reason: { type: String, required: true },
  riskScore: { type: Number, required: true },
  status: { type: String, enum: ['Blocked', 'Auditing', 'Cleared'], default: 'Auditing' },
  time: { type: String, default: () => new Date().toLocaleTimeString().substring(0, 5) },
  createdAt: { type: Date, default: Date.now }
});

export const FraudLog = mongoose.model('FraudLog', fraudLogSchema);
export default FraudLog;
