import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { 
  Sun, Moon, MapPin, Wallet, Bell, AlertTriangle, 
  Users, Shield, User, Globe, ChevronDown, Plus
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    theme, toggleTheme, 
    language, setLanguage, 
    role, setRole, 
    location, simulateGPS, 
    locationCoords,
    walletBalance, addWalletMoney,
    notifications, markNotificationsAsRead
  } = useApp();

  const t = translations[language];

  // UI states
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [depositAmount, setDepositAmount] = useState('500');
  const [sosActive, setSosActive] = useState(false);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (!isNaN(amt) && amt > 0) {
      addWalletMoney(amt);
      setShowWalletDropdown(false);
      setDepositAmount('500');
    }
  };

  const handleSOS = () => {
    setSosActive(true);
    setTimeout(() => {
      setSosActive(false);
    }, 4000);
  };

  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 glass backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-accent to-fuchsia-600 text-white shadow-lg glow-pink-hover animate-pulse">
            <span className="text-xl font-bold font-mono">R</span>
            <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-slate-900 shadow-md" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-white via-pink-400 to-fuchsia-500 bg-clip-text text-xl font-black tracking-tight text-transparent">
              {t.brand}
            </span>
            <span className="hidden sm:block text-[10px] text-pink-400 font-bold uppercase tracking-wider">
              A2Z Super Platform
            </span>
          </div>
        </div>

        {/* Center: Tesla-Style Platform Selector */}
        <div className="hidden md:flex items-center space-x-1.5 rounded-2xl bg-slate-900/80 p-1 border border-white/5">
          <button
            onClick={() => setRole('customer')}
            className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 ${
              role === 'customer'
                ? 'bg-gradient-to-r from-accent to-fuchsia-600 text-white shadow-lg hover:shadow-pink-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Customer App</span>
          </button>
          
          <button
            onClick={() => setRole('partner')}
            className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 ${
              role === 'partner'
                ? 'bg-gradient-to-r from-accent to-fuchsia-600 text-white shadow-lg hover:shadow-pink-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Partner Portal</span>
          </button>

          <button
            onClick={() => setRole('admin')}
            className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 ${
              role === 'admin'
                ? 'bg-gradient-to-r from-accent to-fuchsia-600 text-white shadow-lg hover:shadow-pink-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Admin Console</span>
          </button>
        </div>

        {/* Right Side Tools */}
        <div className="flex items-center space-x-2 md:space-x-3">
          
          {/* Live GPS location Selector */}
          <button
            onClick={simulateGPS}
            className="flex items-center space-x-1 rounded-xl border border-white/5 bg-slate-900/60 px-3 py-2 text-xs font-bold text-slate-350 hover:border-pink-500/50 hover:bg-slate-900 transition-all max-w-[120px] sm:max-w-[180px] overflow-hidden truncate"
            title="Click to recalculate device GPS"
          >
            <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
            <span className="truncate hidden sm:inline">{location}</span>
            <span className="sm:hidden text-[9px] uppercase tracking-wide text-pink-400">GPS</span>
          </button>

          {/* Wallet credit indicator */}
          <div className="relative">
            <button
              onClick={() => {
                setShowWalletDropdown(!showWalletDropdown);
                setShowNotifDropdown(false);
                setShowLangDropdown(false);
              }}
              className="flex items-center space-x-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-extrabold text-emerald-400 hover:bg-emerald-500/20 transition-all"
            >
              <Wallet className="h-3.5 w-3.5" />
              <span>₹{walletBalance.toFixed(0)}</span>
            </button>
            {showWalletDropdown && (
              <div className="absolute right-0 mt-2.5 w-64 origin-top-right rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-2xl z-50">
                <div className="text-center">
                  <span className="text-[9px] uppercase tracking-widest text-slate-450 font-black">{t.walletBalance}</span>
                  <div className="my-1.5 text-2xl font-black text-white">₹{walletBalance.toFixed(2)}</div>
                </div>
                <form onSubmit={handleDeposit} className="mt-3 border-t border-white/5 pt-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide block mb-1">Add Wallet Credits (INR)</label>
                  <div className="mt-1 flex space-x-1.5">
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={e => setDepositAmount(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-pink-500 text-white"
                      placeholder="Amount"
                    />
                    <button type="submit" className="rounded-xl btn-pink-gradient px-3 py-2 text-xs flex items-center justify-center shrink-0">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex justify-between gap-1">
                    {['200', '500', '1000'].map(val => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setDepositAmount(val)}
                        className="flex-1 rounded-lg bg-slate-800 py-1 text-[10px] font-extrabold text-slate-300 hover:bg-slate-700"
                      >
                        +₹{val}
                      </button>
                    ))}
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Lang Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangDropdown(!showLangDropdown);
                setShowWalletDropdown(false);
                setShowNotifDropdown(false);
              }}
              className="flex items-center space-x-1 rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors text-xs font-bold"
            >
              <Globe className="h-4 w-4 text-slate-400" />
              <span className="hidden sm:inline uppercase">{language}</span>
            </button>
            {showLangDropdown && (
              <div className="absolute right-0 mt-2.5 w-32 origin-top-right rounded-2xl border border-white/10 bg-slate-900 p-1.5 shadow-2xl z-50">
                <button
                  onClick={() => { setLanguage('en'); setShowLangDropdown(false); }}
                  className={`flex w-full items-center rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors ${language === 'en' ? 'bg-pink-500/10 text-pink-400' : 'hover:bg-white/5'}`}
                >
                  English
                </button>
                <button
                  onClick={() => { setLanguage('ta'); setShowLangDropdown(false); }}
                  className={`flex w-full items-center rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors ${language === 'ta' ? 'bg-pink-500/10 text-pink-400' : 'hover:bg-white/5'}`}
                >
                  தமிழ்
                </button>
                <button
                  onClick={() => { setLanguage('hi'); setShowLangDropdown(false); }}
                  className={`flex w-full items-center rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors ${language === 'hi' ? 'bg-pink-500/10 text-pink-400' : 'hover:bg-white/5'}`}
                >
                  हिन्दी
                </button>
              </div>
            )}
          </div>

          {/* Notification Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowWalletDropdown(false);
                setShowLangDropdown(false);
                markNotificationsAsRead();
              }}
              className="relative rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifs > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[9px] font-black text-white ring-2 ring-slate-950">
                  {unreadNotifs}
                </span>
              )}
            </button>
            {showNotifDropdown && (
              <div className="absolute right-0 mt-2.5 w-80 max-h-96 overflow-y-auto origin-top-right rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-2xl z-50">
                <div className="px-3 py-2 border-b border-white/5 flex justify-between items-center">
                  <span className="text-xs font-extrabold text-white">Notifications</span>
                  <span className="text-[10px] text-pink-400 font-bold">{notifications.length} Total</span>
                </div>
                <div className="divide-y divide-white/5">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500">No alerts</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="p-3 hover:bg-white/5 transition-colors rounded-xl mt-1">
                        <div className="flex items-start justify-between">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            n.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                            n.type === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                            n.type === 'booking' ? 'bg-pink-500/10 text-pink-450' :
                            'bg-slate-500/10 text-slate-400'
                          }`}>
                            {n.type}
                          </span>
                          <span className="text-[9px] text-slate-500 font-semibold">{n.time}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1">{n.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SOS button */}
          <button
            onClick={handleSOS}
            className={`rounded-xl px-3 py-2 text-xs font-bold text-white flex items-center space-x-1.5 shadow-md transition-all duration-300 border border-red-500/30 ${
              sosActive 
                ? 'bg-red-600 animate-ping' 
                : 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white hover:shadow-red-500/20'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">{t.emergencySOS}</span>
          </button>

        </div>
      </div>

      {/* Small Screen View Switcher Toolbar */}
      <div className="md:hidden flex items-center justify-around border-t border-white/5 bg-slate-900/90 p-2">
        <button
          onClick={() => setRole('customer')}
          className={`flex-1 flex flex-col items-center py-1 text-[10px] font-bold transition-all ${role === 'customer' ? 'text-pink-500' : 'text-slate-400'}`}
        >
          <User className="h-4.5 w-4.5 mb-0.5" />
          <span>Customer</span>
        </button>
        <button
          onClick={() => setRole('partner')}
          className={`flex-1 flex flex-col items-center py-1 text-[10px] font-bold transition-all ${role === 'partner' ? 'text-pink-500' : 'text-slate-400'}`}
        >
          <Users className="h-4.5 w-4.5 mb-0.5" />
          <span>Partner App</span>
        </button>
        <button
          onClick={() => setRole('admin')}
          className={`flex-1 flex flex-col items-center py-1 text-[10px] font-bold transition-all ${role === 'admin' ? 'text-pink-500' : 'text-slate-400'}`}
        >
          <Shield className="h-4.5 w-4.5 mb-0.5" />
          <span>Admin</span>
        </button>
      </div>

      {/* SOS Alert Modal overlay */}
      {sosActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="glass-premium max-w-sm rounded-3xl p-6 text-center border-t-4 border-red-500 shadow-2xl animate-bounce">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto animate-pulse" />
            <h3 className="text-lg font-black text-white mt-4">SOS Emergency Alert</h3>
            <p className="text-sm text-slate-405 mt-2">
              {t.emergencyMessage}
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-xs font-bold text-red-400 bg-red-500/10 py-2 rounded-xl border border-red-500/10">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span>GPS coords: {locationCoords.lat.toFixed(5)}, {locationCoords.lng.toFixed(5)}</span>
            </div>
            <button 
              onClick={() => setSosActive(false)}
              className="mt-5 w-full rounded-xl bg-slate-800 py-2.5 text-xs text-white hover:bg-slate-700"
            >
              Cancel Alert
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
