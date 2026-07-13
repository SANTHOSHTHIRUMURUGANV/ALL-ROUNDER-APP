import React, { useState } from 'react';
import { useApp, Partner, CartItem } from '../context/AppContext';
import { translations } from '../utils/translations';
import { 
  Search, Star, MapPin, Tag, ShoppingBag, 
  Trash2, CreditCard, X, Navigation, Compass,
  SlidersHorizontal, ArrowUpDown, ShieldCheck, Phone, 
  MessageSquare, ExternalLink, Calendar, Clock, Sparkles, AlertOctagon, HelpCircle
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

export const CustomerView: React.FC = () => {
  const {
    language, cart, addToCart, removeFromCart, updateCartQuantity,
    clearCart, walletBalance, deductWalletMoney, addBooking, bookings,
    activeTrackingId, setActiveTrackingId, partners, searchQuery, setSearchQuery,
    addNotification, updateBookingStatus, locationCoords
  } = useApp();

  const t = translations[language];

  // UI Flow States
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  
  // Searching, sorting & filtering states
  const [partnerSearch, setPartnerSearch] = useState('');
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);
  const [filterEmergencyOnly, setFilterEmergencyOnly] = useState(false);
  const [filterDoorstepOnly, setFilterDoorstepOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'experience' | 'completedJobs' | 'availability' | 'responseTime'>('rating');

  // Partner Detail Modal
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [partnerReviewsOpen, setPartnerReviewsOpen] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

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
  const [chatLogs, setChatLogs] = useState<{ sender: 'user' | 'partner', text: string }[]>([]);

  // Filter categories
  const groups = ['All', 'Core', 'Handyman', 'Health', 'Travel', 'Lifestyle', 'Entertainment', 'Professional'];
  const filteredCategories = CATEGORIES_DATA.filter(cat => {
    const matchesGroup = selectedGroup === 'All' || cat.group === selectedGroup;
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

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
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'distance') {
        const distA = parseFloat(a.distance) || 99;
        const distB = parseFloat(b.distance) || 99;
        return distA - distB;
      }
      if (sortBy === 'experience') {
        const expA = parseInt(a.experience) || 0;
        const expB = parseInt(b.experience) || 0;
        return expB - expA;
      }
      if (sortBy === 'completedJobs') return b.completedJobs - a.completedJobs;
      if (sortBy === 'availability') {
        if (a.isOnline === b.isOnline) return 0;
        return a.isOnline ? -1 : 1;
      }
      if (sortBy === 'responseTime') return a.responseTime - b.responseTime;
      return 0;
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
      name: `${partner.category} Visit - ${partner.businessName}`,
      price: partner.price,
      quantity: 1,
      category: partner.category,
      image: partner.name 
    });
    setSelectedPartner(null);
    setIsCartOpen(true);
  };

  // Chat submit mock
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;

    setChatLogs(prev => [...prev, { sender: 'user', text: chatInputText }]);
    setChatInputText('');

    setTimeout(() => {
      const replies = [
        "I am looking at your booking details.",
        "Sure, I will reach in 10 minutes.",
        "Could you please share your block number?"
      ];
      setChatLogs(prev => [...prev, { sender: 'partner', text: replies[Math.floor(Math.random() * replies.length)] }]);
    }, 1500);
  };

  const handleOpenChat = (p: Partner) => {
    setActivePartnerChat(p);
    setChatLogs([{ sender: 'partner', text: `Hello! I am your ${p.category} provider ${p.name}. How can I help you today?` }]);
  };

  return (
    <div className="relative min-h-screen bg-[#0F172A] text-slate-100 pb-16">
      
      {/* 1. Landing Hero (Flipkart Apple Premium Style) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#1E293B]/70 to-[#0F172A] py-16 px-4 text-center border-b border-white/5">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#EC4899_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
        
        <div className="relative mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 px-3 py-1 text-xs font-bold text-pink-400 border border-pink-500/20">
            🤖 AI-Powered Recommendation Engine Enabled
          </span>
          <h1 className="mt-4 text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">
            Everything. <span className="bg-gradient-to-r from-pink-500 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent">On-Demand.</span>
          </h1>
          <p className="mt-4 text-xs sm:text-base text-slate-400 font-semibold uppercase tracking-wider">
            Verified Local Partners Onboarded Live
          </p>

          {/* Search everything bar */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="flex items-center rounded-2xl bg-slate-900 border border-white/5 p-2 shadow-2xl focus-within:border-pink-500/50 transition-all">
              <Search className="h-5 w-5 text-slate-500 ml-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search painter, carpenter, plumber, driver..."
                className="w-full bg-transparent px-3 py-2 text-xs text-white outline-none"
              />
              <button 
                onClick={() => setSearchQuery('')}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-wider"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main page content container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
        
        {/* 2. Map route animation display if active booking is ongoing */}
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
                  <h2 className="text-lg font-black text-white uppercase tracking-wider">A2Z Categories</h2>
                  <p className="text-[10px] text-slate-500">Select any category to browse verified local providers</p>
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
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Popular offers banner */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-white uppercase tracking-wider">Promotional Campaigns</h2>
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
          // Category Specific Listing with recommendation sorting logic
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setActiveCategoryFilter(null)}
                  className="p-2 rounded-xl bg-slate-900 border border-white/5 hover:border-pink-500/40 text-slate-300"
                >
                  ← Back
                </button>
                <div>
                  <span className="text-[10px] font-black uppercase text-pink-400 tracking-wider">Services Directory</span>
                  <h2 className="text-2xl font-black text-white uppercase">{activeCategoryFilter} Providers</h2>
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
                    className={`font-bold uppercase text-[9px] tracking-wider ${filterAvailableOnly ? 'text-pink-400' : 'text-slate-550'}`}
                  >
                    Online
                  </button>
                  <span className="text-white/10">|</span>
                  <button 
                    onClick={() => setFilterEmergencyOnly(!filterEmergencyOnly)}
                    className={`font-bold uppercase text-[9px] tracking-wider ${filterEmergencyOnly ? 'text-pink-400' : 'text-slate-550'}`}
                  >
                    Emergency
                  </button>
                  <span className="text-white/10">|</span>
                  <button 
                    onClick={() => setFilterDoorstepOnly(!filterDoorstepOnly)}
                    className={`font-bold uppercase text-[9px] tracking-wider ${filterDoorstepOnly ? 'text-pink-400' : 'text-slate-550'}`}
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
                    <option value="experience" className="bg-slate-950">Most Experience 💼</option>
                    <option value="completedJobs" className="bg-slate-950">Most Completed Jobs 🔧</option>
                    <option value="availability" className="bg-slate-950">Availability Status ⏱️</option>
                    <option value="responseTime" className="bg-slate-950">Fast Response Time ⚡</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Providers Grid */}
            {categoryPartners.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-white/5">
                <span className="text-3xl">📭</span>
                <h3 className="text-sm font-bold text-slate-400 mt-3">No verified partners match criteria</h3>
                <p className="text-[10px] text-slate-550 mt-1">Try resetting search filters or register a painter in Partner App.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryPartners.map(partner => (
                  <div 
                    key={partner.id}
                    className="rounded-3xl bg-slate-900 border border-white/5 p-5 flex flex-col justify-between shadow-lg hover:border-pink-500/40 hover:shadow-2xl transition-all duration-300 group"
                  >
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
                            <span className="text-pink-400 flex items-center shrink-0" title="Aadhaar Verified Professional">
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
                        <div>💼 Exp: <span className="text-white font-bold">{partner.experience} Yrs</span></div>
                        <div>🔧 Jobs: <span className="text-white font-bold">{partner.completedJobs} Tasks</span></div>
                        <div>🗣️ Lang: <span className="text-white font-bold truncate max-w-[80px] inline-block">{partner.languages.join(', ')}</span></div>
                        <div>📍 GPS Dist: <span className="text-white font-bold">{partner.distance}</span></div>
                        <div>⚡ Resp Time: <span className="text-pink-400 font-bold">{partner.responseTime} mins</span></div>
                        <div>🛡️ Doorstep: <span className="text-white font-bold">{partner.doorstepService ? 'Yes' : 'No'}</span></div>
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
                            {partner.isOnline ? 'Available' : 'Holiday Mode'}
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
                        Book Now
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </section>
        )}

      </div>

      {/* 4. Single Partner Detail Profile Modal (Flipkart/Apple Style) */}
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
                  <span className="text-pink-400" title="Aadhaar KYC Verified Professional">
                    <ShieldCheck className="h-5 w-5 fill-pink-500/10 text-pink-500" />
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">{selectedPartner.businessName}</span>
                <span className="inline-block mt-2 px-2.5 py-1 rounded bg-slate-800 text-[10px] text-pink-400 font-black uppercase tracking-wider">
                  {selectedPartner.category}
                </span>
              </div>
            </div>

            {/* Profile body */}
            <div className="space-y-5">
              
              {/* Detailed Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-950/60 p-4 rounded-2xl border border-white/5">
                <div>
                  <span className="text-[9px] text-slate-500 font-black uppercase block">Experience</span>
                  <span className="font-extrabold text-white">{selectedPartner.experience} Years</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-black uppercase block">Completed Jobs</span>
                  <span className="font-extrabold text-white">{selectedPartner.completedJobs} Tasks</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-black uppercase block">Rating Score</span>
                  <span className="font-extrabold text-white flex items-center gap-1">⭐ {selectedPartner.rating}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-black uppercase block">Working Hours</span>
                  <span className="font-extrabold text-white">{selectedPartner.workingTime}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-black uppercase block">languages</span>
                  <span className="font-extrabold text-white truncate block">{selectedPartner.languages.join(', ')}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-black uppercase block">Response Speed</span>
                  <span className="font-extrabold text-pink-450">{selectedPartner.responseTime} mins avg</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-black uppercase block">Emergency SOS</span>
                  <span className="font-extrabold text-white">{selectedPartner.emergencyService ? 'Yes (24/7)' : 'No'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-black uppercase block">Doorstep Delivery</span>
                  <span className="font-extrabold text-white">{selectedPartner.doorstepService ? 'Supported' : 'No'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-black uppercase block">service radius</span>
                  <span className="font-extrabold text-white">{selectedPartner.serviceRadius} km</span>
                </div>
              </div>

              {/* Awards/Certificates list */}
              {selectedPartner.awards.length > 0 && (
                <div className="p-3 bg-pink-500/5 border border-pink-500/10 rounded-2xl">
                  <h4 className="text-[10px] font-black uppercase text-pink-400 tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Awards & Certifications</span>
                  </h4>
                  <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                    {selectedPartner.awards.map((aw, idx) => (
                      <li key={idx}>{aw}</li>
                    ))}
                  </ul>
                </div>
              )}

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
                  className="flex-1 rounded-xl bg-slate-900 border border-white/5 py-2.5 text-xs font-black uppercase text-slate-350 hover:text-white flex items-center justify-center gap-1.5"
                >
                  <Phone className="h-4 w-4 text-emerald-400" />
                  <span>Call Pro</span>
                </a>
                <button 
                  onClick={() => {
                    setSelectedPartner(null);
                    handleOpenChat(selectedPartner);
                  }}
                  className="flex-1 rounded-xl bg-slate-900 border border-white/5 py-2.5 text-xs font-black uppercase text-slate-350 hover:text-white flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="h-4 w-4 text-pink-400" />
                  <span>AI Chat</span>
                </button>
                <button 
                  onClick={() => setShowDirections(!showDirections)}
                  className="flex-1 rounded-xl bg-slate-900 border border-white/5 py-2.5 text-xs font-black uppercase text-slate-350 hover:text-white flex items-center justify-center gap-1.5"
                >
                  <Navigation className="h-4 w-4 text-blue-400" />
                  <span>GPS Map</span>
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
                  className="w-full flex justify-between items-center text-xs font-bold text-slate-350 hover:text-pink-400"
                >
                  <span>Customer reviews ({selectedPartner.reviews.length})</span>
                  <span>{partnerReviewsOpen ? '▼' : '►'}</span>
                </button>
                {partnerReviewsOpen && (
                  <div className="mt-3 space-y-3 max-h-40 overflow-y-auto pr-2 divide-y divide-white/5">
                    {selectedPartner.reviews.length === 0 ? (
                      <p className="text-[10px] text-slate-500 py-2">No reviews yet for this partner</p>
                    ) : (
                      selectedPartner.reviews.map((rev, idx) => (
                        <div key={idx} className="pt-2 text-xs">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-slate-300">{rev.name}</span>
                            <span className="text-amber-400">★ {rev.rating}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 italic">"{rev.comment}"</p>
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
                Book Diagnostic Service (₹{selectedPartner.price})
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
                className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-sm font-black uppercase text-pink-400 tracking-wider flex items-center gap-2 mb-6">
                <ShoppingBag className="h-5 w-5" />
                <span>Your Order Checklist</span>
              </h3>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 divide-y divide-white/5">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-slate-550 text-xs">Cart is empty</div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="py-3 flex justify-between items-center gap-3">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-pink-400">{item.category}</span>
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
                  <span>Convenience Delivery</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm font-black mt-2 text-white border-t border-white/5 pt-2">
                  <span>Total Amount</span>
                  <span className="text-pink-400">₹{totalAmount}</span>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="mt-4 w-full rounded-xl btn-pink-gradient py-3 text-xs uppercase font-black tracking-widest flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Secure Pay Checkout</span>
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
              <h3 className="text-xs font-black tracking-widest uppercase text-white">AllRounder Pay Platform</h3>
            </div>

            {checkoutStep === 'details' ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-950 p-4 border border-white/5">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Invoice Summary</h4>
                  <div className="space-y-1.5 text-xs text-slate-350">
                    <div className="flex justify-between">
                      <span>Total Items</span>
                      <span>{cart.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-pink-400 font-bold">
                        <span>Discount Applied</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>GPS Delivery Charges</span>
                      <span>₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black border-t border-white/5 pt-1.5 text-white">
                      <span>Grand Total</span>
                      <span>₹{totalAmount}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="Promo Code (e.g. CAB50)"
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
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-450">Select Checkout Gateway</label>
                  <label className={`flex justify-between items-center p-3 rounded-2xl border cursor-pointer ${
                    paymentMethod === 'wallet' ? 'border-pink-500 bg-pink-500/5' : 'border-white/5'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} />
                      <div>
                        <span className="text-xs font-extrabold text-white">AllRounder Wallet Credits</span>
                        <span className="block text-[10px] text-slate-500">Balance: ₹{walletBalance.toFixed(0)}</span>
                      </div>
                    </div>
                  </label>
                  <label className={`flex justify-between items-center p-3 rounded-2xl border cursor-pointer ${
                    paymentMethod === 'upi' ? 'border-pink-500 bg-pink-500/5' : 'border-white/5'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                      <div>
                        <span className="text-xs font-extrabold text-white">UPI (Google Pay / PhonePe)</span>
                      </div>
                    </div>
                  </label>
                  <label className={`flex justify-between items-center p-3 rounded-2xl border cursor-pointer ${
                    paymentMethod === 'card' ? 'border-pink-500 bg-pink-500/5' : 'border-white/5'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                      <div>
                        <span className="text-xs font-extrabold text-white">Credit Card (Stripe Checkout)</span>
                      </div>
                    </div>
                  </label>
                </div>
                <div className="border-t border-white/5 pt-4 flex gap-2">
                  <button type="button" onClick={() => setCheckoutStep('details')} className="flex-1 rounded-xl bg-slate-800 text-slate-350 py-2.5 text-xs font-bold hover:bg-slate-700">Back</button>
                  <button type="submit" className="flex-1 rounded-xl btn-pink-gradient py-2.5 text-xs uppercase font-black tracking-widest">Pay ₹{totalAmount.toFixed(0)}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Chat logs */}
      {activePartnerChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-premium max-w-sm w-full rounded-3xl p-5 shadow-2xl relative border border-white/10 flex flex-col h-96">
            <button onClick={() => setActivePartnerChat(null)} className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"><X className="h-5 w-5" /></button>
            <div className="flex items-center gap-3 border-b border-white/5 pb-3 mb-3">
              <img src={activePartnerChat.avatar} className="h-9 w-9 rounded-full object-cover border border-white/5" />
              <div>
                <h3 className="text-xs font-extrabold text-white">{activePartnerChat.name}</h3>
                <span className="text-[9px] text-pink-400 font-bold uppercase tracking-wider">Live Chat • {activePartnerChat.category} Pro</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 p-1 max-h-56">
              {chatLogs.map((chat, idx) => (
                <div key={idx} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2.5 rounded-2xl text-[11px] max-w-[85%] ${chat.sender === 'user' ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white rounded-tr-none' : 'bg-slate-950 border border-white/5 text-slate-300 rounded-tl-none'}`}>{chat.text}</div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendChatMessage} className="flex gap-1.5 mt-3 border-t border-white/5 pt-3">
              <input type="text" value={chatInputText} onChange={e => setChatInputText(e.target.value)} placeholder="Type your message..." className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-pink-500 text-white" />
              <button type="submit" className="rounded-xl btn-pink-gradient px-4 py-2 text-xs font-bold uppercase shrink-0">Send</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
