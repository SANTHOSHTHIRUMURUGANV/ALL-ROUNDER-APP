import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const ADMIN_OTP_STORE = {};

// Verify that email is one of the 3 approved admin emails
const isApprovedEmail = (email) => {
  const approved = [
    (process.env.ADMIN_EMAIL_1 || 'vincyvincilin@gmail.com').toLowerCase(),
    (process.env.ADMIN_EMAIL_2 || 'vijayanvijayank006@gmail.com').toLowerCase(),
    (process.env.ADMIN_EMAIL_3 || 'thirunavukarasu.s.ds@gmail.com').toLowerCase()
  ];
  return approved.includes(email.toLowerCase());
};

// Send OTP via SMTP or write to local debug file
const deliverOtp = async (email, otp) => {
  // 1. SMTP Delivery if configured
  if (process.env.OTP_EMAIL_USER && process.env.OTP_EMAIL_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.OTP_EMAIL_USER,
          pass: process.env.OTP_EMAIL_PASSWORD
        }
      });
      await transporter.sendMail({
        from: `"AllCounter Admin Safety" <${process.env.OTP_EMAIL_USER}>`,
        to: email,
        subject: 'Admin Verification Passcode',
        text: `Your admin verification code is: ${otp}\nThis code will expire in 5 minutes.`
      });
    } catch (smtpErr) {
      console.warn("SMTP delivery failed:", smtpErr.message);
    }
  }

  // 2. Write to backend/otp-debug.log file (Excludes console logs/DB/API disclosure)
  try {
    const logLine = `[${new Date().toISOString()}] Email: ${email} | OTP: ${otp}\n`;
    fs.appendFileSync(path.join(process.cwd(), 'otp-debug.log'), logLine);
  } catch (fsErr) {
    console.warn("Writing debug log failed:", fsErr.message);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { userNumber, password, email } = req.body || {};

    if (!userNumber || !password || !email) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const envUserNumber = (process.env.ADMIN_USER_NUMBER || '7774 5180 7169').replace(/\s+/g, '');
    const reqUserNumber = String(userNumber).replace(/\s+/g, '');
    const envPassword = process.env.ADMIN_PASSWORD || 'Sanzsandy2005***';

    if (reqUserNumber !== envUserNumber || password !== envPassword || !isApprovedEmail(email)) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in-memory
    ADMIN_OTP_STORE[email.toLowerCase()] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      failedAttempts: 0,
      resendCooldown: Date.now() + 60 * 1000 // 60 seconds resend lock
    };

    // Deliver
    await deliverOtp(email, otp);

    res.status(200).json({
      success: true,
      message: 'OTP passcode sent to the approved admin email address.',
      email: email.toLowerCase()
    });
  } catch (error) {
    next(error);
  }
};

export const verifyAdminOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP verification code are required.' });
    }

    const key = email.toLowerCase();
    const record = ADMIN_OTP_STORE[key];

    if (!record) {
      return res.status(400).json({ message: 'No OTP requested or code expired. Please request a new one.' });
    }

    if (Date.now() > record.expiresAt) {
      delete ADMIN_OTP_STORE[key];
      return res.status(400).json({ message: 'OTP verification code has expired (5 minutes timeout).' });
    }

    if (record.failedAttempts >= 3) {
      delete ADMIN_OTP_STORE[key];
      return res.status(400).json({ message: 'Maximum verification attempts exceeded. Please request a new OTP.' });
    }

    if (record.otp !== otp) {
      record.failedAttempts += 1;
      const remaining = 3 - record.failedAttempts;
      return res.status(400).json({
        message: `Incorrect OTP passcode. Verification attempts remaining: ${remaining}`
      });
    }

    // Successful OTP verification (one-time use!)
    delete ADMIN_OTP_STORE[key];

    // Generate Admin JWT session
    const token = jwt.sign(
      { id: 'admin-user', role: 'admin', verified: true, email },
      process.env.JWT_SECRET || 'supersecretjwtsecretkeyallrounder2026',
      { expiresIn: '2h' }
    );

    res.status(200).json({
      success: true,
      token,
      role: 'admin',
      message: 'Admin session authenticated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const resendAdminOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Admin email address is required.' });
    }

    const key = email.toLowerCase();
    const record = ADMIN_OTP_STORE[key];

    if (!record) {
      return res.status(400).json({ message: 'Session expired or not found. Please log in again.' });
    }

    if (Date.now() < record.resendCooldown) {
      const waitSec = Math.ceil((record.resendCooldown - Date.now()) / 1000);
      return res.status(429).json({ message: `Please wait ${waitSec} seconds before resending another OTP.` });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    record.otp = otp;
    record.expiresAt = Date.now() + 5 * 60 * 1000;
    record.resendCooldown = Date.now() + 60 * 1000;
    record.failedAttempts = 0;

    await deliverOtp(email, otp);

    res.status(200).json({
      success: true,
      message: 'A new OTP passcode was dispatched to your email address.'
    });
  } catch (error) {
    next(error);
  }
};
