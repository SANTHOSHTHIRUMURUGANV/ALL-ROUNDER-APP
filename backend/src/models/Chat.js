import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  sender: { type: String, enum: ['user', 'partner'], required: true },
  text: { type: String, required: true },
  translatedText: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Chat = mongoose.model('Chat', chatSchema);
