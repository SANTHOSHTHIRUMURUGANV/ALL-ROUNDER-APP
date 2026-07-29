import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Import Routers
import authRoutes from './routes/authRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Import Models for seed
import { User } from './models/User.js';
import { Partner } from './models/Partner.js';
import { Coupon } from './models/Coupon.js';
import { FraudLog } from './models/FraudLog.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Database Connectivity
connectDB().then(() => {
  seedDatabase();
});

// Middleware
app.use(cors());
app.use(express.json());

// Pass Socket.io to request contexts
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Bind API Routes
app.use('/api/auth', authRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('AllCounter Full-Stack API server is online.');
});

// Error handling middleware
app.use(errorHandler);

// Real-Time Socket Connection Handlers
io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // Partner status updates
  socket.on('updateStatus', async (data) => {
    const { partnerId, isOnline } = data;
    try {
      await Partner.findByIdAndUpdate(partnerId, { isOnline });
      io.emit('statusChanged', { partnerId, isOnline });
    } catch (err) {
      console.error(err);
    }
  });

  // Real-time GPS coordinate streaming
  socket.on('streamGPS', (data) => {
    const { bookingId, lat, lng } = data;
    io.emit(`gpsUpdate:${bookingId}`, { lat, lng });
  });

  // Chat messaging
  socket.on('sendMessage', (data) => {
    const { bookingId, sender, text } = data;
    io.emit(`chatMessage:${bookingId}`, { sender, text, createdAt: new Date() });
  });

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// Seed Initial Database Setup
async function seedDatabase() {
  try {
    const usersCount = await User.countDocuments();
    if (usersCount === 0) {
      console.log('🌱 Seeding initial mock data...');
      
      // Create admin user
      const admin = await User.create({
        uid: 'admin-mock-123',
        name: 'AllRounder Admin Account',
        email: 'admin@allrounder.com',
        role: 'admin',
        walletBalance: 99999
      });

      // Create standard customer
      const customer = await User.create({
        uid: 'mock-user-123',
        name: 'Suresh Kumar',
        email: 'suresh@allrounder.com',
        role: 'customer',
        walletBalance: 1250
      });

      // Create partner user
      const partnerUser1 = await User.create({
        uid: 'partner-mock-123',
        name: 'Rajesh Kumar',
        email: 'rajesh@allrounder.com',
        role: 'partner'
      });

      const partnerUser2 = await User.create({
        uid: 'partner-mock-456',
        name: 'Anjali Sharma',
        email: 'anjali@allrounder.com',
        role: 'partner'
      });

      // Create partner profiles
      await Partner.create({
        userId: partnerUser1._id,
        name: 'Rajesh Kumar',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        category: 'Electrician',
        lat: 12.9805,
        lng: 80.2190,
        phone: '+91 98765 22222',
        whatsapp: '+91 98765 22222',
        price: 199,
        experience: '6',
        completedJobs: 42,
        languages: ['English', 'Tamil', 'Hindi'],
        businessName: 'Rajesh Electrical Solutions',
        location: 'Adyar Sector 4, Chennai',
        workingTime: '9 AM - 6 PM',
        portfolio: [
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200',
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200'
        ],
        adminStatus: 'approved',
        aadhaarNumber: '1234-5678-9012',
        panNumber: 'ABCDE1234F',
        bankAccount: '9876543210',
        upiId: 'rajesh@okicici',
        emergencyService: true,
        doorstepService: true,
        workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        serviceRadius: 10,
        awards: ['Safety Pro Certificate', 'Top Performer 2025'],
        responseTime: 10,
        cancellationRate: 2,
        repeatCustomers: 92,
        popularity: 95
      });

      await Partner.create({
        userId: partnerUser2._id,
        name: 'Anjali Sharma',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        category: 'Beautician',
        lat: 12.9825,
        lng: 80.2170,
        phone: '+91 98765 33333',
        whatsapp: '+91 98765 33333',
        price: 499,
        experience: '5',
        completedJobs: 28,
        languages: ['English', 'Hindi'],
        businessName: 'Glow Beauty Parlour Studio',
        location: 'Velachery Bypass Road, Chennai',
        workingTime: '10 AM - 7 PM',
        portfolio: [
          'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200',
          'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200'
        ],
        adminStatus: 'approved',
        aadhaarNumber: '5678-1234-9012',
        panNumber: 'XYZWE1234F',
        bankAccount: '123456789012',
        upiId: 'anjali@okaxis',
        emergencyService: false,
        doorstepService: true,
        workingDays: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        serviceRadius: 15,
        awards: ['Vidal Sassoon Diploma'],
        responseTime: 20,
        cancellationRate: 4,
        repeatCustomers: 88,
        popularity: 90
      });

      // Seed initial coupons
      await Coupon.create({ code: 'CAB50', discount: 15 });
      await Coupon.create({ code: 'FREEVISIT', discount: 20 });

      // Seed initial fraud warnings
      await FraudLog.create({
        type: 'Payment Anomaly',
        target: 'Anjali Sharma (Beautician)',
        reason: 'Velocity check flagged 4 booking attempts within 60 seconds.',
        riskScore: 84,
        status: 'Auditing'
      });

      await FraudLog.create({
        type: 'Duplicate Identity',
        target: 'Rajesh Kumar (Electrician)',
        reason: 'Biometric selfie matches similar profile registered under sub-ID.',
        riskScore: 92,
        status: 'Blocked'
      });

      console.log('✅ Mock data seeded successfully.');
    }
  } catch (err) {
    console.error(`⚠️ Seed database error: ${err.message}`);
  }
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 AllCounter Full-Stack server running on port ${PORT}`);
});
