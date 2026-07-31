import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Import Routers
import authRoutes from './routes/authRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

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
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes.'
});
app.use('/api/', limiter);

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
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

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
        walletBalance: 0
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
