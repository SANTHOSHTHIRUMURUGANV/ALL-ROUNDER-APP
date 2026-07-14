import React, { useState } from 'react';
import { useApp, Partner } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { 
  BarChart2, Users, FileText, Check, X, ShieldAlert,
  ArrowUpRight, Sliders, PlayCircle, ShieldCheck, Megaphone,
  BellRing, Coins, Percent, AlertOctagon, Activity, Eye, UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminView: React.FC = () => {
  const { 
    bookings, partners, setPartners, addNotification 
  } = useApp();

  const { t } = useTranslation();

  // Active Admin Tabs
  const [activeTab, setActiveTab] = useState<'verifications' | 'operations' | 'coupons' | 'broadcast'>('verifications');

  // Stats calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + b.price, 0);
  const commissionRate = 12.5; 
  const adminCommissions = (totalRevenue * commissionRate) / 100;
  
  // Dynamic Pricing surge variables
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.4);
  const [aiSurgeActive, setAiSurgeActive] = useState(true);

  // Coupon states
  const [coupons, setCoupons] = useState([
    { code: 'CAB50', discount: 15, active: true },
    { code: 'FREEVISIT', discount: 20, active: true }
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('15');

  // Broadcast Notification
  const [broadcastTitle, setBroadcastTitle] = useState('Dynamic Surge alert');
  const [broadcastText, setBroadcastText] = useState('Heavy passenger demands in Velachery have initiated a 1.4x pricing multiplier.');

  // KYC Approval
  const handleApprove = (pId: string) => {
    setPartners(prev =>
      prev.map(p => (p.id === pId ? { ...p, adminStatus: 'approved' } : p))
    );
    addNotification(
      'Partner Onboarded Successfully! ✅',
      `KYC documents approved for partner ${pId}. Profile is active in directories.`,
      'success'
    );
    confetti({
      particleCount: 100,
      spread: 60,
      colors: ['#EC4899', '#3B82F6']
    });
  };

  // KYC Reject
  const handleReject = (pId: string) => {
    setPartners(prev =>
      prev.map(p => (p.id === pId ? { ...p, adminStatus: 'rejected' } : p))
    );
    addNotification('Partner KYC Rejected ❌', `Partner ${pId} application failed checks.`, 'warning');
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

  // List pending partners
  const pendingPartners = partners.filter(p => p.adminStatus === 'pending');

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-accent/15 via-slate-900 to-[#0F172A] py-12 px-4 border-b border-white/5">
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
        <div className="mx-auto max-w-7xl flex items-center space-x-1.5 p-3">
          {[
            { id: 'verifications', label: t('kycQueue'), icon: '📝' },
            { id: 'operations', label: t('operationsLog'), icon: '📊' },
            { id: 'coupons', label: t('couponsCenter'), icon: '🎟' },
            { id: 'broadcast', label: t('emergencyAlerts'), icon: '📢' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === tab.id
                  ? 'btn-pink-gradient text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span> <span className="ml-1 hidden sm:inline">{tab.label}</span>
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
                <h3 className="text-sm font-black uppercase text-pink-400 tracking-wider">{t('kycQueue')}</h3>
                <p className="text-[10px] text-slate-550 font-bold">Audit government IDs, biometric selfie matches, and portfolios</p>
              </div>
              <span className="text-[10px] font-black uppercase text-pink-450 tracking-wider bg-pink-500/10 px-2.5 py-1 rounded-xl">
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
                  <div key={partner.id} className="rounded-3xl bg-slate-900 border border-white/5 p-5 shadow-lg flex flex-col justify-between hover:border-pink-500/30 transition-all duration-300 animate-in fade-in">
                    <div>
                      <div className="flex gap-4">
                        <img src={partner.avatar} className="h-16 w-16 rounded-xl object-cover border border-white/10 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-black text-white">{partner.name}</h4>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">{partner.businessName}</span>
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-[9px] text-pink-400 font-black uppercase">
                              {t(`categories.${partner.category}`, partner.category)}
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold">{partner.experience} Yrs Exp</span>
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
                          <span className="font-black text-pink-400">₹{partner.price} / Visit</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-6 flex gap-2 pt-4 border-t border-white/5">
                      <button
                        onClick={() => handleReject(partner.id)}
                        className="flex-1 rounded-xl border border-white/5 bg-slate-950 py-2.5 text-xs font-bold text-slate-400 hover:text-white flex items-center justify-center gap-1 transition-all"
                      >
                        <X className="h-4 w-4 text-pink-500 shrink-0" />
                        <span>{t('reject')}</span>
                      </button>
                      <button
                        onClick={() => handleApprove(partner.id)}
                        className="flex-1 rounded-xl btn-pink-gradient py-2.5 text-xs uppercase font-black flex items-center justify-center gap-1"
                      >
                        <Check className="h-4 w-4 shrink-0" />
                        <span>{t('verifyApprove')}</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Operations Log */}
        {activeTab === 'operations' && (
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase text-pink-400 tracking-wider">System Operations & Statistics</h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-3xl bg-slate-900 border border-white/5 p-5 shadow-sm">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{t('grossMerchandise')}</span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">₹{totalRevenue + 12500}</h3>
                <span className="text-[9px] text-emerald-400 font-bold block mt-2">▲ 14.5% versus last week</span>
              </div>

              <div className="rounded-3xl bg-slate-900 border border-white/5 p-5 shadow-sm">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{t('totalBookings')}</span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">{bookings.length + 42} Completed</h3>
                <span className="text-[9px] text-pink-400 font-bold block mt-2">Active live dispatch runs</span>
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
                <span className="text-[9px] text-emerald-455 font-bold block mt-2">● Systems operational</span>
              </div>
            </div>

            {/* AI dynamic pricing widget */}
            <div className="rounded-3xl bg-slate-900 border border-white/5 p-6 shadow-sm max-w-xl space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase text-pink-400 tracking-wider">{t('dynamicSurge')}</h4>
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
                  <span className="text-pink-400">{surgeMultiplier}x</span>
                </div>
                <input 
                  type="range" 
                  min="1.0" 
                  max="3.0" 
                  step="0.1" 
                  value={surgeMultiplier}
                  onChange={e => setSurgeMultiplier(parseFloat(e.target.value))}
                  disabled={aiSurgeActive}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Coupons */}
        {activeTab === 'coupons' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xs font-black uppercase text-pink-400 tracking-wider">{t('couponManager')}</h3>
            <div className="rounded-3xl bg-slate-900 border border-white/5 p-6 shadow-sm max-w-xl">
              <form onSubmit={handleAddCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="New Coupon Code (e.g. PINK99)"
                  value={newCouponCode}
                  onChange={e => setNewCouponCode(e.target.value)}
                  className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-pink-500 text-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Discount %"
                  value={newCouponDiscount}
                  onChange={e => setNewCouponDiscount(e.target.value)}
                  className="w-24 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-pink-500 text-white"
                  required
                />
                <button type="submit" className="rounded-xl btn-pink-gradient px-4 py-2 text-xs font-bold uppercase shrink-0">
                  {t('addCoupon')}
                </button>
              </form>

              <div className="mt-6 divide-y divide-white/5">
                {coupons.map((c, index) => (
                  <div key={index} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono font-black text-white bg-slate-950 px-2 py-0.5 rounded mr-2">{c.code}</span>
                      <span className="text-slate-450 font-semibold">{c.discount}% Booking Discount</span>
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
            <h3 className="text-xs font-black uppercase text-pink-400 tracking-wider">{t('emergencyAlerts')}</h3>
            <div className="rounded-3xl bg-slate-900 border border-white/5 p-6 shadow-sm max-w-xl">
              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Notification Title</label>
                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={e => setBroadcastTitle(e.target.value)}
                    placeholder="Alert Title"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-pink-500 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Notification Message</label>
                  <textarea
                    value={broadcastText}
                    onChange={e => setBroadcastText(e.target.value)}
                    placeholder="Broadcasting text details to users navbar..."
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-pink-500 text-white h-24 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl btn-pink-gradient py-2.5 text-xs uppercase font-black tracking-widest flex items-center justify-center gap-1.5"
                >
                  <BellRing className="h-4 w-4 shrink-0" />
                  <span>{t('transmitAlert')}</span>
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
