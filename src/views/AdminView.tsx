import React, { useState, useEffect } from 'react';
import { useApp, Partner, FraudLog } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { 
  BarChart2, Users, FileText, Check, X, ShieldAlert,
  ArrowUpRight, Sliders, PlayCircle, ShieldCheck, Megaphone,
  BellRing, Coins, Percent, AlertOctagon, Activity, Eye, UserCheck,
  Brain, ShieldCheck as ShieldCheckIcon, AlertTriangle, ShieldX,
  Database, Search, ArrowUpDown, RefreshCw, Trash2, Ban
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest } from '../utils/api';

export const AdminView: React.FC = () => {
  const { 
    bookings, partners, setPartners, addNotification, fraudLogs, setFraudLogs
  } = useApp();

  const { t } = useTranslation();

  // Active Admin Tabs
  const [activeTab, setActiveTab] = useState<'verifications' | 'sheets' | 'operations' | 'coupons' | 'broadcast' | 'fraud'>('verifications');

  // Stats calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + b.price, 0);
  const commissionRate = 12.5; 
  const adminCommissions = (totalRevenue * commissionRate) / 100;
  
  // Dynamic Pricing surge variables
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.0);
  const [aiSurgeActive, setAiSurgeActive] = useState(true);

  // Coupon states
  const [coupons, setCoupons] = useState([
    { code: 'CAB55', discount: 15, active: true },
    { code: 'FREEVISIT', discount: 20, active: true }
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('15');

  // Broadcast Notification
  const [broadcastTitle, setBroadcastTitle] = useState('Dynamic Surge alert');
  const [broadcastText, setBroadcastText] = useState('Heavy passenger demands in Velachery have initiated a 1.4x pricing multiplier.');

  // Spreadsheet Data Grid states
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allPartners, setAllPartners] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [allPayments, setAllPayments] = useState<any[]>([]);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [allNotifications, setAllNotifications] = useState<any[]>([]);
  
  const [activeSheet, setActiveSheet] = useState<'users' | 'partners' | 'bookings' | 'payments' | 'reviews' | 'notifications'>('users');
  const [sheetSearch, setSheetSearch] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [loadingSheet, setLoadingSheet] = useState(false);

  const fetchSheetData = async () => {
    setLoadingSheet(true);
    try {
      if (activeSheet === 'users') {
        const data = await apiRequest('/admin/users');
        if (data) setAllUsers(data);
      } else if (activeSheet === 'partners') {
        const data = await apiRequest('/admin/partners');
        if (data) setAllPartners(data);
      } else if (activeSheet === 'bookings') {
        const data = await apiRequest('/admin/bookings');
        if (data) setAllBookings(data);
      } else if (activeSheet === 'payments') {
        const data = await apiRequest('/admin/payments');
        if (data) setAllPayments(data);
      } else if (activeSheet === 'reviews') {
        const data = await apiRequest('/admin/reviews');
        if (data) setAllReviews(data);
      } else if (activeSheet === 'notifications') {
        const data = await apiRequest('/admin/notifications');
        if (data) setAllNotifications(data);
      }
    } catch (err) {
      console.warn("Failed to load sheet data:", err);
    } finally {
      setLoadingSheet(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'sheets') {
      fetchSheetData();
    }
  }, [activeTab, activeSheet]);

  useEffect(() => {
    if (aiSurgeActive) {
      const activeBookingsCount = bookings.filter(b => b.status === 'pending' || b.status === 'accepted' || b.status === 'ongoing').length;
      const computedSurge = activeBookingsCount > 10 ? 1.8 : activeBookingsCount > 5 ? 1.4 : activeBookingsCount > 2 ? 1.2 : 1.0;
      setSurgeMultiplier(computedSurge);
    }
  }, [bookings, aiSurgeActive]);

  const handleToggleBlockUser = async (uId: string, currentBlocked: boolean) => {
    try {
      const nextBlocked = !currentBlocked;
      await apiRequest(`/admin/users/${uId}/block`, {
        method: 'PUT',
        body: JSON.stringify({ isBlocked: nextBlocked })
      });
      setAllUsers(prev => prev.map(u => (u._id === uId || u.id === uId) ? { ...u, isBlocked: nextBlocked, role: nextBlocked ? 'blocked' : 'customer' } : u));
      addNotification('User Status Updated 👤', `User block status updated.`, 'info');
    } catch (err) {
      console.warn("Failed to toggle block status:", err);
    }
  };

  const handleUpdatePartnerStatusSheet = async (pId: string, nextStatus: string) => {
    try {
      const endpoint = nextStatus === 'approved' 
        ? `/admin/partners/${pId}/approve` 
        : nextStatus === 'rejected'
          ? `/admin/partners/${pId}/reject`
          : `/admin/partners/${pId}/review`;
      await apiRequest(endpoint, { method: 'PUT' });
      setAllPartners(prev => prev.map(p => (p._id === pId || p.id === pId) ? { ...p, adminStatus: nextStatus } : p));
      setPartners(prev => prev.map(p => ((p as any)._id === pId || p.id === pId) ? { ...p, adminStatus: nextStatus as any } : p));
      addNotification('Partner Status Updated 💼', `Partner verification updated to ${nextStatus}.`, 'success');
    } catch (err) {
      console.warn("Failed to update partner verification:", err);
    }
  };

  const handleUpdateBookingStatusSheet = async (bId: string, nextStatus: string) => {
    try {
      await apiRequest(`/bookings/${bId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus })
      });
      setAllBookings(prev => prev.map(b => (b._id === bId || b.id === bId) ? { ...b, status: nextStatus } : b));
      addNotification('Booking Status Updated 📅', `Booking status updated to ${nextStatus}.`, 'info');
    } catch (err) {
      console.warn("Failed to update booking status:", err);
    }
  };

  const handleToggleFakeReview = async (reviewId: string, currentFake: boolean) => {
    try {
      setAllReviews(prev => prev.map(r => (r._id === reviewId || r.id === reviewId) ? { ...r, isFake: !currentFake } : r));
      addNotification('Review Security Alert 🛡️', `Review flagged status updated.`, 'warning');
    } catch (err) {
      console.warn("Failed to toggle fake review:", err);
    }
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const getFilteredAndSortedData = () => {
    let data: any[] = [];
    if (activeSheet === 'users') data = [...allUsers];
    else if (activeSheet === 'partners') data = [...allPartners];
    else if (activeSheet === 'bookings') data = [...allBookings];
    else if (activeSheet === 'payments') data = [...allPayments];
    else if (activeSheet === 'reviews') data = [...allReviews];
    else if (activeSheet === 'notifications') data = [...allNotifications];

    if (sheetSearch.trim()) {
      const q = sheetSearch.toLowerCase();
      data = data.filter(row => {
        return Object.entries(row).some(([key, val]) => {
          if (val === null || val === undefined) return false;
          if (typeof val === 'object') return JSON.stringify(val).toLowerCase().includes(q);
          return String(val).toLowerCase().includes(q);
        });
      });
    }

    if (sortKey) {
      data.sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];

        if (typeof valA === 'object' && valA !== null) valA = JSON.stringify(valA);
        if (typeof valB === 'object' && valB !== null) valB = JSON.stringify(valB);

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();

        if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
        if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  };

  // KYC Approval
  const handleApprove = (pId: string) => {
    apiRequest(`/admin/partners/${pId}/approve`, { method: 'PUT' }).catch(err => console.warn("Admin approval sync failed:", err));

    setPartners(prev =>
      prev.map(p => (p.id === pId || (p as any)._id === pId) ? { ...p, adminStatus: 'approved' } : p)
    );
    addNotification(
      'Partner Onboarded Successfully! ✅',
      `KYC documents approved for partner ${pId}. Profile is active in directories.`,
      'success'
    );
    confetti({
      particleCount: 100,
      spread: 60,
      colors: ['#00E5FF', '#6C63FF']
    });
  };

  // KYC Reject
  const handleReject = (pId: string) => {
    apiRequest(`/admin/partners/${pId}/reject`, { method: 'PUT' }).catch(err => console.warn("Admin rejection sync failed:", err));

    setPartners(prev =>
      prev.map(p => (p.id === pId || (p as any)._id === pId) ? { ...p, adminStatus: 'rejected' } : p)
    );
    addNotification('Partner KYC Rejected ❌', `Partner ${pId} application failed checks.`, 'warning');
  };

  // KYC Under Review
  const handleReview = (pId: string) => {
    apiRequest(`/admin/partners/${pId}/review`, { method: 'PUT' }).catch(err => console.warn("Admin review sync failed:", err));

    setPartners(prev =>
      prev.map(p => (p.id === pId || (p as any)._id === pId) ? { ...p, adminStatus: 'review' } : p)
    );
    addNotification('KYC Under Review ⏳', `Partner status updated to Under Review.`, 'info');
  };

  // Add Coupon
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    
    setCoupons(prev => [
      ...prev,
      { code: newCouponCode.toUpperCase(), discount: parseInt(newCouponDiscount) || 10, active: true }
    ]);
    setNewCouponCode('');
    addNotification('Promo Coupon Created 🎟', `Campaign code ${newCouponCode.toUpperCase()} is active.`, 'success');
  };

  // Send Broadcast
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim()) return;

    addNotification(`Broadcast: ${broadcastTitle} 📢`, broadcastText, 'warning');
    setBroadcastTitle('');
    setBroadcastText('');
  };

  const handleDismissFraudLog = (id: string) => {
    setFraudLogs(prev => prev.filter(l => l.id !== id));
    addNotification('Security Alert Dismissed 🛡️', `Alert ${id} cleared from logs.`, 'info');
  };

  const pendingPartners = partners.filter(p => p.adminStatus === 'pending' || p.adminStatus === 'review');

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-indigo-500/15 via-slate-900 to-[#0B1020] py-12 px-4 border-b border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-wider text-white">{t('adminMode')}</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Verification Queue & Settings</p>
        </div>
      </section>

      {/* Navigation tabs */}
      <div className="border-b border-white/5 bg-slate-900/60 sticky top-16 z-30">
        <div className="mx-auto max-w-7xl flex items-center space-x-1.5 p-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'verifications', label: t('kycQueue'), icon: '📝' },
            { id: 'sheets', label: 'Spreadsheet Grid', icon: '📊' },
            { id: 'operations', label: t('operationsLog'), icon: '📈' },
            { id: 'coupons', label: t('couponsCenter'), icon: '🎟' },
            { id: 'broadcast', label: t('emergencyAlerts'), icon: '📢' },
            { id: 'fraud', label: 'AI Fraud Desk', icon: '🤖' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-300 shrink-0 flex items-center gap-1 ${
                activeTab === tab.id
                  ? 'btn-cyan-gradient text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
        
        {/* Tab 1: KYC Queue */}
        {activeTab === 'verifications' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black uppercase text-cyan-400 tracking-wider">{t('kycQueue')}</h3>
                <p className="text-[10px] text-slate-550 font-bold">Audit government IDs, biometric selfie matches, and portfolios</p>
              </div>
              <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider bg-cyan-500/10 px-2.5 py-1 rounded-xl">
                {pendingPartners.length} Profiles Pending
              </span>
            </div>

            {pendingPartners.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-white/5">
                <span className="text-3xl">🎉</span>
                <h3 className="text-sm font-bold text-slate-400 mt-3">KYC audit queue is empty!</h3>
                <p className="text-[10px] text-slate-550 mt-1">New onboarded provider applications will register here in real-time.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {pendingPartners.map(partner => (
                  <div key={partner.id} className="rounded-3xl bg-slate-900 border border-white/5 p-5 shadow-lg flex flex-col justify-between hover:border-cyan-400/30 transition-all duration-300 animate-in fade-in">
                    <div>
                      <div className="flex gap-4">
                        <img src={partner.avatar} className="h-16 w-16 rounded-xl object-cover border border-white/10 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-black text-white">{partner.name}</h4>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">{partner.businessName}</span>
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-[9px] text-cyan-400 font-black uppercase">
                              {t(`categories.${partner.category}`, partner.category)}
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold">{partner.experience} Yrs Exp</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              partner.adminStatus === 'review'
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {partner.adminStatus === 'review' ? 'Under Review' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Documents metadata */}
                      <div className="mt-4 bg-slate-950/60 rounded-2xl p-4 border border-white/5 text-xs text-slate-400 space-y-2">
                        <div className="flex justify-between items-center">
                          <span>Aadhaar ID status:</span>
                          <span className="font-extrabold text-slate-200 bg-white/5 px-2 py-0.5 rounded text-[10px] border border-white/5 cursor-pointer">Aadhaar_Document.pdf</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>PAN ID status:</span>
                          <span className="font-extrabold text-slate-200 bg-white/5 px-2 py-0.5 rounded text-[10px] border border-white/5 cursor-pointer">PAN_Document.pdf</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Facial Liveness verification:</span>
                          <span className="font-black text-emerald-400 uppercase text-[10px]">98.4% Similarity PASS</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>UPI Account ID:</span>
                          <span className="font-extrabold text-slate-300">{partner.upiId || 'username@upi'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>pricing setup:</span>
                          <span className="font-black text-cyan-400">₹{partner.price} / Visit</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-6 flex gap-2 pt-4 border-t border-white/5">
                      <button
                        onClick={() => handleReject(partner.id)}
                        className="flex-1 rounded-xl border border-white/5 bg-slate-950 py-2.5 text-xs font-bold text-slate-400 hover:text-white flex items-center justify-center gap-1 transition-all"
                      >
                        <X className="h-4 w-4 text-red-500 shrink-0" />
                        <span>{t('reject')}</span>
                      </button>
                      {partner.adminStatus === 'pending' && (
                        <button
                          onClick={() => handleReview(partner.id)}
                          className="flex-1 rounded-xl border border-white/5 bg-slate-950 py-2.5 text-xs font-bold text-slate-400 hover:text-amber-400 flex items-center justify-center gap-1 transition-all"
                        >
                          <Sliders className="h-4 w-4 text-amber-500 shrink-0" />
                          <span>Review</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleApprove(partner.id)}
                        className="flex-1 rounded-xl btn-cyan-gradient py-2.5 text-xs uppercase font-black flex items-center justify-center gap-1"
                      >
                        <Check className="h-4 w-4 shrink-0" />
                        <span>Approve</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Spreadsheet Grid */}
        {activeTab === 'sheets' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-black uppercase text-cyan-400 tracking-wider">Spreadsheet Data Grid</h3>
                <p className="text-[10px] text-slate-400 font-bold">Search, sort, edit, and audit collections dynamically connected to MongoDB</p>
              </div>
              <button 
                onClick={fetchSheetData}
                className="self-start sm:self-auto rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-xs font-black uppercase text-slate-450 hover:text-white flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingSheet ? 'animate-spin' : ''}`} />
                <span>Refresh Grid</span>
              </button>
            </div>

            {/* Sheets Switcher Toolbar */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-900/50 p-2.5 rounded-2xl border border-white/5">
              {[
                { id: 'users', label: 'users', icon: '👤' },
                { id: 'partners', label: 'partners', icon: '💼' },
                { id: 'bookings', label: 'bookings', icon: '📅' },
                { id: 'payments', label: 'payments', icon: '💳' },
                { id: 'reviews', label: 'reviews', icon: '⭐' },
                { id: 'notifications', label: 'notifications', icon: '🔔' }
              ].map(sheet => (
                <button
                  key={sheet.id}
                  onClick={() => {
                    setActiveSheet(sheet.id as any);
                    setSortKey('');
                  }}
                  className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 border ${
                    activeSheet === sheet.id
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                      : 'bg-slate-950 border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                  }`}
                >
                  <span>{sheet.icon}</span>
                  <span>{sheet.label}</span>
                </button>
              ))}

              <div className="ml-auto w-full sm:w-64 relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search active sheet..."
                  value={sheetSearch}
                  onChange={e => setSheetSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-white/5 text-xs outline-none focus:border-cyan-500/40 text-slate-200"
                />
              </div>
            </div>

            {/* Google Sheets Table Grid */}
            <div className="rounded-2xl border border-white/10 overflow-hidden bg-slate-950/80 shadow-2xl">
              <div className="overflow-x-auto max-h-[500px]">
                <table className="min-w-full divide-y divide-white/10 border-collapse text-left text-xs">
                  <thead className="bg-[#151B35] sticky top-0 z-10">
                    <tr className="divide-x divide-white/5">
                      {activeSheet === 'users' && (
                        <>
                          <th onClick={() => handleSort('_id')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">ID <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('name')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Name <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('email')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Email <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('phone')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Phone <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('role')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Role <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('walletBalance')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Wallet <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th className="p-3 font-black uppercase text-slate-300 tracking-wider">Status/Actions</th>
                        </>
                      )}
                      {activeSheet === 'partners' && (
                        <>
                          <th onClick={() => handleSort('name')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Name <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('category')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Trade <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('businessName')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Shop/Business <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('price')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Price/Visit <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('experience')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Experience <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('isOnline')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Online <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('adminStatus')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Status <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th className="p-3 font-black uppercase text-slate-300 tracking-wider">Actions</th>
                        </>
                      )}
                      {activeSheet === 'bookings' && (
                        <>
                          <th onClick={() => handleSort('_id')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Booking ID <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('category')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Category <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('provider')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Provider <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('price')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Amount <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('status')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Status <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('date')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Date <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('paymentMethod')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Payment <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                        </>
                      )}
                      {activeSheet === 'payments' && (
                        <>
                          <th onClick={() => handleSort('_id')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Tx ID <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('userId')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">User ID <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('amount')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Amount <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('gateway')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Gateway <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('gatewayPaymentId')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Payment Ref <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('status')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Status <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('createdAt')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Timestamp <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                        </>
                      )}
                      {activeSheet === 'reviews' && (
                        <>
                          <th onClick={() => handleSort('_id')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Review ID <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('partnerId')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Partner ID <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('name')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Author <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('rating')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Stars <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th className="p-3 font-black uppercase text-slate-300 tracking-wider">Feedback Comment</th>
                          <th onClick={() => handleSort('isFake')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Spam/Fake <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th className="p-3 font-black uppercase text-slate-300 tracking-wider">Actions</th>
                        </>
                      )}
                      {activeSheet === 'notifications' && (
                        <>
                          <th onClick={() => handleSort('_id')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">ID <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('userId')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Target User ID <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th onClick={() => handleSort('title')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Title <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                          <th className="p-3 font-black uppercase text-slate-300 tracking-wider">Content Message</th>
                          <th onClick={() => handleSort('time')} className="p-3 font-black uppercase text-slate-300 tracking-wider cursor-pointer hover:bg-slate-800 transition-colors">Time <ArrowUpDown className="inline h-3 w-3 ml-0.5" /></th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loadingSheet ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-cyan-400 mb-2" />
                          <span>Loading active collection data from MongoDB...</span>
                        </td>
                      </tr>
                    ) : getFilteredAndSortedData().length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500 font-bold uppercase tracking-wider">
                          No matching records found.
                        </td>
                      </tr>
                    ) : (
                      getFilteredAndSortedData().map((row, index) => (
                        <tr 
                          key={row._id || row.id || index}
                          className={`divide-x divide-white/5 hover:bg-slate-900/60 transition-colors ${
                            index % 2 === 0 ? 'bg-slate-950/40' : 'bg-slate-900/20'
                          }`}
                        >
                          {activeSheet === 'users' && (
                            <>
                              <td className="p-3 font-mono text-[10px] text-slate-500">{row._id || row.id}</td>
                              <td className="p-3 font-bold text-white">{row.name}</td>
                              <td className="p-3 text-slate-300">{row.email}</td>
                              <td className="p-3 text-slate-350">{row.phone || 'N/A'}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                  row.role === 'admin' 
                                    ? 'bg-purple-500/10 text-purple-400' 
                                    : row.role === 'blocked' 
                                      ? 'bg-red-500/10 text-red-400' 
                                      : 'bg-cyan-500/10 text-cyan-400'
                                }`}>
                                  {row.role}
                                </span>
                              </td>
                              <td className="p-3 font-black text-emerald-400">₹{row.walletBalance}</td>
                              <td className="p-3">
                                {row.role !== 'admin' && (
                                  <button
                                    onClick={() => handleToggleBlockUser(row._id || row.id, row.role === 'blocked')}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border transition-all ${
                                      row.role === 'blocked'
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                                        : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white'
                                    }`}
                                  >
                                    {row.role === 'blocked' ? 'Unblock' : 'Block'}
                                  </button>
                                )}
                              </td>
                            </>
                          )}
                          {activeSheet === 'partners' && (
                            <>
                              <td className="p-3 font-bold text-white flex items-center gap-2">
                                <img src={row.avatar} className="h-6 w-6 rounded-full object-cover border border-white/10" />
                                <span>{row.name}</span>
                              </td>
                              <td className="p-3 text-slate-300">{row.category}</td>
                              <td className="p-3 text-slate-300">{row.businessName}</td>
                              <td className="p-3 font-bold text-cyan-400">₹{row.price}</td>
                              <td className="p-3 text-slate-400">{row.experience} Yrs</td>
                              <td className="p-3">
                                <span className={`h-2 w-2 rounded-full inline-block mr-1.5 ${row.isOnline ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                                <span className="text-[10px] uppercase font-bold text-slate-450">{row.isOnline ? 'Online' : 'Offline'}</span>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                  row.adminStatus === 'approved'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : row.adminStatus === 'review'
                                      ? 'bg-indigo-500/10 text-indigo-400'
                                      : row.adminStatus === 'rejected'
                                        ? 'bg-red-500/10 text-red-400'
                                        : 'bg-amber-500/10 text-amber-400'
                                }`}>
                                  {row.adminStatus}
                                </span>
                              </td>
                              <td className="p-3">
                                <select
                                  value={row.adminStatus}
                                  onChange={e => handleUpdatePartnerStatusSheet(row._id || row.id, e.target.value)}
                                  className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-[10px] outline-none text-slate-300 cursor-pointer focus:border-cyan-400"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="review">Review</option>
                                  <option value="approved">Approved</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                              </td>
                            </>
                          )}
                          {activeSheet === 'bookings' && (
                            <>
                              <td className="p-3 font-mono text-[10px] text-slate-500">{row._id || row.id}</td>
                              <td className="p-3 text-slate-300 font-bold">{row.category}</td>
                              <td className="p-3 text-white font-bold">{row.provider?.name || 'Assigned'}</td>
                              <td className="p-3 font-bold text-cyan-400">₹{row.price}</td>
                              <td className="p-3">
                                <select
                                  value={row.status}
                                  onChange={e => handleUpdateBookingStatusSheet(row._id || row.id, e.target.value)}
                                  className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-[10px] outline-none text-slate-300 cursor-pointer focus:border-cyan-400"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="accepted">Accepted</option>
                                  <option value="ontheway">On The Way</option>
                                  <option value="started">Started</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="p-3 text-slate-400">{row.date}</td>
                              <td className="p-3 uppercase text-slate-500">{row.paymentMethod}</td>
                            </>
                          )}
                          {activeSheet === 'payments' && (
                            <>
                              <td className="p-3 font-mono text-[10px] text-slate-500">{row._id || row.id}</td>
                              <td className="p-3 font-mono text-[10px] text-slate-400">{row.userId}</td>
                              <td className="p-3 font-black text-emerald-400">₹{row.amount}</td>
                              <td className="p-3 uppercase text-slate-300 font-bold">{row.gateway}</td>
                              <td className="p-3 font-mono text-[10px] text-slate-350">{row.gatewayPaymentId || 'N/A'}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                  row.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                }`}>
                                  {row.status}
                                </span>
                              </td>
                              <td className="p-3 text-slate-400">{new Date(row.createdAt).toLocaleString()}</td>
                            </>
                          )}
                          {activeSheet === 'reviews' && (
                            <>
                              <td className="p-3 font-mono text-[10px] text-slate-500">{row._id || row.id}</td>
                              <td className="p-3 font-mono text-[10px] text-slate-400">{row.partnerId}</td>
                              <td className="p-3 font-bold text-white">{row.name}</td>
                              <td className="p-3 text-amber-400 font-bold">★ {row.rating}</td>
                              <td className="p-3 text-slate-300 italic max-w-xs truncate" title={row.comment}>{row.comment}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                  row.isFake ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400'
                                }`}>
                                  {row.isFake ? 'Spam Detected' : 'Verified Review'}
                                </span>
                              </td>
                              <td className="p-3">
                                <button
                                  onClick={() => handleToggleFakeReview(row._id || row.id, row.isFake)}
                                  className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                                    row.isFake
                                      ? 'bg-emerald-500/10 text-emerald-405 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
                                      : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white'
                                  }`}
                                >
                                  {row.isFake ? 'Verify' : 'Spam'}
                                </button>
                              </td>
                            </>
                          )}
                          {activeSheet === 'notifications' && (
                            <>
                              <td className="p-3 font-mono text-[10px] text-slate-500">{row._id || row.id}</td>
                              <td className="p-3 font-mono text-[10px] text-slate-400">{row.userId || 'Global broadcast'}</td>
                              <td className="p-3 font-bold text-white">{row.title}</td>
                              <td className="p-3 text-slate-300 max-w-sm truncate" title={row.message}>{row.message}</td>
                              <td className="p-3 text-slate-500">{row.time || 'N/A'}</td>
                            </>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Operations Log */}
        {activeTab === 'operations' && (
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase text-cyan-400 tracking-wider">System Operations & Statistics</h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-3xl bg-slate-900 border border-white/5 p-5 shadow-sm">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{t('grossMerchandise')}</span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">₹{totalRevenue}</h3>
                <span className="text-[9px] text-cyan-400 font-bold block mt-2">Live database aggregates</span>
              </div>

              <div className="rounded-3xl bg-slate-900 border border-white/5 p-5 shadow-sm">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{t('totalBookings')}</span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {bookings.filter(b => b.status === 'completed').length} Completed
                </h3>
                <span className="text-[9px] text-cyan-400 font-bold block mt-2">Active live dispatch runs</span>
              </div>

              <div className="rounded-3xl bg-slate-900 border border-white/5 p-5 shadow-sm">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{t('commissionsCollected')}</span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">₹{adminCommissions.toFixed(0)}</h3>
                <span className="text-[9px] text-slate-500 block mt-2">Calculating 12.5% platform cuts</span>
              </div>

              <div className="rounded-3xl bg-slate-900 border border-white/5 p-5 shadow-sm">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{t('activeOnlinePros')}</span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {partners.filter(p => p.isOnline).length} / {partners.length}
                </h3>
                <span className="text-[9px] text-emerald-400 font-bold block mt-2">● Systems operational</span>
              </div>
            </div>

            {/* AI dynamic pricing widget */}
            <div className="rounded-3xl bg-slate-900 border border-white/5 p-6 shadow-sm max-w-xl space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider">{t('dynamicSurge')}</h4>
                <button 
                  onClick={() => {
                    setAiSurgeActive(!aiSurgeActive);
                    addNotification('AI Surge Changed 🤖', `Dynamic pricing mode is now ${!aiSurgeActive ? 'Enabled' : 'Disabled'}.`, 'info');
                  }}
                  className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border ${
                    aiSurgeActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-950 border-white/5 text-slate-500'
                  }`}
                >
                  {aiSurgeActive ? 'AI Controlled' : 'Manual Override'}
                </button>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">Surge multipliers automatically adjust pricing rates based on booking volume.</p>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5 text-slate-300">
                  <span>Current Surge Multiplier</span>
                  <span className="text-cyan-400">{surgeMultiplier}x</span>
                </div>
                <input 
                  type="range" 
                  min="1.0" 
                  max="3.0" 
                  step="0.1" 
                  value={surgeMultiplier}
                  onChange={e => setSurgeMultiplier(parseFloat(e.target.value))}
                  disabled={aiSurgeActive}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Coupons */}
        {activeTab === 'coupons' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xs font-black uppercase text-cyan-400 tracking-wider">{t('couponManager')}</h3>
            <div className="rounded-3xl bg-slate-900 border border-white/5 p-6 shadow-sm max-w-xl">
              <form onSubmit={handleAddCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="New Coupon Code (e.g. PINK99)"
                  value={newCouponCode}
                  onChange={e => setNewCouponCode(e.target.value)}
                  className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Discount %"
                  value={newCouponDiscount}
                  onChange={e => setNewCouponDiscount(e.target.value)}
                  className="w-24 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
                  required
                />
                <button type="submit" className="rounded-xl btn-cyan-gradient px-4 py-2 text-xs font-bold uppercase shrink-0">
                  {t('addCoupon')}
                </button>
              </form>

              <div className="mt-6 divide-y divide-white/5">
                {coupons.map((c, index) => (
                  <div key={index} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono font-black text-white bg-slate-950 px-2 py-0.5 rounded mr-2">{c.code}</span>
                      <span className="text-slate-455 font-semibold">{c.discount}% Booking Discount</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Emergency Broadcast */}
        {activeTab === 'broadcast' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xs font-black uppercase text-cyan-400 tracking-wider">{t('emergencyAlerts')}</h3>
            <div className="rounded-3xl bg-slate-900 border border-white/5 p-6 shadow-sm max-w-xl">
              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Notification Title</label>
                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={e => setBroadcastTitle(e.target.value)}
                    placeholder="Alert Title"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Notification Message</label>
                  <textarea
                    value={broadcastText}
                    onChange={e => setBroadcastText(e.target.value)}
                    placeholder="Broadcasting text details to users navbar..."
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white h-24 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl btn-cyan-gradient py-2.5 text-xs uppercase font-black tracking-widest flex items-center justify-center gap-1.5"
                >
                  <BellRing className="h-4 w-4 shrink-0" />
                  <span>{t('transmitAlert')}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 5: AI Fraud Detection */}
        {activeTab === 'fraud' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black uppercase text-cyan-400 tracking-wider">AI Security & Fraud Desk</h3>
                <p className="text-[10px] text-slate-550 font-bold">Biometrics audit, suspicious stripe payments, velocity check controls</p>
              </div>
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider animate-pulse">
                <ShieldAlert className="h-4 w-4" />
                <span>Security Engine active</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {fraudLogs.map(log => (
                <div 
                  key={log.id} 
                  className="rounded-3xl bg-slate-900 border border-red-550/30 p-5 shadow-lg flex flex-col justify-between"
                  style={{ borderColor: 'rgba(239, 68, 68, 0.15)' }}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-red-450 uppercase bg-red-500/10 px-2 py-0.5 rounded tracking-widest">{log.type}</span>
                      <span className="text-[9px] text-slate-500">{log.time}</span>
                    </div>
                    <h4 className="text-xs font-black text-white">Target: {log.target}</h4>
                    <p className="text-[10px] text-slate-450 leading-relaxed">{log.reason}</p>
                    <div className="flex justify-between text-[9px] text-slate-500 pt-1.5 border-t border-white/5">
                      <span>Risk Index: <span className="text-red-400 font-bold">{log.riskScore}%</span></span>
                      <span>Action: <span className="font-extrabold uppercase text-red-400">{log.status}</span></span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDismissFraudLog(log.id)}
                    className="w-full mt-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400 border border-white/5 transition-colors"
                  >
                    Clear Log
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
