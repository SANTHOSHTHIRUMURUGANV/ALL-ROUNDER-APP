import { Payment } from '../models/Payment.js';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const razorpay = process.env.RAZORPAY_KEY_ID ? new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
}) : null;

export const createStripeIntent = async (req, res, next) => {
  try {
    const { amount } = req.body;
    
    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // convert to paise/cents
        currency: 'inr',
        metadata: { userId: req.user._id.toString() }
      });
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id
      });
    } else {
      // Mock fallback response for offline sandbox testing
      res.status(200).json({
        clientSecret: 'mock_stripe_client_secret_12345',
        id: 'pi_mock_12345',
        isMock: true
      });
    }
  } catch (error) {
    next(error);
  }
};

export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    
    if (razorpay) {
      const options = {
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      };
      const order = await razorpay.orders.create(options);
      res.status(200).json(order);
    } else {
      // Mock fallback response for offline sandbox testing
      res.status(200).json({
        id: `order_mock_${Date.now()}`,
        entity: 'order',
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        status: 'created',
        isMock: true
      });
    }
  } catch (error) {
    next(error);
  }
};

export const processWalletPayment = async (req, res, next) => {
  try {
    const { amount, bookingId } = req.body;
    
    if (req.user.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance credit.' });
    }
    
    req.user.walletBalance -= amount;
    await req.user.save();

    const payment = await Payment.create({
      userId: req.user._id,
      bookingId,
      amount,
      gateway: 'wallet',
      status: 'success'
    });

    res.status(200).json({
      success: true,
      walletBalance: req.user.walletBalance,
      paymentId: payment._id
    });
  } catch (error) {
    next(error);
  }
};
