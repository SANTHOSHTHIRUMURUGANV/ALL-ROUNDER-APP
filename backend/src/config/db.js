import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Disable global buffering so queries return immediately when database is offline
mongoose.set('bufferCommands', false);

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/allrounder', {
      serverSelectionTimeoutMS: 2000 // fail fast after 2 seconds
    });
    console.log(`📡 MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Database connection warning: ${error.message}. Continuing in sandbox server database mode.`);
  }
};
