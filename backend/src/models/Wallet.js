import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 1000 },
  transactions: [{
    amount: { type: Number, required: true },
    type: { type: String, enum: ['deposit', 'payment', 'commission', 'withdrawal'], required: true },
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

export const Wallet = mongoose.model('Wallet', walletSchema);
