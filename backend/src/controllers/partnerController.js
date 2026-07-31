import { Partner } from '../models/Partner.js';
import { User } from '../models/User.js';
import mongoose from 'mongoose';

export const MOCK_PARTNERS = [];

export const onboardPartner = async (req, res, next) => {
  try {
    const { 
      profession, personalDetails, businessDetails, uploads, portfolio 
    } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const mockResult = {
        _id: `60b72b2f9b1d8b2d88a4e8d${Date.now().toString().slice(-1)}`,
        name: personalDetails.name,
        fullName: personalDetails.name,
        avatar: personalDetails.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        profilePhoto: personalDetails.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        category: profession,
        serviceCategory: profession,
        lat: req.user.location.lat,
        lng: req.user.location.lng,
        phone: personalDetails.phone,
        whatsapp: personalDetails.phone,
        price: businessDetails.pricing || 199,
        experience: businessDetails.experience || '3',
        completedJobs: 0,
        cancelledJobs: 0,
        earnings: 0,
        languages: businessDetails.languages || ['English'],
        businessName: businessDetails.businessName || `${personalDetails.name} Services`,
        location: personalDetails.address || req.user.location.address,
        workingTime: businessDetails.workingHours || '9 AM - 6 PM',
        portfolio: portfolio?.workPhotos || [],
        adminStatus: 'pending',
        verificationStatus: 'pending',
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
      MOCK_PARTNERS.push(mockResult);
      return res.status(201).json(mockResult);
    }

    const partner = await Partner.create({
      userId: req.user._id,
      name: personalDetails.name,
      fullName: personalDetails.name,
      avatar: personalDetails.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      profilePhoto: personalDetails.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      category: profession,
      serviceCategory: profession,
      lat: req.user.location.lat + (Math.random() - 0.5) * 0.05,
      lng: req.user.location.lng + (Math.random() - 0.5) * 0.05,
      phone: personalDetails.phone,
      whatsapp: personalDetails.phone,
      price: businessDetails.pricing || 199,
      experience: businessDetails.experience || '3',
      completedJobs: 0,
      cancelledJobs: 0,
      earnings: 0,
      languages: businessDetails.languages || ['English', 'Tamil'],
      businessName: businessDetails.businessName || `${personalDetails.name} Services`,
      location: personalDetails.address || req.user.location.address,
      workingTime: businessDetails.workingHours || '9 AM - 6 PM',
      portfolio: portfolio?.workPhotos || [],
      adminStatus: 'pending',
      verificationStatus: 'pending',
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

    const userLat = req.user?.location?.lat || 12.9815;
    const userLng = req.user?.location?.lng || 80.2180;

    partnersList = partnersList.map(p => {
      const distanceKM = Math.sqrt(Math.pow(p.lat - userLat, 2) + Math.pow(p.lng - userLng, 2)) * 111;
      p.distance = distanceKM < 1 ? `${Math.round(distanceKM * 1000)} m away` : `${distanceKM.toFixed(1)} km away`;
      return p;
    });

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

export const registerPartner = async (req, res, next) => {
  return onboardPartner(req, res, next);
};

export const getPartners = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json(MOCK_PARTNERS);
    }
    const partners = await Partner.find({}).populate('userId', 'name email phone');
    res.status(200).json(partners);
  } catch (error) {
    next(error);
  }
};

export const getPartnerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      const p = MOCK_PARTNERS.find(x => x._id === id || x.id === id);
      return res.status(200).json(p || MOCK_PARTNERS[0]);
    }
    const partner = await Partner.findById(id).populate('userId', 'name email phone');
    if (!partner) return res.status(404).json({ message: 'Partner not found' });
    res.status(200).json(partner);
  } catch (error) {
    next(error);
  }
};

export const updatePartner = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ id, ...req.body });
    }
    const partner = await Partner.findByIdAndUpdate(id, req.body, { new: true });
    if (!partner) return res.status(404).json({ message: 'Partner not found' });
    res.status(200).json(partner);
  } catch (error) {
    next(error);
  }
};

export const approvePartner = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ id, adminStatus: 'approved' });
    }
    const partner = await Partner.findByIdAndUpdate(id, { adminStatus: 'approved' }, { new: true });
    if (!partner) return res.status(404).json({ message: 'Partner not found' });
    res.status(200).json(partner);
  } catch (error) {
    next(error);
  }
};

export const rejectPartner = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ id, adminStatus: 'rejected' });
    }
    const partner = await Partner.findByIdAndUpdate(id, { adminStatus: 'rejected' }, { new: true });
    if (!partner) return res.status(404).json({ message: 'Partner not found' });
    res.status(200).json(partner);
  } catch (error) {
    next(error);
  }
};

export const deletePartner = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ id, message: 'Deleted' });
    }
    const partner = await Partner.findByIdAndDelete(id);
    if (!partner) return res.status(404).json({ message: 'Partner not found' });
    res.status(200).json({ message: 'Partner deleted successfully' });
  } catch (error) {
    next(error);
  }
};
