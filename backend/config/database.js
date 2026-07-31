import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false);
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/allrounder', {
      serverSelectionTimeoutMS: 2000
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.log("❌ MongoDB Connection Failed");
    console.warn(`⚠️ Database connection warning: ${error.message}`);
  }
};

export default connectDB;
