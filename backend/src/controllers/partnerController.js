import { Partner } from '../models/Partner.js';
import { User } from '../models/User.js';
import mongoose from 'mongoose';

const MOCK_PARTNERS = [
  {
    id: '60b72b2f9b1d8b2d88a4e8d2',
    _id: '60b72b2f9b1d8b2d88a4e8d2',
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
    emergencyService: true,
    doorstepService: true,
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    serviceRadius: 10,
    responseTime: 10,
    cancellationRate: 2,
    repeatCustomers: 92,
    popularity: 95,
    isOnline: true
  },
  {
    id: '60b72b2f9b1d8b2d88a4e8d3',
    _id: '60b72b2f9b1d8b2d88a4e8d3',
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
    emergencyService: false,
    doorstepService: true,
    workingDays: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    serviceRadius: 15,
    responseTime: 20,
    cancellationRate: 4,
    repeatCustomers: 88,
    popularity: 90,
    isOnline: true
  }
];

export const onboardPartner = async (req, res, next) => {
  try {
    const { 
      profession, personalDetails, businessDetails, uploads, portfolio 
    } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const mockResult = {
        _id: `60b72b2f9b1d8b2d88a4e8d${Date.now().toString().slice(-1)}`,
        name: personalDetails.name,
        avatar: personalDetails.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        category: profession,
        lat: req.user.location.lat,
        lng: req.user.location.lng,
        phone: personalDetails.phone,
        whatsapp: personalDetails.phone,
        price: businessDetails.pricing || 199,
        experience: businessDetails.experience || '3',
        completedJobs: 0,
        languages: businessDetails.languages || ['English'],
        businessName: businessDetails.businessName || `${personalDetails.name} Services`,
        location: personalDetails.address || req.user.location.address,
        workingTime: businessDetails.workingHours || '9 AM - 6 PM',
        portfolio: portfolio?.workPhotos || [],
        adminStatus: 'pending',
        emergencyService: businessDetails.emergencyService || false,
        doorstepService: businessDetails.doorstepService || true,
        workingDays: businessDetails.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        serviceRadius: businessDetails.serviceRadius || 10,
        responseTime: 15,
        cancellationRate: 0,
        repeatCustomers: 90,
        popularity: 80,
        isOnline: true
      };
      return res.status(201).json(mockResult);
    }

    const partner = await Partner.create({
      userId: req.user._id,
      name: personalDetails.name,
      avatar: personalDetails.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      category: profession,
      lat: req.user.location.lat + (Math.random() - 0.5) * 0.05,
      lng: req.user.location.lng + (Math.random() - 0.5) * 0.05,
      phone: personalDetails.phone,
      whatsapp: personalDetails.phone,
      price: businessDetails.pricing || 199,
      experience: businessDetails.experience || '3',
      completedJobs: 0,
      languages: businessDetails.languages || ['English', 'Tamil'],
      businessName: businessDetails.businessName || `${personalDetails.name} Services`,
      location: personalDetails.address || req.user.location.address,
      workingTime: businessDetails.workingHours || '9 AM - 6 PM',
      portfolio: portfolio?.workPhotos || [],
      adminStatus: 'pending',
      aadhaarNumber: uploads.aadhaarFile || 'AadhaarVerified.pdf',
      panNumber: uploads.panFile || 'PanVerified.pdf',
      bankAccount: uploads.bankAccount || '1234567890',
      upiId: uploads.upi || `${personalDetails.name.toLowerCase()}@okaxis`,
      emergencyService: businessDetails.emergencyService || false,
      doorstepService: businessDetails.doorstepService || true,
      workingDays: businessDetails.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      serviceRadius: businessDetails.serviceRadius || 10,
      awards: portfolio?.awards || [],
      responseTime: 15,
      cancellationRate: 0,
      repeatCustomers: 90,
      popularity: 80
    });

    // Automatically update role to partner
    req.user.role = 'partner';
    await req.user.save();

    res.status(201).json(partner);
  } catch (error) {
    next(error);
  }
};

export const getNearbyPartners = async (req, res, next) => {
  try {
    const { category, search, availableOnly, emergencyOnly, doorstepOnly, sortBy } = req.query;
    
    let partnersList = [];
    if (mongoose.connection.readyState !== 1) {
      partnersList = JSON.parse(JSON.stringify(MOCK_PARTNERS));
    } else {
      let query = { adminStatus: 'approved' };
      if (category) query.category = category;
      partnersList = await Partner.find(query);
    }

    if (category) {
      partnersList = partnersList.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter list
    if (search) {
      const q = search.toLowerCase();
      partnersList = partnersList.filter(p => 
        p.name.toLowerCase().includes(q) || p.businessName.toLowerCase().includes(q)
      );
    }
    if (availableOnly === 'true') {
      partnersList = partnersList.filter(p => p.isOnline);
    }
    if (emergencyOnly === 'true') {
      partnersList = partnersList.filter(p => p.emergencyService);
    }
    if (doorstepOnly === 'true') {
      partnersList = partnersList.filter(p => p.doorstepService);
    }

    // Proximity logic
    const userLat = req.user?.location?.lat || 12.9815;
    const userLng = req.user?.location?.lng || 80.2180;

    partnersList = partnersList.map(p => {
      const distanceKM = Math.sqrt(Math.pow(p.lat - userLat, 2) + Math.pow(p.lng - userLng, 2)) * 111;
      p.distance = distanceKM < 1 ? `${Math.round(distanceKM * 1000)} m away` : `${distanceKM.toFixed(1)} km away`;
      return p;
    });

    // Sort list
    if (sortBy === 'distance') {
      partnersList.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else if (sortBy === 'rating') {
      partnersList.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'cancellationRate') {
      partnersList.sort((a, b) => a.cancellationRate - b.cancellationRate);
    } else if (sortBy === 'popularity') {
      partnersList.sort((a, b) => b.popularity - a.popularity);
    }

    res.status(200).json(partnersList);
  } catch (error) {
    next(error);
  }
};

export const updatePartnerProfile = async (req, res, next) => {
  try {
    const { price, isOnline, serviceRadius } = req.body;

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, price, isOnline, serviceRadius });
    }

    const partner = await Partner.findOne({ userId: req.user._id });
    if (!partner) {
      return res.status(404).json({ message: 'Partner profile not found' });
    }

    if (price !== undefined) partner.price = price;
    if (isOnline !== undefined) partner.isOnline = isOnline;
    if (serviceRadius !== undefined) partner.serviceRadius = serviceRadius;

    await partner.save();
    res.status(200).json(partner);
  } catch (error) {
    next(error);
  }
};
