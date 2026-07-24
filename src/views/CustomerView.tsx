import React, { useState, useEffect } from 'react';
import { useApp, Partner, CartItem, ImageAnalysisResult } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { 
  Search, Star, MapPin, Tag, ShoppingBag, 
  Trash2, CreditCard, X, Navigation, Compass,
  SlidersHorizontal, ArrowUpDown, ShieldCheck, Phone, 
  MessageSquare, ExternalLink, Calendar, Clock, Sparkles, AlertOctagon, HelpCircle,
  Camera, Zap, AlertTriangle, Languages, Brain, ShieldAlert, Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES_DATA = [
  { id: 'cat-home', name: 'Home', icon: '🏠', group: 'Core' },
  { id: 'cat-food', name: 'Food Delivery', icon: '🍔', group: 'Core' },
  { id: 'cat-grocery', name: 'Grocery', icon: '🛒', group: 'Core' },
  { id: 'cat-taxi', name: 'Taxi', icon: '🚕', group: 'Core' },
  { id: 'cat-bike-taxi', name: 'Bike Taxi', icon: '🏍', group: 'Core' },
  { id: 'cat-courier', name: 'Courier', icon: '📦', group: 'Core' },
  { id: 'cat-car-rental', name: 'Car Rental', icon: '🚗', group: 'Core' },
  { id: 'cat-movies', name: 'Movie Tickets', icon: '🎬', group: 'Entertainment' },
  { id: 'cat-flights', name: 'Flights', icon: '✈', group: 'Travel' },
  { id: 'cat-train', name: 'Train', icon: '🚆', group: 'Travel' },
  { id: 'cat-bus', name: 'Bus', icon: '🚌', group: 'Travel' },
  { id: 'cat-hotels', name: 'Hotels', icon: '🏨', group: 'Travel' },
  { id: 'cat-pharmacy', name: 'Pharmacy', icon: '💊', group: 'Health' },
  { id: 'cat-doctor', name: 'Doctor', icon: '🏥', group: 'Health' },
  { id: 'cat-lab-test', name: 'Lab Test', icon: '🧪', group: 'Health' },
  { id: 'cat-beauty', name: 'Beauty Parlour', icon: '💇', group: 'Lifestyle' },
  { id: 'cat-spa', name: 'Spa', icon: '💆', group: 'Lifestyle' },
  { id: 'cat-gym', name: 'Gym', icon: '💪', group: 'Lifestyle' },
  { id: 'cat-home-services', name: 'Home Services', icon: '🛠', group: 'Handyman' },
  { id: 'cat-painter', name: 'Painter', icon: '🎨', group: 'Handyman' },
  { id: 'cat-carpenter', name: 'Carpenter', icon: '🪚', group: 'Handyman' },
  { id: 'cat-electrician', name: 'Electrician', icon: '⚡', group: 'Handyman' },
  { id: 'cat-plumber', name: 'Plumber', icon: '🚰', group: 'Handyman' },
  { id: 'cat-ac-service', name: 'AC Service', icon: '❄', group: 'Handyman' },
  { id: 'cat-cleaning', name: 'Cleaning', icon: '🧹', group: 'Handyman' },
  { id: 'cat-mechanic', name: 'Mechanic', icon: '🔧', group: 'Repairs' },
  { id: 'cat-cycle-repair', name: 'Cycle Repair', icon: '🚲', group: 'Repairs' },
  { id: 'cat-electronics', name: 'Electronics Repair', icon: '🖥', group: 'Repairs' },
  { id: 'cat-mobile', name: 'Mobile Repair', icon: '📱', group: 'Repairs' },
  { id: 'cat-laptop', name: 'Laptop Repair', icon: '💻', group: 'Repairs' },
  { id: 'cat-photographer', name: 'Photographer', icon: '📷', group: 'Creative' },
  { id: 'cat-videographer', name: 'Videographer', icon: '🎥', group: 'Creative' },
  { id: 'cat-event-planner', name: 'Event Planner', icon: '🎉', group: 'Creative' },
  { id: 'cat-cake', name: 'Cake Delivery', icon: '🎂', group: 'Core' },
  { id: 'cat-flower', name: 'Flower Delivery', icon: '🌸', group: 'Core' },
  { id: 'cat-pet', name: 'Pet Care', icon: '🐶', group: 'Lifestyle' },
  { id: 'cat-babysitter', name: 'Babysitter', icon: '👶', group: 'Lifestyle' },
  { id: 'cat-tutor', name: 'Tutor', icon: '📚', group: 'Education' },
  { id: 'cat-lawyer', name: 'Lawyer', icon: '⚖', group: 'Professional' },
  { id: 'cat-finance', name: 'Finance', icon: '💰', group: 'Professional' },
  { id: 'cat-insurance', name: 'Insurance', icon: '📄', group: 'Professional' },
  { id: 'cat-real-estate', name: 'Real Estate', icon: '🏢', group: 'Professional' },
  { id: 'cat-laundry', name: 'Laundry', icon: '👕', group: 'Lifestyle' },
  { id: 'cat-movers', name: 'Packers & Movers', icon: '🚛', group: 'Travel' },
  { id: 'cat-water-can', name: 'Water Can', icon: '💧', group: 'Core' },
  { id: 'cat-fuel', name: 'Fuel Delivery', icon: '⛽', group: 'Core' },
  { id: 'cat-cook', name: 'Home Cook', icon: '🍳', group: 'Lifestyle' },
  { id: 'cat-trainer', name: 'Gym Trainer', icon: '🏋️', group: 'Lifestyle' }
];

const OFFERS = [
  { id: 'o-1', title: '50% OFF on Rides', code: 'CAB50', desc: 'Get up to ₹100 discount on your first cab/bike ride.', bg: 'from-pink-600 to-rose-700' },
  { id: 'o-2', title: '₹199 Off Diagnostic Visit', code: 'FREEVISIT', desc: 'No service charge on plumber/painter consultation visits.', bg: 'from-fuchsia-600 to-pink-600' }
];

const MOCK_SCAN_PHOTOS = [
  { name: 'Cracked Wall (Paint Damage)', file: 'wall_crack.jpg', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&auto=format&fit=crop' },
  { name: 'Water Dripping (Leaky Pipe)', file: 'water_leak.jpg', url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=200&auto=format&fit=crop' },
  { name: 'Broken Chair (Wooden fracture)', file: 'chair_wood.jpg', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=200&auto=format&fit=crop' },
  { name: 'Dusty AC Unit (Filter issue)', file: 'ac_condenser.jpg', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&auto=format&fit=crop' }
];

export const CustomerView: React.FC = () => {
  const {
    cart, addToCart, removeFromCart, updateCartQuantity,
    clearCart, walletBalance, deductWalletMoney, addBooking, bookings,
    activeTrackingId, setActiveTrackingId, partners, searchQuery, setSearchQuery,
    addNotification, updateBookingStatus, locationCoords, bookingHistory,
    isAnalyzingImage, analysisResult, setAnalysisResult, analyzeImageFile
  } = useApp();

  const { t } = useTranslation();

  // UI Flow States
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  
  // Searching, sorting & filtering states
  const [partnerSearch, setPartnerSearch] = useState('');
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);
  const [filterEmergencyOnly, setFilterEmergencyOnly] = useState(false);
  const [filterDoorstepOnly, setFilterDoorstepOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'experience' | 'completedJobs' | 'cancellationRate' | 'popularity'>('rating');

  // AI Diagnostic camera tool open state
  const [isVisionOpen, setIsVisionOpen] = useState(false);
  const [scanningPhoto, setScanningPhoto] = useState<string | null>(null);
  const [laserActive, setLaserActive] = useState(false);

  // Partner Detail Modal
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [partnerReviewsOpen, setPartnerReviewsOpen] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  // AI Translation setup in Chat
  const [translateActive, setTranslateActive] = useState(true);

  // Cart & Checkout Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment'>('details');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'upi' | 'card'>('wallet');

  // Support Chat Simulation
  const [activePartnerChat, setActivePartnerChat] = useState<Partner | null>(null);
  const [chatInputText, setChatInputText] = useState('');
  const [chatLogs, setChatLogs] = useState<{ sender: 'user' | 'partner', text: string, translatedText?: string }[]>([]);

  // 1. Natural Language Search parsing
  const isSearchEmergency = /gas|fire|electrician fire|ambulance|smoke|short circuit|water block|leakage/i.test(searchQuery);
  const isSearchCheap = /cheap|budget|affordable|low price|lowest/i.test(searchQuery);
  const isSearchBest = /best|top|highly rated|famous|verified/i.test(searchQuery);
  const isSearchNearest = /nearest|near me|closest|gps/i.test(searchQuery);

  // Auto trigger notifications for emergency detection
  useEffect(() => {
    if (isSearchEmergency && searchQuery.length > 3) {
      addNotification(
        '🚨 AI EMERGENCY DETECTION',
        'Prioritizing verified 24/7 emergency dispatch technicians near you.',
        'warning'
      );
    }
  }, [searchQuery, isSearchEmergency]);

  // Categories mapping
  const groups = ['All', 'Core', 'Handyman', 'Health', 'Travel', 'Lifestyle', 'Entertainment', 'Professional'];
  const filteredCategories = CATEGORIES_DATA.filter(cat => {
    const matchesGroup = selectedGroup === 'All' || cat.group === selectedGroup;
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup || matchesSearch;
  });

  // Calculate recommendation coefficient weights for each partner
  const getRecommendationScore = (p: Partner): number => {
    let score = 0;
    // 1. Rating weight (out of 5, scaling x 10)
    score += p.rating * 10;
    // 2. Experience weight
    score += Math.min(10, parseInt(p.experience) || 0) * 1.5;
    // 3. Completed jobs
    score += Math.min(20, (p.completedJobs || 0) / 20);
    // 4. Distance bonus (closer is better)
    const dist = parseFloat(p.distance) || 10;
    score += Math.max(0, 10 - dist) * 2;
    // 5. Response speed (faster response time gets bonus)
    score += Math.max(0, 30 - p.responseTime) * 0.5;
    // 6. Cancellation penalty
    score -= (p.cancellationRate || 0) * 2;
    // 7. Repeat Customers
    score += (p.repeatCustomers || 0) * 0.15;
    // 8. Popularity
    score += (p.popularity || 0) * 0.1;
    // 9. Availability
    if (p.isOnline) score += 15;
    // 10. Emergency priority multiplier
    if (isSearchEmergency && p.emergencyService) score += 100;
    
    return Math.round(score);
  };

  // Filter partners matching specific clicked category (must be Admin Approved!)
  const categoryPartners = partners
    .filter(p => p.adminStatus === 'approved')
    .filter(p => {
      if (!activeCategoryFilter) return false;
      return p.category === activeCategoryFilter;
    })
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(partnerSearch.toLowerCase()) || 
                            p.businessName.toLowerCase().includes(partnerSearch.toLowerCase());
      const matchesAvailable = !filterAvailableOnly || p.isOnline;
      const matchesEmergency = !filterEmergencyOnly || p.emergencyService;
      const matchesDoorstep = !filterDoorstepOnly || p.doorstepService;
      
      return matchesSearch && matchesAvailable && matchesEmergency && matchesDoorstep;
    })
    .sort((a, b) => {
      // Dynamic priority if searching by specific keyword intent
      if (isSearchEmergency) {
        if (a.emergencyService !== b.emergencyService) return a.emergencyService ? -1 : 1;
      }
      if (isSearchCheap) {
        return a.price - b.price;
      }
      if (isSearchBest) {
        return b.rating - a.rating;
      }
      if (isSearchNearest) {
        const distA = parseFloat(a.distance) || 99;
        const distB = parseFloat(b.distance) || 99;
        return distA - distB;
      }

      // Default sorters
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'distance') {
        const distA = parseFloat(a.distance) || 99;
        const distB = parseFloat(b.distance) || 99;
        return distA - distB;
      }
      if (sortBy === 'cancellationRate') return a.cancellationRate - b.cancellationRate;
      if (sortBy === 'popularity') return b.popularity - a.popularity;
      return getRecommendationScore(b) - getRecommendationScore(a);
    });

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 50 : 0;
  const discount = (subtotal * discountPercent) / 100;
  const totalAmount = Math.max(0, subtotal + deliveryFee - discount);

  // Apply coupons
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'CAB50') {
      setDiscountPercent(15);
      addNotification('Coupon Applied 🎟', '15% discount applied successfully.', 'success');
    } else if (couponCode.toUpperCase() === 'FREEVISIT') {
      setDiscountPercent(20);
      addNotification('Coupon Applied 🎟', '20% discount applied successfully.', 'success');
    } else {
      addNotification('Invalid Promo 🎟', 'Try coupon CAB50 or FREEVISIT.', 'warning');
    }
  };

  // Payment checkout submit
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'wallet') {
      const success = deductWalletMoney(totalAmount, 'Super App service booking');
      if (!success) return;
    }

    // Place bookings
    cart.forEach(item => {
      const provider = partners.find(p => p.name === item.image) || partners[0];
      const bId = addBooking({
        category: item.category,
        categoryIcon: CATEGORIES_DATA.find(c => c.name === item.category)?.icon || '🛍',
        title: item.name,
        providerName: provider.name,
        providerPhone: provider.phone,
        price: item.price * item.quantity,
        status: 'pending'
      });

      // Simulate partner acceptance
      setTimeout(() => {
        updateBookingStatus(bId, 'accepted');
        setTimeout(() => {
          updateBookingStatus(bId, 'ongoing');
        }, 5000);
      }, 4000);
    });

    confetti({
      particleCount: 150,
      spread: 70,
      colors: ['#EC4899', '#D946EF', '#2563EB']
    });

    clearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setCheckoutStep('details');
  };

  // Direct Book from Profile
  const handleDirectBook = (partner: Partner) => {
    addToCart({
      id: `${partner.id}-booking`,
      name: `${t(`categories.${partner.category}`)} Visit - ${partner.businessName}`,
      price: partner.price,
      quantity: 1,
      category: partner.category,
      image: partner.name 
    });
    setSelectedPartner(null);
    setIsCartOpen(true);
  };

  // Chat submit mock with RTL auto-translation
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;

    const userText = chatInputText;
    setChatInputText('');

    let transText = undefined;
    if (translateActive) {
      // Simulating user typing in Tamil/Hindi, converting to English for partner
      if (/[அ-ஹ]/.test(userText)) {
        transText = `[AI Translated to English]: I want to confirm my schedule.`;
      } else {
        transText = `[AI Translated to Hindi]: मैं अपना समय बदलना चाहता हूँ।`;
      }
    }

    setChatLogs(prev => [...prev, { sender: 'user', text: userText, translatedText: transText }]);

    setTimeout(() => {
      const replies = [
        { orig: "मैं 10 मिनट में वहाँ पहुँच रहा हूँ।", trans: "I am reaching there in 10 minutes." },
        { orig: "வண்டி எண் எனக்குப் பகிரவும்.", trans: "Please share the vehicle/block number." },
        { orig: "I am on my way.", trans: "நான் கிளம்பிவிட்டேன்." }
      ];
      const pick = replies[Math.floor(Math.random() * replies.length)];
      setChatLogs(prev => [
        ...prev, 
        { 
          sender: 'partner', 
          text: pick.orig, 
          translatedText: translateActive ? `[AI Translated]: ${pick.trans}` : undefined 
        }
      ]);
    }, 1500);
  };

  const handleOpenChat = (p: Partner) => {
    setActivePartnerChat(p);
    setChatLogs([{ sender: 'partner', text: `Hello! I am your ${t(`categories.${p.category}`)} provider ${p.name}. How can I help you today?` }]);
  };

  // Simulate photo uploader selection
  const handleChooseSamplePhoto = async (photo: typeof MOCK_SCAN_PHOTOS[0]) => {
    setScanningPhoto(photo.url);
    setLaserActive(true);
    // Trigger Context simulation
    await analyzeImageFile(photo.file);
    setLaserActive(false);
  };

  return (
    <div className="relative min-h-screen bg-[#0F172A] text-slate-100 pb-16">
      
      {/* 1. Landing Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#1E293B]/70 to-[#0F172A] py-16 px-4 text-center border-b border-white/5">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#EC4899_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
        
        <div className="relative mx-auto max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 px-3 py-1 text-xs font-bold text-pink-400 border border-pink-500/20">
            <Cpu className="h-3.5 w-3.5 animate-spin" />
            🤖 AI-Powered Super Recommendation Engine Enabled
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">
            {t('brand')}. <span className="bg-gradient-to-r from-pink-500 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent">{t('slogan')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider">
            Verified Local Partners Onboarded Live with Biometrics Audit
          </p>

          {/* Search everything bar */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="flex items-center rounded-2xl bg-slate-900 border border-white/5 p-2 shadow-2xl focus-within:border-pink-500/50 transition-all relative">
              <Search className="h-5 w-5 text-slate-500 ml-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search pro name or ask AI: 'cheap painter near me', 'emergency fire plumber'..."
                className="w-full bg-transparent px-3 py-2 text-xs text-white outline-none placeholder:text-slate-500"
              />
              <div className="flex items-center gap-1.5 pr-2">
                <button 
                  onClick={() => setIsVisionOpen(!isVisionOpen)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-400 shrink-0 flex items-center justify-center gap-1"
                  title="AI Vision Camera Scanner"
                >
                  <Camera className="h-4 w-4" />
                  <span className="hidden sm:inline text-[9px] font-black uppercase">Scan Damage</span>
                </button>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-wider"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Keyword Intents badge highlights */}
            <div className="mt-2.5 flex items-center justify-center gap-1.5 flex-wrap text-[9px] text-slate-400 uppercase tracking-widest font-black">
              {isSearchEmergency && <span className="bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded animate-pulse">🚨 emergency alert prioritized</span>}
              {isSearchCheap && <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">💰 budget pricing sorted</span>}
              {isSearchBest && <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded">⭐ high rating sorted</span>}
              {isSearchNearest && <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded">📍 nearest distance sorted</span>}
            </div>
          </div>
        </div>
      </section>

      {/* Main page content container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
        
        {/* AI Vision Photo Analyzer Drawer Panel */}
        {isVisionOpen && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl relative overflow-hidden animate-in slide-in-from-top duration-300">
            <button 
              onClick={() => {
                setIsVisionOpen(false);
                setAnalysisResult(null);
                setScanningPhoto(null);
              }}
              className="absolute right-4 top-4 p-1.5 rounded-xl hover:bg-slate-800 text-slate-400"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 text-pink-400">
              <Brain className="h-5 w-5 animate-pulse text-pink-500" />
              <h3 className="text-sm font-black uppercase tracking-wider text-white">AI Vision Damage Diagnostician</h3>
            </div>

            <div className="grid sm:grid-cols-12 gap-6">
              {/* Photo Selector */}
              <div className="sm:col-span-5 space-y-4">
                <span className="text-[10px] font-black uppercase text-slate-500 block mb-2 tracking-wider">Choose Sample Repair Photo</span>
                <div className="grid grid-cols-2 gap-2">
                  {MOCK_SCAN_PHOTOS.map(p => (
                    <button
                      key={p.name}
                      onClick={() => handleChooseSamplePhoto(p)}
                      className="group relative h-24 rounded-2xl overflow-hidden border border-white/5 hover:border-pink-500 transition-all text-left"
                    >
                      <img src={p.url} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-slate-950/60 p-2 flex flex-col justify-end">
                        <span className="text-[9px] font-extrabold text-white leading-tight uppercase">{p.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Laser Scanning display */}
              <div className="sm:col-span-3 flex flex-col items-center justify-center">
                <div className="relative h-32 w-32 rounded-3xl overflow-hidden bg-slate-950 border border-white/5 shadow-inner flex items-center justify-center">
                  {scanningPhoto ? (
                    <>
                      <img src={scanningPhoto} className="h-full w-full object-cover" />
                      {laserActive && (
                        <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent shadow-[0_0_8px_#EC4899] animate-bounce top-0" />
                      )}
                    </>
                  ) : (
                    <Camera className="h-10 w-10 text-slate-700 animate-pulse" />
                  )}
                </div>
                {isAnalyzingImage && <span className="text-[10px] font-black text-pink-400 animate-pulse mt-2 uppercase tracking-widest">Scanning Texture...</span>}
              </div>

              {/* Diagnostic report output */}
              <div className="sm:col-span-4 flex flex-col justify-between">
                {analysisResult ? (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-2 text-xs text-slate-400">
                    <h4 className="text-[9px] font-black uppercase text-pink-450 tracking-wider">AI Vision Diagnosis Report</h4>
                    <div>🔍 Problem: <span className="font-bold text-white">{analysisResult.detectedProblem}</span></div>
                    <div>🛠️ Trade Match: <span className="font-bold text-pink-400">{analysisResult.recommendedService}</span></div>
                    <div>📐 Estimated Size: <span className="font-bold text-white">{analysisResult.estimatedArea}</span></div>
                    <div>🧱 Materials Needed: <span className="font-bold text-white">{analysisResult.materials.join(', ')}</span></div>
                    
                    {/* Cost estimates breakdown */}
                    <div className="pt-2 border-t border-white/5 mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span>Labor Charge:</span>
                        <span className="font-bold text-slate-200">₹{analysisResult.laborCharge}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Materials Cost:</span>
                        <span className="font-bold text-slate-200">₹{analysisResult.materialCost}</span>
                      </div>
                      <div className="flex justify-between text-pink-455 font-extrabold">
                        <span>Estimated total:</span>
                        <span>₹{analysisResult.laborCharge + analysisResult.materialCost}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span>Time Required:</span>
                        <span className="font-bold text-white">{analysisResult.timeEstimate}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setActiveCategoryFilter(analysisResult.recommendedService);
                        setIsVisionOpen(false);
                      }}
                      className="w-full mt-3 rounded-xl btn-pink-gradient py-2 text-[10px] uppercase font-black tracking-wider flex items-center justify-center gap-1"
                    >
                      <Zap className="h-3 w-3" />
                      <span>Book Matched Professionals</span>
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center p-4 border border-dashed border-white/5 rounded-2xl text-[10px] text-slate-500">
                    Upload or choose a sample photo to run computer vision diagnostic scan
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. AI Personalized Dashboard Panel */}
        <section className="rounded-3xl border border-white/5 bg-slate-900/60 p-5 shadow-xl backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 text-pink-400">
            <Brain className="h-5 w-5 text-pink-500 animate-pulse shrink-0" />
            <h3 className="text-xs font-black uppercase text-white tracking-widest">AI Personalized Hub</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-555 block tracking-wider mb-1.5">Personalized Recommendations</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Welcome back! Based on your booking history (Painter, Electrician), we recommend **Suresh Ramachandran** (Painter, 200 m away) for quick maintenance touch-ups.
                </p>
              </div>
              <button onClick={() => { setActiveCategoryFilter('Painter'); setSelectedPartner(partners[0]); }} className="mt-3 text-[10px] text-pink-400 font-extrabold uppercase hover:underline text-left">View Suresh's Profile →</button>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-555 block tracking-wider mb-1.5">Seasonal Weather Picks</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Monsoon conditions are forming over Adyar. Prioritize scheduling house waterproofing with Suresh or backup power wiring installations with Rajesh.
                </p>
              </div>
              <button onClick={() => setActiveCategoryFilter('Electrician')} className="mt-3 text-[10px] text-pink-400 font-extrabold uppercase hover:underline text-left">Find Electricians →</button>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-555 block tracking-wider mb-1.5">Nearby Smart Offers</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Consultation charges are reduced by **₹199** for plumbers within Adyar sectors. Apply coupon **FREEVISIT** to claim.
                </p>
              </div>
              <span className="mt-3 inline-block bg-pink-500/10 border border-pink-500/20 text-pink-400 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider w-max">Claim Discount</span>
            </div>
          </div>
        </section>

        {/* 3. Map route animation display if active booking is ongoing */}
        {bookings.some(b => b.status === 'ongoing' || b.status === 'accepted') && (
          <div className="rounded-3xl border border-white/5 bg-slate-900/50 p-4 shadow-xl backdrop-blur-xl">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-xs font-black uppercase text-pink-400 tracking-wider flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-pink-400 animate-pulse shrink-0" />
                  <span>Real-time GPS Tracking</span>
                </h3>
                <p className="text-[10px] text-slate-400">Your assigned partner is navigating to your address.</p>
              </div>
              <div className="flex gap-1.5">
                {bookings.filter(b => b.status === 'ongoing' || b.status === 'accepted').map(b => (
                  <button
                    key={b.id}
                    onClick={() => setActiveTrackingId(b.id)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all uppercase ${
                      activeTrackingId === b.id 
                        ? 'btn-pink-gradient' 
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {b.categoryIcon} {b.id.substring(3)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Interactive GPS SVG Map */}
            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/5 shadow-inner flex items-center justify-center">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#EC4899_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
              <svg className="absolute inset-0 w-full h-full stroke-white/5 stroke-[2] fill-none">
                <path d="M 0,100 H 1200 M 0,200 H 1200 M 150,0 V 400 M 350,0 V 400 M 600,0 V 400" />
                <path d="M 50,50 C 150,50 150,150 250,150 S 350,250 400,250 H 600" className="stroke-pink-500/10" />
              </svg>

              {/* Pin User */}
              <div className="absolute left-[80%] top-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
                <span className="mt-1 bg-pink-500 text-[8px] font-black text-white px-1.5 py-0.5 rounded shadow-lg uppercase">You</span>
              </div>

              {/* Vehicle tracking dot */}
              {(() => {
                const activeB = bookings.find(b => b.id === activeTrackingId);
                if (activeB && activeB.status === 'ongoing' && activeB.routeCoordinates) {
                  const pos = activeB.routeCoordinates[activeB.currentPosIndex || 0] || { x: 50, y: 50 };
                  return (
                    <div 
                      className="absolute flex flex-col items-center z-10 transition-all duration-1000 ease-linear"
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    >
                      <div className="bg-gradient-to-r from-pink-500 to-fuchsia-600 border border-white/20 text-white rounded-xl py-1 px-2.5 shadow-2xl flex items-center gap-1.5">
                        <span className="text-sm animate-bounce">{activeB.categoryIcon}</span>
                        <span className="text-[8px] font-black tracking-widest uppercase">EN ROUTE</span>
                      </div>
                      <div className="text-[8px] text-pink-300 bg-slate-900/90 rounded px-1 mt-1 font-bold border border-white/5 shadow">
                        ETA {Math.max(1, Math.round((100 - activeB.progress) / 10))} mins
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        )}

        {/* 3. Categories & Directory Flow */}
        {!activeCategoryFilter ? (
          // General Landing Layout
          <>
            {/* Category directory list */}
            <section className="space-y-4">
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <div>
                  <h2 className="text-lg font-black text-white uppercase tracking-wider">{t('categoriesTitle')}</h2>
                  <p className="text-[10px] text-slate-550">Select any category to browse verified local providers</p>
                </div>
                <div className="flex items-center space-x-1.5 overflow-x-auto whitespace-nowrap scrollbar-none max-w-sm sm:max-w-md lg:max-w-none">
                  {groups.map(g => (
                    <button
                      key={g}
                      onClick={() => setSelectedGroup(g)}
                      className={`rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                        selectedGroup === g
                          ? 'btn-pink-gradient'
                          : 'bg-slate-900 border border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {filteredCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryFilter(cat.name)}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900 border border-white/5 shadow-md hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                  >
                    <div className="text-3xl transition-transform duration-300 group-hover:scale-115">{cat.icon}</div>
                    <span className="mt-2.5 text-[10px] font-bold text-slate-300 group-hover:text-pink-400 text-center truncate w-full uppercase tracking-wider">
                      {t(`categories.${cat.name}`)}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Popular offers banner */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-white uppercase tracking-wider">{t('popularOffers')}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {OFFERS.map(o => (
                  <div key={o.id} className="rounded-3xl p-6 bg-gradient-to-r from-pink-650 to-rose-800 text-white shadow-xl flex flex-col justify-between relative overflow-hidden border border-white/10 group">
                    <div className="absolute right-0 bottom-0 opacity-10 text-9xl font-extrabold -mr-6 -mb-6 transition-transform group-hover:scale-110">%</div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight">{o.title}</h3>
                      <p className="text-xs text-white/80 mt-1">{o.desc}</p>
                    </div>
                    <div className="mt-5 flex justify-between items-center z-10">
                      <div className="rounded-xl bg-white/15 border border-white/30 px-3.5 py-1.5 font-mono text-xs font-black uppercase tracking-wider">{o.code}</div>
                      <button 
                        onClick={() => {
                          setCouponCode(o.code);
                          addNotification('Promo Code Linked 🎟', `Coupon ${o.code} copied to checkout drawer.`, 'info');
                        }}
                        className="rounded-xl bg-white px-4 py-2 text-[10px] font-black uppercase text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        Use Promo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          // Category Specific Listing
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setActiveCategoryFilter(null);
                    setPartnerSearch('');
                  }}
                  className="p-2 rounded-xl bg-slate-900 border border-white/5 hover:border-pink-500/40 text-slate-300"
                >
                  ← Back
                </button>
                <div>
                  <span className="text-[10px] font-black uppercase text-pink-400 tracking-wider">Services Directory</span>
                  <h2 className="text-2xl font-black text-white uppercase">{t(`categories.${activeCategoryFilter}`)} Providers</h2>
                </div>
              </div>

              {/* Advanced recommendation sorting selects */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center rounded-xl bg-slate-900 border border-white/5 px-3 py-1.5 text-xs">
                  <Search className="h-4 w-4 text-slate-500 mr-2" />
                  <input
                    type="text"
                    value={partnerSearch}
                    onChange={e => setPartnerSearch(e.target.value)}
                    placeholder="Search pro name..."
                    className="bg-transparent outline-none text-white w-32 text-xs"
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-slate-900 border border-white/5 px-3 py-1.5 rounded-xl text-xs text-slate-350">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-pink-400" />
                  <button 
                    onClick={() => setFilterAvailableOnly(!filterAvailableOnly)}
                    className={`font-bold uppercase text-[9px] tracking-wider ${filterAvailableOnly ? 'text-pink-400' : 'text-slate-500'}`}
                  >
                    Online
                  </button>
                  <span className="text-white/10">|</span>
                  <button 
                    onClick={() => setFilterEmergencyOnly(!filterEmergencyOnly)}
                    className={`font-bold uppercase text-[9px] tracking-wider ${filterEmergencyOnly ? 'text-pink-400' : 'text-slate-500'}`}
                  >
                    Emergency
                  </button>
                  <span className="text-white/10">|</span>
                  <button 
                    onClick={() => setFilterDoorstepOnly(!filterDoorstepOnly)}
                    className={`font-bold uppercase text-[9px] tracking-wider ${filterDoorstepOnly ? 'text-pink-400' : 'text-slate-500'}`}
                  >
                    Doorstep
                  </button>
                </div>

                {/* Customer Recommendation Sorting selections */}
                <div className="flex items-center gap-1.5 bg-slate-900 border border-white/5 px-3 py-1.5 rounded-xl text-xs text-slate-300">
                  <ArrowUpDown className="h-3.5 w-3.5 text-pink-400 shrink-0" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Sort by:</span>
                  <select 
                    value={sortBy} 
                    onChange={e => setSortBy(e.target.value as any)}
                    className="bg-transparent outline-none text-[10px] font-black uppercase text-pink-400 cursor-pointer"
                  >
                    <option value="rating" className="bg-slate-950">Highest Rating ⭐</option>
                    <option value="distance" className="bg-slate-950">Nearest Distance 📍</option>
                    <option value="cancellationRate" className="bg-slate-950">Lowest Cancellation Rate 📉</option>
                    <option value="popularity" className="bg-slate-950">Highest Popularity 🌟</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Providers Grid */}
            {categoryPartners.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-white/5">
                <span className="text-3xl">📭</span>
                <h3 className="text-sm font-bold text-slate-400 mt-3">No verified partners match criteria</h3>
                <p className="text-[10px] text-slate-555 mt-1">Try resetting search filters or register a painter in Partner App.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryPartners.map(partner => {
                  const recommendationScore = getRecommendationScore(partner);
                  const isRecommended = recommendationScore > 90 || (isSearchEmergency && partner.emergencyService);
                  return (
                    <div 
                      key={partner.id}
                      className={`rounded-3xl bg-slate-900 p-5 flex flex-col justify-between shadow-lg transition-all duration-300 group border relative ${
                        isRecommended 
                          ? 'border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.15)]' 
                          : 'border-white/5 hover:border-pink-500/40'
                      }`}
                    >
                      {/* AI Recommended Badge */}
                      {isRecommended && (
                        <div className="absolute -top-3 left-6 bg-gradient-to-r from-pink-500 to-fuchsia-600 border border-white/20 text-white rounded-full py-0.5 px-3 shadow-md flex items-center gap-1 z-10 animate-bounce">
                          <Cpu className="h-3 w-3" />
                          <span className="text-[8px] font-black uppercase tracking-widest">AI Recommended</span>
                        </div>
                      )}

                      <div>
                        {/* Top Header Card */}
                        <div className="flex gap-4">
                          <img 
                            src={partner.avatar} 
                            alt={partner.name} 
                            className="h-16 w-16 rounded-2xl object-cover border border-white/10 shrink-0 shadow-md"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-extrabold text-white truncate">{partner.name}</h4>
                              <span className="text-pink-400 flex items-center shrink-0" title={t('verifiedPartner')}>
                                <ShieldCheck className="h-4.5 w-4.5 fill-pink-500/10 text-pink-500" />
                              </span>
                            </div>
                            <span className="text-[9px] font-bold text-slate-450 block tracking-wider uppercase mt-0.5">{partner.businessName}</span>
                            
                            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-amber-500 font-bold">
                              <Star className="h-3.5 w-3.5 fill-current shrink-0" />
                              <span>{partner.rating}</span>
                              <span className="text-slate-500 font-normal">({partner.reviewsCount} jobs)</span>
                            </div>
                          </div>
                        </div>

                        {/* Middle attributes */}
                        <div className="mt-4 grid grid-cols-2 gap-2.5 text-[10px] text-slate-400 border-t border-white/5 pt-4">
                          <div>💼 {t('experienceLabel')}: <span className="text-white font-bold">{partner.experience} Yrs</span></div>
                          <div>🔧 {t('completedJobsLabel')}: <span className="text-white font-bold">{partner.completedJobs} Tasks</span></div>
                          <div>🗣️ {t('languagesLabel')}: <span className="text-white font-bold truncate max-w-[80px] inline-block">{partner.languages.join(', ')}</span></div>
                          <div>📍 GPS Dist: <span className="text-white font-bold">{partner.distance}</span></div>
                          <div>⚡ {t('responseSpeedLabel')}: <span className="text-pink-400 font-bold">{partner.responseTime} mins avg</span></div>
                          <div>📉 Cancel Rate: <span className="text-white font-bold">{partner.cancellationRate}%</span></div>
                          <div>👥 Repeat Cust: <span className="text-white font-bold">{partner.repeatCustomers}%</span></div>
                          <div>🔥 Popularity: <span className="text-white font-bold">{partner.popularity}/100</span></div>
                        </div>

                        {/* Pricing and Available badge */}
                        <div className="mt-4 flex justify-between items-center">
                          <div>
                            <span className="text-[9px] text-slate-550 uppercase font-black block tracking-wider">Service Fee</span>
                            <span className="text-base font-black text-pink-400">₹{partner.price} <span className="text-[10px] font-bold text-slate-500">/visit</span></span>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                              partner.isOnline 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' 
                                : 'bg-slate-800 text-slate-450'
                            }`}>
                              {partner.isOnline ? t('availableNow') : t('holidayMode')}
                            </span>
                            {partner.emergencyService && (
                              <span className="text-[8px] font-black bg-red-500/10 border border-red-500/20 text-red-400 px-1.5 py-0.5 rounded animate-pulse uppercase tracking-wider">
                                🚨 24/7 SOS Support
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Actions */}
                      <div className="mt-6 flex gap-2 pt-4 border-t border-white/5">
                        <button 
                          onClick={() => setSelectedPartner(partner)}
                          className="flex-1 rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-black uppercase text-slate-200 border border-white/5 flex items-center justify-center gap-1.5"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>View Profile</span>
                        </button>
                        <button 
                          onClick={() => handleDirectBook(partner)}
                          className="flex-1 rounded-xl btn-pink-gradient py-2.5 text-xs uppercase font-black tracking-wide"
                        >
                          {t('bookNow')}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

      </div>

      {/* 4. Single Partner Detail Profile Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-premium max-w-xl w-full rounded-3xl p-6 shadow-2xl relative border border-white/10 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => {
                setSelectedPartner(null);
                setPartnerReviewsOpen(false);
                setShowDirections(false);
              }}
              className="absolute right-4 top-4 p-2 rounded-xl bg-slate-900 border border-white/5 hover:border-pink-500/40 text-slate-400"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4 mb-6">
              <img src={selectedPartner.avatar} className="h-20 w-20 rounded-2xl object-cover shadow-lg border border-white/10" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-black text-white">{selectedPartner.name}</h3>
                  <span className="text-pink-400" title={t('verifiedPartner')}>
                    <ShieldCheck className="h-5 w-5 fill-pink-500/10 text-pink-500" />
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">{selectedPartner.businessName}</span>
                <span className="inline-block mt-2 px-2.5 py-1 rounded bg-slate-800 text-[10px] text-pink-400 font-black uppercase tracking-wider">
                  {t(`categories.${selectedPartner.category}`)}
                </span>
              </div>
            </div>

            {/* Profile body */}
            <div className="space-y-5">
              
              {/* Detailed Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-950/60 p-4 rounded-2xl border border-white/5">
                <div>
                  <span className="text-[9px] text-slate-555 font-black uppercase block">{t('experienceLabel')}</span>
                  <span className="font-extrabold text-white">{selectedPartner.experience} Years</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-555 font-black uppercase block">{t('completedJobsLabel')}</span>
                  <span className="font-extrabold text-white">{selectedPartner.completedJobs} Tasks</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-555 font-black uppercase block">{t('ratingScoreLabel')}</span>
                  <span className="font-extrabold text-white flex items-center gap-1">⭐ {selectedPartner.rating}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-555 font-black uppercase block">{t('workingHoursLabel')}</span>
                  <span className="font-extrabold text-white">{selectedPartner.workingTime}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-555 font-black uppercase block">{t('languagesLabel')}</span>
                  <span className="font-extrabold text-white truncate block">{selectedPartner.languages.join(', ')}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-555 font-black uppercase block">{t('responseSpeedLabel')}</span>
                  <span className="font-extrabold text-pink-450">{selectedPartner.responseTime} mins avg</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-555 font-black uppercase block">Cancellation rate</span>
                  <span className="font-extrabold text-white">{selectedPartner.cancellationRate}%</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-555 font-black uppercase block">Repeat Customers</span>
                  <span className="font-extrabold text-white">{selectedPartner.repeatCustomers}%</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-555 font-black uppercase block">{t('serviceRadiusLabel')}</span>
                  <span className="font-extrabold text-white">{selectedPartner.serviceRadius} km</span>
                </div>
              </div>

              {/* AI Smart Scheduling slot selector */}
              <div className="p-4 bg-pink-500/5 border border-pink-500/10 rounded-2xl space-y-1.5">
                <h4 className="text-[10px] font-black uppercase text-pink-450 tracking-wider flex items-center gap-1.5">
                  <Clock className="h-4 w-4 animate-spin text-pink-500" />
                  <span>AI Smart Slot Recommendation</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Recommended Time Slot: **Tuesday 10:00 AM**
                </p>
                <div className="text-[9px] text-slate-500">
                  Heuristic inputs: Low traffic forecast, Sunny weather (best for {selectedPartner.category}), and Partner has 100% historical response speed.
                </div>
              </div>

              {/* Sentiment Summary breakdown */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-1.5">
                <h4 className="text-[10px] font-black uppercase text-pink-400 tracking-wider">AI Sentiment Review Analysis</h4>
                <p className="text-[11px] text-slate-300 italic">
                  "AI Review Summary: Customers highly appreciate prompt arrival, professional tools maintenance, and clean surface finishes. 2 Duplicate bot reviews filtered."
                </p>
                <div className="flex justify-between text-[9px] text-slate-500 pt-1">
                  <span>Sentiment index: 96.4% positive</span>
                  <span>Fake Reviews Blocked: 2</span>
                </div>
              </div>

              {/* Portfolio Carousel */}
              {selectedPartner.portfolio.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase text-pink-400 tracking-wider mb-2">Service Portfolio</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedPartner.portfolio.map((img, idx) => (
                      <img 
                        key={idx} 
                        src={img} 
                        className="h-20 w-full object-cover rounded-xl border border-white/5 hover:border-pink-500 transition-all cursor-zoom-in" 
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Call/WhatsApp and GPS directions buttons */}
              <div className="flex gap-2 border-t border-white/5 pt-4">
                <a 
                  href={`tel:${selectedPartner.phone}`}
                  onClick={() => addNotification('Hook calling...', `Dialer trigger for ${selectedPartner.phone}`, 'info')}
                  className="flex-1 rounded-xl bg-slate-900 border border-white/5 py-2.5 text-xs font-black uppercase text-slate-355 hover:text-white flex items-center justify-center gap-1.5"
                >
                  <Phone className="h-4 w-4 text-emerald-400" />
                  <span>{t('callPro')}</span>
                </a>
                <button 
                  onClick={() => {
                    setSelectedPartner(null);
                    handleOpenChat(selectedPartner);
                  }}
                  className="flex-1 rounded-xl bg-slate-900 border border-white/5 py-2.5 text-xs font-black uppercase text-slate-355 hover:text-white flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="h-4 w-4 text-pink-400" />
                  <span>{t('aiChat')}</span>
                </button>
                <button 
                  onClick={() => setShowDirections(!showDirections)}
                  className="flex-1 rounded-xl bg-slate-900 border border-white/5 py-2.5 text-xs font-black uppercase text-slate-355 hover:text-white flex items-center justify-center gap-1.5"
                >
                  <Navigation className="h-4 w-4 text-blue-400" />
                  <span>{t('gpsMap')}</span>
                </button>
              </div>

              {/* GPS Navigation directions module */}
              {showDirections && (
                <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-blue-400 tracking-wider">Google Maps Directions</h4>
                  <div className="relative h-32 w-full bg-slate-900 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center text-xs">
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#EC4899_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
                    <svg className="absolute inset-0 w-full h-full stroke-pink-500/25 stroke-[2] fill-none">
                      <path d="M 20,20 L 120,60 H 300" />
                    </svg>
                    <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-1 rounded text-[9px] text-slate-400">
                      Distance: {selectedPartner.distance} • Service Radius: {selectedPartner.serviceRadius} km
                    </div>
                  </div>
                </div>
              )}

              {/* Customer reviews toggle */}
              <div className="border-t border-white/5 pt-4">
                <button 
                  onClick={() => setPartnerReviewsOpen(!partnerReviewsOpen)}
                  className="w-full flex justify-between items-center text-xs font-bold text-slate-355 hover:text-pink-400"
                >
                  <span>{t('customerReviewsLabel')} ({selectedPartner.reviews.length})</span>
                  <span>{partnerReviewsOpen ? '▼' : '►'}</span>
                </button>
                {partnerReviewsOpen && (
                  <div className="mt-3 space-y-3 max-h-40 overflow-y-auto pr-2 divide-y divide-white/5">
                    {selectedPartner.reviews.length === 0 ? (
                      <p className="text-[10px] text-slate-555 py-2">No reviews yet for this partner</p>
                    ) : (
                      selectedPartner.reviews.map((rev, idx) => (
                        <div key={idx} className="pt-2 text-xs">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-slate-300">{rev.name}</span>
                            <span className="text-amber-400">★ {rev.rating}</span>
                          </div>
                          <p className="text-[11px] text-slate-450 mt-1 italic">"{rev.comment}"</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Booking trigger */}
            <div className="mt-6 pt-4 border-t border-white/5">
              <button 
                onClick={() => handleDirectBook(selectedPartner)}
                className="w-full rounded-xl btn-pink-gradient py-3 text-xs uppercase font-black tracking-widest"
              >
                {t('bookNow')} (₹{selectedPartner.price})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs">
          <div className="glass-premium max-w-md w-full h-full p-6 shadow-2xl relative border-l border-white/10 flex flex-col justify-between">
            <div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-555"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-sm font-black uppercase text-pink-400 tracking-wider flex items-center gap-2 mb-6">
                <ShoppingBag className="h-5 w-5" />
                <span>{t('cart')}</span>
              </h3>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 divide-y divide-white/5">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-slate-555 text-xs">Cart is empty</div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="py-3 flex justify-between items-center gap-3">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-pink-400">{t(`categories.${item.category}`)}</span>
                        <h4 className="text-xs font-extrabold text-white">{item.name}</h4>
                        <span className="text-xs font-black text-slate-300 mt-1 block">₹{item.price * item.quantity}</span>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="h-6 w-6 rounded bg-slate-850 text-white font-bold flex items-center justify-center text-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 rounded bg-slate-850 text-white font-bold flex items-center justify-center text-xs"
                        >
                          +
                        </button>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 rounded text-pink-500 hover:bg-pink-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {cart.length > 0 && (
              <div className="border-t border-white/5 pt-4">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>{t('gpsCharges')}</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm font-black mt-2 text-white border-t border-white/5 pt-2">
                  <span>{t('grandTotal')}</span>
                  <span className="text-pink-400">₹{totalAmount}</span>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="mt-4 w-full rounded-xl btn-pink-gradient py-3 text-xs uppercase font-black tracking-widest flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>{t('secureCheckout')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Razorpay/Stripe styled checkout */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-premium max-w-md w-full rounded-3xl p-6 shadow-2xl relative border border-white/10 mx-4">
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-lg bg-pink-500 text-white flex items-center justify-center text-xs font-bold font-mono">P</div>
              <h3 className="text-xs font-black tracking-widest uppercase text-white">{t('secureCheckout')}</h3>
            </div>

            {checkoutStep === 'details' ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-950 p-4 border border-white/5">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-555 mb-2">{t('invoiceSummary')}</h4>
                  <div className="space-y-1.5 text-xs text-slate-350">
                    <div className="flex justify-between">
                      <span>{t('totalItems')}</span>
                      <span>{cart.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('serviceFee')}</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-pink-400 font-bold">
                        <span>{t('discountApplied')}</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>{t('gpsCharges')}</span>
                      <span>₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black border-t border-white/5 pt-1.5 text-white">
                      <span>{t('grandTotal')}</span>
                      <span>₹{totalAmount}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="Promo Code (e.g. CAB55)"
                    className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-pink-500 text-white"
                  />
                  <button type="submit" className="rounded-xl bg-slate-800 px-4 py-2 text-xs text-white hover:bg-slate-700 font-bold uppercase">
                    Apply
                  </button>
                </form>

                <button
                  onClick={() => setCheckoutStep('payment')}
                  className="w-full rounded-xl btn-pink-gradient py-2.5 text-xs uppercase font-black tracking-wider"
                >
                  Select Payment Option
                </button>
              </div>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-455">{t('checkoutGateway')}</label>
                  <label className={`flex justify-between items-center p-3 rounded-2xl border cursor-pointer ${
                    paymentMethod === 'wallet' ? 'border-pink-500 bg-pink-500/5' : 'border-white/5'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} />
                      <div>
                        <span className="text-xs font-extrabold text-white">{t('walletCredits')}</span>
                        <span className="block text-[10px] text-slate-555">Balance: ₹{walletBalance.toFixed(0)}</span>
                      </div>
                    </div>
                  </label>
                  <label className={`flex justify-between items-center p-3 rounded-2xl border cursor-pointer ${
                    paymentMethod === 'upi' ? 'border-pink-500 bg-pink-500/5' : 'border-white/5'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                      <div>
                        <span className="text-xs font-extrabold text-white">{t('upi')}</span>
                      </div>
                    </div>
                  </label>
                  <label className={`flex justify-between items-center p-3 rounded-2xl border cursor-pointer ${
                    paymentMethod === 'card' ? 'border-pink-500 bg-pink-500/5' : 'border-white/5'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                      <div>
                        <span className="text-xs font-extrabold text-white">{t('card')}</span>
                      </div>
                    </div>
                  </label>
                </div>
                <div className="border-t border-white/5 pt-4 flex gap-2">
                  <button type="button" onClick={() => setCheckoutStep('details')} className="flex-1 rounded-xl bg-slate-800 text-slate-355 py-2.5 text-xs font-bold hover:bg-slate-700">Back</button>
                  <button type="submit" className="flex-1 rounded-xl btn-pink-gradient py-2.5 text-xs uppercase font-black tracking-widest">Pay ₹{totalAmount.toFixed(0)}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Chat logs & translation toggle */}
      {activePartnerChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-premium max-w-sm w-full rounded-3xl p-5 shadow-2xl relative border border-white/10 flex flex-col h-[400px]">
            <button onClick={() => setActivePartnerChat(null)} className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"><X className="h-5 w-5" /></button>
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <img src={activePartnerChat.avatar} className="h-9 w-9 rounded-full object-cover border border-white/5" />
                <div>
                  <h3 className="text-xs font-extrabold text-white">{activePartnerChat.name}</h3>
                  <span className="text-[9px] text-pink-400 font-bold uppercase tracking-wider">Live Translation • {t(`categories.${activePartnerChat.category}`)} Pro</span>
                </div>
              </div>
              
              {/* Translation toggle button */}
              <button 
                onClick={() => setTranslateActive(!translateActive)}
                className={`p-1.5 rounded-xl border transition-all ${translateActive ? 'bg-pink-500/10 border-pink-500/20 text-pink-450' : 'bg-slate-950 border-white/5 text-slate-500'}`}
                title="Toggle Real-time Multilingual Translation"
              >
                <Languages className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 p-1 max-h-56">
              {chatLogs.map((chat, idx) => (
                <div key={idx} className={`flex flex-col ${chat.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-2.5 rounded-2xl text-[11px] max-w-[85%] ${chat.sender === 'user' ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white rounded-tr-none' : 'bg-slate-950 border border-white/5 text-slate-350 rounded-tl-none'}`}>
                    {chat.text}
                  </div>
                  {chat.translatedText && (
                    <span className="text-[8px] text-pink-400 font-bold tracking-wider mt-0.5 px-1 uppercase">
                      {chat.translatedText}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChatMessage} className="flex gap-1.5 mt-3 border-t border-white/5 pt-3">
              <input type="text" value={chatInputText} onChange={e => setChatInputText(e.target.value)} placeholder="Type Tamil/Hindi/English..." className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-pink-500 text-white" />
              <button type="submit" className="rounded-xl btn-pink-gradient px-4 py-2 text-xs font-bold uppercase shrink-0">Send</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
