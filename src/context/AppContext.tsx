import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';

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
  adminStatus: 'pending' | 'approved' | 'rejected';
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
const INITIAL_PARTNERS: Partner[] = [
  {
    id: 'p-1',
    name: 'Suresh Ramachandran',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop',
    category: 'Painter',
    rating: 4.8,
    reviewsCount: 142,
    isOnline: true,
    distance: '200 m away',
    lat: 12.9800,
    lng: 80.2200,
    phone: '+91 98765 11111',
    whatsapp: '919876511111',
    price: 350,
    experience: '8',
    completedJobs: 412,
    languages: ['English', 'Tamil'],
    businessName: 'Suresh Color House',
    location: 'Velachery Bypass, Chennai',
    workingTime: '8 AM - 7 PM',
    portfolio: [
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&auto=format&fit=crop'
    ],
    reviews: [
      { name: 'Karthik V', rating: 5, comment: 'Suresh painted our hall with premium matte. Extremely tidy work.', date: '2026-07-02' },
      { name: 'Meera S', rating: 4, comment: 'Good painting quality and pricing was reasonable.', date: '2026-06-25' }
    ],
    adminStatus: 'approved',
    aadhaarNumber: '1111 2222 3333',
    panNumber: 'ABCDE1234F',
    emergencyService: true,
    doorstepService: true,
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    serviceRadius: 15,
    awards: ['Best Wall Finisher 2025', 'AllRounder Rated Top Partner'],
    responseTime: 5
  },
  {
    id: 'p-2',
    name: 'Rajesh Kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    category: 'Electrician',
    rating: 4.9,
    reviewsCount: 88,
    isOnline: true,
    distance: '1.2 km away',
    lat: 12.9900,
    lng: 80.2100,
    phone: '+91 98765 22222',
    whatsapp: '919876522222',
    price: 199,
    experience: '5',
    completedJobs: 245,
    languages: ['Tamil', 'Hindi'],
    businessName: 'Rajesh Electricals',
    location: 'Gandhi Nagar, Adyar',
    workingTime: '9 AM - 6 PM',
    portfolio: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&auto=format&fit=crop'
    ],
    reviews: [
      { name: 'Vijay P', rating: 5, comment: 'Fixed the geyser wiring issues quickly. Recommended!', date: '2026-07-10' }
    ],
    adminStatus: 'approved',
    aadhaarNumber: '2222 3333 4444',
    panNumber: 'FGHIJ5678K',
    emergencyService: true,
    doorstepService: true,
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    serviceRadius: 10,
    awards: ['Super Electrician Award 2026'],
    responseTime: 12
  },
  {
    id: 'p-3',
    name: 'Anjali Sharma',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop',
    category: 'Beautician',
    rating: 4.7,
    reviewsCount: 65,
    isOnline: true,
    distance: '1.8 km away',
    lat: 12.9700,
    lng: 80.2300,
    phone: '+91 98765 33333',
    whatsapp: '919876533333',
    price: 499,
    experience: '6',
    completedJobs: 180,
    languages: ['English', 'Hindi'],
    businessName: 'Glow Beauty Studio',
    location: 'OMR Road, Chennai',
    workingTime: '10 AM - 8 PM',
    portfolio: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&auto=format&fit=crop'
    ],
    reviews: [
      { name: 'Priya R', rating: 5, comment: 'Did a bridal facial package. Incredible shine and service.', date: '2026-07-08' }
    ],
    adminStatus: 'approved',
    aadhaarNumber: '3333 4444 5555',
    panNumber: 'KLMNO9012P',
    emergencyService: false,
    doorstepService: true,
    workingDays: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    serviceRadius: 8,
    awards: ['Glow Master Certificate'],
    responseTime: 20
  },
  {
    id: 'p-pending-1',
    name: 'Rohan Verma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
    category: 'Plumber',
    rating: 4.5,
    reviewsCount: 15,
    isOnline: false,
    distance: '4.0 km away',
    lat: 12.9500,
    lng: 80.2000,
    phone: '+91 98765 44444',
    whatsapp: '919876544444',
    price: 199,
    experience: '4',
    completedJobs: 42,
    languages: ['Hindi', 'English'],
    businessName: 'Rohan Plumbing Solutions',
    location: 'Tambaram, Chennai',
    workingTime: '9 AM - 6 PM',
    portfolio: [],
    reviews: [],
    adminStatus: 'pending',
    aadhaarNumber: '9999 8888 7777',
    panNumber: 'PQRST3456Z',
    emergencyService: true,
    doorstepService: true,
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    serviceRadius: 12,
    awards: ['Certified Leakage Expert'],
    responseTime: 8
  }
];

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

  // Sync dark theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    document.body.classList.add('dark');
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
  const addWalletMoney = (amount: number) => {
    setWalletBalance(prev => prev + amount);
    setWalletTransactions(prev => [
      {
        id: `tx-${Date.now()}`,
        type: 'credit',
        amount,
        description: 'Deposited Money via Pay Portal',
        date: new Date().toISOString().split('T')[0]
      },
      ...prev
    ]);
    addNotification('Wallet Credited 💰', `₹${amount} topup transaction succeeded.`, 'success');
  };

  const deductWalletMoney = (amount: number, desc: string): boolean => {
    if (walletBalance < amount) {
      addNotification('Payment Failed ❌', 'Insufficient wallet balance. Please add funds.', 'warning');
      return false;
    }
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
    addNotification('Service Order Placed 🚀', `Assigned dispatch matching code: ${bookingId}`, 'booking');
    
    return bookingId;
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
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
  };

  const togglePartnerOnline = (partnerId: string) => {
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
  };

  // Submit Registration and push to pending admin queue
  const submitPartnerRegistration = () => {
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
      gstNumber: partnerReg.businessDetails.gst,
      website: partnerReg.businessDetails.website,
      workingDays: partnerReg.businessDetails.workingDays,
      serviceRadius: partnerReg.businessDetails.serviceRadius,
      awards: partnerReg.portfolio.awards.length > 0 ? partnerReg.portfolio.awards : ['AllRounder Partner Registry'],
      responseTime: 10
    };

    setPartners(prev => [...prev, newPartnerObj]);
    addNotification('Registration Received 📑', 'Documents submitted for verification.', 'warning');
    
    // Reset state
    setPartnerReg(INITIAL_REGISTRATION);
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
        submitPartnerRegistration
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
