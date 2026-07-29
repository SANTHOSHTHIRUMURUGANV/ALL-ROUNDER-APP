import { Partner } from '../models/Partner.js';
import { User } from '../models/User.js';

export const onboardPartner = async (req, res, next) => {
  try {
    const { 
      profession, personalDetails, businessDetails, uploads, portfolio, availabilityStatus 
    } = req.body;

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
    
    let query = { adminStatus: 'approved' };
    if (category) query.category = category;
    
    let partnersList = await Partner.find(query);

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
      p._doc.distance = distanceKM < 1 ? `${Math.round(distanceKM * 1000)} m away` : `${distanceKM.toFixed(1)} km away`;
      return p;
    });

    // Sort list
    if (sortBy === 'distance') {
      partnersList.sort((a, b) => parseFloat(a._doc.distance) - parseFloat(b._doc.distance));
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
    const partner = await Partner.findOne({ userId: req.user._id });
    if (!partner) {
      return res.status(404).json({ message: 'Partner profile not found' });
    }

    const { price, isOnline, serviceRadius } = req.body;
    if (price !== undefined) partner.price = price;
    if (isOnline !== undefined) partner.isOnline = isOnline;
    if (serviceRadius !== undefined) partner.serviceRadius = serviceRadius;

    await partner.save();
    res.status(200).json(partner);
  } catch (error) {
    next(error);
  }
};
