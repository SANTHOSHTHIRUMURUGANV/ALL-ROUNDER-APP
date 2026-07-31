import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'info' },
  read: { type: Boolean, default: false },
  isRead: { type: Boolean, default: false },
  time: { type: String, default: () => new Date().toLocaleTimeString().substring(0, 5) },
  createdAt: { type: Date, default: Date.now }
});

notificationSchema.pre('save', function (next) {
  if (this.read !== undefined && this.isRead === undefined) this.isRead = this.read;
  if (this.isRead !== undefined && this.read === undefined) this.read = this.isRead;
  next();
});

export const Notification = mongoose.model('Notification', notificationSchema);
