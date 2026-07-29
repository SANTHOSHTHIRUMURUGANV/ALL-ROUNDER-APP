import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import i18n from '../i18n';
import { io, Socket } from 'socket.io-client';
import { apiRequest } from '../utils/api';

// Define structures
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
}

export interface Booking {
  id: string;
  category: string;
  categoryIcon: string;
  title: string;
  providerName: string;
  providerPhone: string;
  status: 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';
  price: number;
  date: string;
  time: string;
  rating?: number;
  progress: number;
  routeCoordinates?: { x: number; y: number }[];
  currentPosIndex?: number;
}

export interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Partner {
  id: string;
  name: string;
  avatar: string;
  category: string;
  rating: number;
  reviewsCount: number;
  isOnline: boolean;
  distance: string;
  lat: number;
  lng: number;
  phone: string;
  whatsapp: string;
  price: number;
  experience: string;
  completedJobs: number;
  languages: string[];
  businessName: string;
  location: string;
  workingTime: string;
  portfolio: string[];
  portfolioVideos?: string[];
  reviews: Review[];
  adminStatus: 'pending' | 'review' | 'approved' | 'rejected';
  aadhaarNumber?: string;
  panNumber?: string;
  bankAccount?: string;
  upiId?: string;
  emergencyService: boolean;
  doorstepService: boolean;
  gstNumber?: string;
  website?: string;
  workingDays: string[];
  serviceRadius: number; // in km
  awards: string[];
  responseTime: number; // in minutes
  cancellationRate: number; // percentage
  repeatCustomers: number; // percentage
  popularity: number; // scale 1-100
}

export interface PartnerRegistration {
  step: number;
  profession: string;
  personalDetails: {
    name: string;
    photo: string;
    phone: string;
    email: string;
    gender: 'Male' | 'Female' | 'Other';
    dob: string;
    address: string;
  };
  businessDetails: {
    businessName: string;
    shopName: string;
    experience: string;
    description: string;
    pricing: number;
    languages: string[];
    workingDays: string[];
    workingHours: string;
    serviceRadius: number;
    emergencyService: boolean;
    doorstepService: boolean;
    gst?: string;
    website?: string;
    businessAddress: string;
  };
  uploads: {
    aadhaarFile: string;
    panFile: string;
    licenseFile?: string;
    shopPhotoFile?: string;
    selfieFile: string;
    bankAccount: string;
    upi: string;
  };
  portfolio: {
    workPhotos: string[];
    beforeAfterPhotos: string[];
    videos: string[];
    certificates: string[];
    awards: string[];
  };
  availabilityStatus: 'Available Now' | 'Busy' | 'Offline' | 'Holiday Mode';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'booking';
  read: boolean;
}

export interface FraudLog {
  id: string;
  type: string;
  target: string;
  riskScore: number;
  reason: string;
  time: string;
  status: 'blocked' | 'monitored';
}

export interface ImageAnalysisResult {
  detectedProblem: string;
  recommendedService: string;
  estimatedArea: string;
  materials: string[];
  laborCharge: number;
  materialCost: number;
  timeEstimate: string;
}

export type ViewRole = 'customer' | 'partner' | 'admin';
export type Language = 'en' | 'ta' | 'hi' | 'te' | 'kn' | 'ml' | 'ar' | 'fr' | 'de' | 'es' | 'zh' | 'ja';

export interface LocationDetails {
  address: string;
  city: string;
  district: string;
  state: string;
  postcode: string;
  country: string;
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  role: ViewRole;
  setRole: (role: ViewRole) => void;
  location: string;
  setLocation: (loc: string) => void;
  locationCoords: { lat: number; lng: number };
  setLocationCoords: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
  locationDetails: LocationDetails | null;
  requestLiveLocation: () => Promise<void>;
  updateManualLocation: (lat: number, lng: number, addressDetails?: LocationDetails) => Promise<void>;
  simulateGPS: () => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  walletBalance: number;
  walletTransactions: { id: string; type: 'credit' | 'debit'; amount: number; description: string; date: string }[];
  addWalletMoney: (amount: number) => void;
  deductWalletMoney: (amount: number, desc: string) => boolean;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'date' | 'time' | 'progress'>) => string;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  activeTrackingId: string | null;
  setActiveTrackingId: (id: string | null) => void;
  partners: Partner[];
  setPartners: React.Dispatch<React.SetStateAction<Partner[]>>;
  togglePartnerOnline: (id: string) => void;
  notifications: Notification[];
  addNotification: (title: string, message: string, type?: Notification['type']) => void;
  markNotificationsAsRead: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  voiceActive: boolean;
  setVoiceActive: (active: boolean) => void;
  partnerReg: PartnerRegistration;
  setPartnerReg: React.Dispatch<React.SetStateAction<PartnerRegistration>>;
  submitPartnerRegistration: () => void;
  bookingHistory: string[];
  setBookingHistory: React.Dispatch<React.SetStateAction<string[]>>;
  fraudLogs: FraudLog[];
  setFraudLogs: React.Dispatch<React.SetStateAction<FraudLog[]>>;
  isAnalyzingImage: boolean;
  analysisResult: ImageAnalysisResult | null;
  setAnalysisResult: (res: ImageAnalysisResult | null) => void;
  analyzeImageFile: (fileName: string) => Promise<ImageAnalysisResult>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Haversine distance calculator
export const getDistanceInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Initialize mock partners with Chennai coordinates
const INITIAL_PARTNERS: Partner[] = [];

const INITIAL_REGISTRATION: PartnerRegistration = {
  step: 1,
  profession: '',
  personalDetails: { name: '', photo: '', phone: '', email: '', gender: 'Male', dob: '', address: '' },
  businessDetails: { businessName: '', shopName: '', experience: '', description: '', pricing: 199, languages: [], workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], workingHours: '9 AM - 6 PM', serviceRadius: 10, emergencyService: false, doorstepService: true, businessAddress: '' },
  uploads: { aadhaarFile: '', panFile: '', selfieFile: '', bankAccount: '', upi: '' },
  portfolio: { workPhotos: [], beforeAfterPhotos: [], videos: [], certificates: [], awards: [] },
  availabilityStatus: 'Available Now'
};

const DEFAULT_COORDS = { lat: 12.9815, lng: 80.2180 }; // Velachery, Chennai
const DEFAULT_LOCATION_DETAILS: LocationDetails = {
  address: "Velachery Main Road",
  city: "Chennai",
  district: "Chennai District",
  state: "Tamil Nadu",
  postcode: "600042",
  country: "India"
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); 
  
  // Dynamic sync with i18n
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('i18nextLng') as Language) || 'en';
  });

  const [role, setRole] = useState<ViewRole>('customer');

  // Location details states
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number }>(() => {
    const cached = localStorage.getItem('allcounter_coords');
    return cached ? JSON.parse(cached) : DEFAULT_COORDS;
  });

  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(() => {
    const cached = localStorage.getItem('allcounter_location_details');
    return cached ? JSON.parse(cached) : DEFAULT_LOCATION_DETAILS;
  });

  const [location, setLocation] = useState<string>(() => {
    if (locationDetails) {
      return `${locationDetails.address}, ${locationDetails.city}, ${locationDetails.state} ${locationDetails.postcode}`;
    }
    return 'Velachery, Chennai';
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [walletBalance, setWalletBalance] = useState(2500); 
  const [walletTransactions, setWalletTransactions] = useState<AppContextType['walletTransactions']>([
    { id: 'tx-1', type: 'credit', amount: 2500, description: 'Promotional Welcome Credit', date: '2026-07-13' }
  ]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(null);
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PARTNERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [voiceActive, setVoiceActive] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'n-1', title: 'Welcome to AllRounder Premium Partner Network!', message: 'Complete your 7-step KYC document auditing now.', time: 'Just now', type: 'success', read: false }
  ]);

  // Onboarding registration state
  const [partnerReg, setPartnerReg] = useState<PartnerRegistration>(INITIAL_REGISTRATION);

  // AI states
  const [bookingHistory, setBookingHistory] = useState<string[]>(['Painter', 'Electrician']);
  const [fraudLogs, setFraudLogs] = useState<FraudLog[]>([
    { id: 'FL-101', type: 'Duplicate Profile Registry', target: 'Karan Malhotra (Painter)', riskScore: 94, reason: 'Aadhaar biometric fingerprint mismatch index with linked bank card.', time: '12 mins ago', status: 'blocked' },
    { id: 'FL-102', type: 'Velocity Spam Threat', target: 'Client_Vipul89', riskScore: 89, reason: 'Initiated 12 concurrent bookings to mismatched GPS locations in 40 seconds.', time: '3 hrs ago', status: 'blocked' },
    { id: 'FL-103', type: 'Payment Bypass Pattern', target: 'tx_stripe_823', riskScore: 91, reason: 'Simulated card token scraping identified during Stripe payment challenge.', time: '5 hrs ago', status: 'blocked' }
  ]);

  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);

  // Sync dark theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    document.body.classList.add('dark');
  }, []);

  const socketRef = useRef<Socket | null>(null);

  // Sync with MongoDB backend API
  useEffect(() => {
    const syncData = async () => {
      try {
        const user = await apiRequest('/auth/me');
        if (user) {
          setWalletBalance(user.walletBalance);
          setRole(user.role);
          setLocationCoords({ lat: user.location.lat, lng: user.location.lng });
          setLocationDetails({
            address: user.location.address,
            city: user.location.city,
            district: user.location.district,
            state: user.location.state,
            postcode: user.location.postcode,
            country: user.location.country
          });
        }
        
        const partnersList = await apiRequest('/partners/nearby');
        if (partnersList && partnersList.length > 0) {
          setPartners(partnersList);
        }

        const bookingsList = await apiRequest('/bookings');
        if (bookingsList) {
          setBookings(bookingsList);
        }

        const fraudList = await apiRequest('/admin/fraud');
        if (fraudList) {
          setFraudLogs(fraudList.map((log: any) => ({
            id: log._id || log.id,
            type: log.type,
            target: log.target,
            reason: log.reason,
            riskScore: log.riskScore,
            time: log.time,
            status: log.status
          })));
        }
      } catch (err) {
        console.warn("Could not synchronize database logs with server API. Operating in sandbox fallback mode.");
      }
    };
    syncData();
  }, []);

  // Sync Socket.io real-time updates
  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      console.log('📡 Full-Stack Socket.io dispatcher connected.');
    });

    socketRef.current.on('bookingUpdated', (updatedBooking: any) => {
      const normalizedBooking: Booking = {
        id: updatedBooking._id || updatedBooking.id,
        category: updatedBooking.category,
        categoryIcon: updatedBooking.categoryIcon,
        title: updatedBooking.title,
        providerName: updatedBooking.providerName,
        providerPhone: updatedBooking.providerPhone,
        status: updatedBooking.status,
        price: updatedBooking.price,
        date: updatedBooking.date,
        time: updatedBooking.time,
        progress: updatedBooking.progress,
        routeCoordinates: updatedBooking.routeCoordinates,
        currentPosIndex: updatedBooking.currentPosIndex
      };
      setBookings(prev =>
        prev.map(b => (b.id === normalizedBooking.id) ? normalizedBooking : b)
      );
    });

    socketRef.current.on('statusChanged', (data: { partnerId: string, isOnline: boolean }) => {
      setPartners(prev =>
        prev.map(p => (p.id === data.partnerId || (p as any)._id === data.partnerId) ? { ...p, isOnline: data.isOnline } : p)
      );
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Update i18n language changed callback
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
  };

  // Recalculate distances whenever coordinates change
  useEffect(() => {
    setPartners(prev => {
      return prev.map(p => {
        const distKm = getDistanceInKm(locationCoords.lat, locationCoords.lng, p.lat, p.lng);
        let distStr = '';
        if (distKm < 1) {
          distStr = `${Math.round(distKm * 1000)} m away`;
        } else {
          distStr = `${distKm.toFixed(1)} km away`;
        }
        return { ...p, distance: distStr };
      });
    });
  }, [locationCoords]);

  // Reverse geocoding fetch from OSM Nominatim (or fallback)
  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
        headers: {
          'Accept-Language': 'en'
        }
      });
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const details: LocationDetails = {
          address: addr.road || addr.suburb || addr.neighbourhood || 'Selected Location',
          city: addr.city || addr.town || addr.village || 'Chennai',
          district: addr.county || addr.district || 'Chennai District',
          state: addr.state || 'Tamil Nadu',
          postcode: addr.postcode || '600042',
          country: addr.country || 'India'
        };
        setLocationDetails(details);
        setLocation(`${details.address}, ${details.city}, ${details.state} ${details.postcode}`);
        localStorage.setItem('allcounter_location_details', JSON.stringify(details));
      } else {
        throw new Error("No address found");
      }
    } catch (e) {
      console.warn("Nominatim OSM Geocoding fail. Fallback to mock details:", e);
      // Fallback
      let details: LocationDetails = DEFAULT_LOCATION_DETAILS;
      if (Math.abs(lat - 12.9815) > 0.05) {
        details = {
          address: "Anna Salai Road",
          city: "Chennai",
          district: "Chennai District",
          state: "Tamil Nadu",
          postcode: "600002",
          country: "India"
        };
      }
      setLocationDetails(details);
      setLocation(`${details.address}, ${details.city}, ${details.state} ${details.postcode}`);
      localStorage.setItem('allcounter_location_details', JSON.stringify(details));
    }
  };

  // Launch live HTML5 geolocation request
  const requestLiveLocation = async () => {
    if (!navigator.geolocation) {
      addNotification('GPS Error 🛰', 'HTML5 Geolocation is not supported by your browser.', 'warning');
      return;
    }

    return new Promise<void>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const coords = { lat, lng };
          setLocationCoords(coords);
          localStorage.setItem('allcounter_coords', JSON.stringify(coords));
          await fetchAddressFromCoords(lat, lng);
          addNotification('Location Found 🛰', 'Your precise GPS location is synced.', 'success');
          resolve();
        },
        (error) => {
          console.warn("GPS Permission Denied / Timedout:", error.message);
          addNotification('GPS Blocked 🛰', 'Access denied. Please select coordinates manually.', 'warning');
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  };

  // Set manual coordinates selection
  const updateManualLocation = async (lat: number, lng: number, addressDetails?: LocationDetails) => {
    const coords = { lat, lng };
    setLocationCoords(coords);
    localStorage.setItem('allcounter_coords', JSON.stringify(coords));

    if (addressDetails) {
      setLocationDetails(addressDetails);
      setLocation(`${addressDetails.address}, ${addressDetails.city}, ${addressDetails.state} ${addressDetails.postcode}`);
      localStorage.setItem('allcounter_location_details', JSON.stringify(addressDetails));
    } else {
      await fetchAddressFromCoords(lat, lng);
    }
  };

  // Trigger HTML5 geolocation on first visit
  useEffect(() => {
    const coordsCached = localStorage.getItem('allcounter_coords');
    if (!coordsCached) {
      requestLiveLocation().catch(() => {});
    }
  }, []);

  // Dispatch navigation trace
  useEffect(() => {
    const activeBooking = bookings.find(b => b.id === activeTrackingId);
    if (!activeBooking || activeBooking.status !== 'ongoing') return;

    const interval = setInterval(() => {
      setBookings(prevBookings => {
        return prevBookings.map(b => {
          if (b.id === activeTrackingId && b.status === 'ongoing') {
            const nextProgress = Math.min(b.progress + 5, 100);
            const currentIdx = Math.min(
              Math.floor((nextProgress / 100) * ((b.routeCoordinates?.length || 1) - 1)),
              (b.routeCoordinates?.length || 1) - 1
            );
            
            if (nextProgress >= 100) {
              addNotification(
                'Task Delivered 🎉',
                `Your ${b.category} booking from ${b.providerName} is completed.`,
                'success'
              );
              return { ...b, progress: 100, status: 'completed', currentPosIndex: currentIdx };
            }
            return { ...b, progress: nextProgress, currentPosIndex: currentIdx };
          }
          return b;
        });
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [activeTrackingId, bookings]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const simulateGPS = () => {
    const randomOffsetLat = (Math.random() - 0.5) * 0.05;
    const randomOffsetLng = (Math.random() - 0.5) * 0.05;
    const nextLat = 12.9815 + randomOffsetLat;
    const nextLng = 80.2180 + randomOffsetLng;
    updateManualLocation(nextLat, nextLng);
  };

  // Cart operations
  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
    addNotification('Cart Updated 🛒', `${item.name} added to cart.`, 'info');
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateCartQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
    }
  };

  const clearCart = () => setCart([]);

  // Wallet operations
  // Wallet operations
  const addWalletMoney = async (amount: number) => {
    try {
      const res = await apiRequest('/auth/wallet', {
        method: 'PUT',
        body: JSON.stringify({ amount })
      });
      setWalletBalance(res.walletBalance);
      addNotification('Wallet Credited 💰', `₹${amount} topup transaction succeeded via full-stack.`, 'success');
    } catch (err) {
      setWalletBalance(prev => prev + amount);
      addNotification('Wallet Credited 💰', `₹${amount} topup transaction succeeded in sandbox.`, 'success');
    }
  };

  const deductWalletMoney = (amount: number, desc: string): boolean => {
    if (walletBalance < amount) {
      addNotification('Payment Failed ❌', 'Insufficient wallet balance. Please add funds.', 'warning');
      return false;
    }

    // Call API async in background
    apiRequest('/payments/wallet/pay', {
      method: 'POST',
      body: JSON.stringify({ amount, description: desc })
    }).catch(err => console.warn("Failed sync debit:", err));

    setWalletBalance(prev => prev - amount);
    setWalletTransactions(prev => [
      {
        id: `tx-${Date.now()}`,
        type: 'debit',
        amount,
        description: desc,
        date: new Date().toISOString().split('T')[0]
      },
      ...prev
    ]);
    return true;
  };

  // Booking placements
  const addBooking = (bookingData: Omit<Booking, 'id' | 'date' | 'time' | 'progress'>): string => {
    const bookingId = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
    const routeCoords = [
      { x: 20 + Math.random() * 20, y: 30 + Math.random() * 20 },
      { x: 45 + Math.random() * 15, y: 55 + Math.random() * 15 },
      { x: 80, y: 80 }
    ];

    const newBooking: Booking = {
      ...bookingData,
      id: bookingId,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      progress: 0,
      routeCoordinates: routeCoords,
      currentPosIndex: 0
    };

    setBookings(prev => [newBooking, ...prev]);
    setActiveTrackingId(bookingId);
    addNotification('Service Order Placed 🚀', `Assigned matching code: ${bookingId}`, 'booking');

    // Run backend database posting in the background
    apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify({ ...bookingData, id: bookingId })
    }).then(savedBooking => {
      setBookings(prev => prev.map(b => b.id === bookingId ? {
        id: savedBooking._id || savedBooking.id,
        category: savedBooking.category,
        categoryIcon: savedBooking.categoryIcon,
        title: savedBooking.title,
        providerName: savedBooking.providerName,
        providerPhone: savedBooking.providerPhone,
        status: savedBooking.status,
        price: savedBooking.price,
        date: savedBooking.date,
        time: savedBooking.time,
        progress: savedBooking.progress,
        routeCoordinates: savedBooking.routeCoordinates,
        currentPosIndex: savedBooking.currentPosIndex
      } : b));
    }).catch(err => {
      console.warn("Background API sync failed, continuing in sandbox.", err);
    });

    return bookingId;
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      await apiRequest(`/bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
    } catch (err) {
      setBookings(prev => {
        return prev.map(b => {
          if (b.id === id) {
            if (status === 'accepted') {
              addNotification('Order Accepted 🚕', `Provider ${b.providerName} is starting now!`, 'success');
            } else if (status === 'ongoing') {
              addNotification('Service In-Progress 🛠', 'Route coordinates trace is active.', 'info');
            } else if (status === 'cancelled') {
              addNotification('Order Cancelled 🔴', `Booking ${id} was rejected or cancelled.`, 'warning');
            }
            return { ...b, status };
          }
          return b;
        });
      });
    }
  };

  const togglePartnerOnline = async (partnerId: string) => {
    try {
      const partner = partners.find(p => p.id === partnerId);
      const isOnline = partner ? !partner.isOnline : true;
      await apiRequest('/partners/profile', {
        method: 'PUT',
        body: JSON.stringify({ isOnline })
      });
      socketRef.current?.emit('updateStatus', { partnerId, isOnline });
    } catch (err) {
      setPartners(prev =>
        prev.map(p => {
          if (p.id === partnerId) {
            const nextStatus = !p.isOnline;
            addNotification(
              'Partner Status Update 💼',
              `${p.name} is now ${nextStatus ? 'Online' : 'Offline'}.`,
              nextStatus ? 'success' : 'info'
            );
            return { ...p, isOnline: nextStatus };
          }
          return p;
        })
      );
    }
  };

  // Submit Registration and push to pending admin queue
  const submitPartnerRegistration = async () => {
    try {
      const savedPartner = await apiRequest('/partners/onboard', {
        method: 'POST',
        body: JSON.stringify(partnerReg)
      });
      setPartners(prev => [...prev, savedPartner]);
      addNotification('Registration Received 📑', 'Documents submitted to full-stack audit queue.', 'warning');
      setPartnerReg(INITIAL_REGISTRATION);
    } catch (err) {
      const newId = `p-${Date.now()}`;
      const newPartnerObj: Partner = {
        id: newId,
        name: partnerReg.personalDetails.name || 'John Doe',
        avatar: partnerReg.personalDetails.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
        category: partnerReg.profession || 'Handyman',
        rating: 5.0,
        reviewsCount: 0,
        isOnline: partnerReg.availabilityStatus === 'Available Now',
        distance: '2.5 km away',
        lat: locationCoords.lat + (Math.random() - 0.5) * 0.05,
        lng: locationCoords.lng + (Math.random() - 0.5) * 0.05,
        phone: partnerReg.personalDetails.phone || '+91 99999 88888',
        whatsapp: partnerReg.personalDetails.phone?.replace('+', '') || '919999988888',
        price: partnerReg.businessDetails.pricing || 299,
        experience: partnerReg.businessDetails.experience || '3',
        completedJobs: 0,
        languages: partnerReg.businessDetails.languages.length > 0 ? partnerReg.businessDetails.languages : ['English'],
        businessName: partnerReg.businessDetails.shopName || `${partnerReg.personalDetails.name}'s Services`,
        location: partnerReg.businessDetails.businessAddress || 'Velachery, Chennai',
        workingTime: partnerReg.businessDetails.workingHours || '9 AM - 6 PM',
        portfolio: partnerReg.portfolio.workPhotos.length > 0 ? partnerReg.portfolio.workPhotos : [
          'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&auto=format&fit=crop'
        ],
        reviews: [],
        adminStatus: 'pending',
        aadhaarNumber: '1111 2222 3333',
        panNumber: 'ABCDE1234F',
        bankAccount: partnerReg.uploads.bankAccount,
        upiId: partnerReg.uploads.upi,
        emergencyService: partnerReg.businessDetails.emergencyService,
        doorstepService: partnerReg.businessDetails.doorstepService,
        workingDays: partnerReg.businessDetails.workingDays,
        serviceRadius: partnerReg.businessDetails.serviceRadius,
        awards: partnerReg.portfolio.awards.length > 0 ? partnerReg.portfolio.awards : ['AllRounder Partner Registry'],
        responseTime: 10,
        cancellationRate: 1,
        repeatCustomers: 80,
        popularity: 85
      };

      setPartners(prev => [...prev, newPartnerObj]);
      addNotification('Registration Received 📑', 'Documents submitted for verification in sandbox.', 'warning');
      setPartnerReg(INITIAL_REGISTRATION);
    }
  };

  const addNotification = (title: string, message: string, type: Notification['type'] = 'info') => {
    const newNotif: Notification = {
      id: `nt-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      type,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Image Diagnostics simulation
  const analyzeImageFile = async (fileName: string): Promise<ImageAnalysisResult> => {
    setIsAnalyzingImage(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        let result: ImageAnalysisResult = {
          detectedProblem: "General Surface Wear",
          recommendedService: "Painter",
          estimatedArea: "100 sq.ft",
          materials: ["Wall Filler", "Sanding Paper", "Primer Coating"],
          laborCharge: 950,
          materialCost: 500,
          timeEstimate: "3-4 hours"
        };
        
        const lower = fileName.toLowerCase();
        if (lower.includes("wall") || lower.includes("crack") || lower.includes("paint") || lower.includes("damage")) {
          result = {
            detectedProblem: "Interior plaster wall crack with color fading",
            recommendedService: "Painter",
            estimatedArea: "120 sq.ft",
            materials: ["Acrylic Emulsion Paint (Pink)", "Gypsum Wall Putty", "Waterproof Primer"],
            laborCharge: 1200,
            materialCost: 800,
            timeEstimate: "1 day"
          };
        } else if (lower.includes("chair") || lower.includes("wood") || lower.includes("table") || lower.includes("furniture") || lower.includes("seat")) {
          result = {
            detectedProblem: "Structural leg fracture and laminate peeling",
            recommendedService: "Carpenter",
            estimatedArea: "1 Furniture Unit",
            materials: ["High-strength Wood Glue", "Reinforcement Dowels", "Varnish Coating spray"],
            laborCharge: 550,
            materialCost: 120,
            timeEstimate: "2.5 hours"
          };
        } else if (lower.includes("water") || lower.includes("leak") || lower.includes("pipe") || lower.includes("plumb") || lower.includes("drip")) {
          result = {
            detectedProblem: "Coroded steel connector threads and seal bypass",
            recommendedService: "Plumber",
            estimatedArea: "1 Pipe Outlet Joint",
            materials: ["Teflon Seal Tape", "Rubber Washer spacer", "PVC Pipe adhesive sealant"],
            laborCharge: 450,
            materialCost: 99,
            timeEstimate: "1.5 hours"
          };
        } else if (lower.includes("ac") || lower.includes("cool") || lower.includes("filter") || lower.includes("air")) {
          result = {
            detectedProblem: "Blocked carbon air filters causing coil freeze",
            recommendedService: "AC Service",
            estimatedArea: "1.5 Ton Split AC indoor unit",
            materials: ["Coolant gas R32 topup", "Coil sanitizer chemical spray"],
            laborCharge: 850,
            materialCost: 450,
            timeEstimate: "2 hours"
          };
        } else if (lower.includes("bike") || lower.includes("motorcycle") || lower.includes("engine") || lower.includes("chain")) {
          result = {
            detectedProblem: "Dry drive chain link friction and front disk pad wear",
            recommendedService: "Mechanic",
            estimatedArea: "1 Motorcycle drive-train assembly",
            materials: ["Synthetic Chain Lubricant", "Ceramic Disc Brake Pad set"],
            laborCharge: 950,
            materialCost: 550,
            timeEstimate: "3.5 hours"
          };
        } else if (lower.includes("car") || lower.includes("scratch") || lower.includes("bumper") || lower.includes("fender")) {
          result = {
            detectedProblem: "Fender bumper cosmetic clear-coat scratch",
            recommendedService: "Mechanic",
            estimatedArea: "Left front fender zone",
            materials: ["Rubbing polishing compound cream", "Matching metallic pink touchup pen"],
            laborCharge: 2200,
            materialCost: 1500,
            timeEstimate: "5 hours"
          };
        }

        setAnalysisResult(result);
        setIsAnalyzingImage(false);
        addNotification("AI Diagnostics Complete 📸", `Problem identified: ${result.detectedProblem}. Recommending ${result.recommendedService} service.`, "success");
        resolve(result);
      }, 2000);
    });
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        setLanguage,
        role,
        setRole,
        location,
        setLocation,
        locationCoords,
        setLocationCoords,
        locationDetails,
        requestLiveLocation,
        updateManualLocation,
        simulateGPS,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        walletBalance,
        walletTransactions,
        addWalletMoney,
        deductWalletMoney,
        bookings,
        addBooking,
        updateBookingStatus,
        activeTrackingId,
        setActiveTrackingId,
        partners,
        setPartners,
        togglePartnerOnline,
        notifications,
        addNotification,
        markNotificationsAsRead,
        searchQuery,
        setSearchQuery,
        voiceActive,
        setVoiceActive,
        partnerReg,
        setPartnerReg,
        submitPartnerRegistration,
        bookingHistory,
        setBookingHistory,
        fraudLogs,
        setFraudLogs,
        isAnalyzingImage,
        analysisResult,
        setAnalysisResult,
        analyzeImageFile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
