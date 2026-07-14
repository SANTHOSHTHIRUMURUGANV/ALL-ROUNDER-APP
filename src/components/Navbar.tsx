import React, { useState } from 'react';
import { useApp, Language, LocationDetails } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { 
  User, Shield, Wallet, Globe, MapPin, Navigation, Bell,
  Plus, X, LogIn, LogOut, Check, Compass, AlertOctagon, HelpCircle
} from 'lucide-react';

const LANGUAGES_LIST = [
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'ar', label: 'العربية' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' }
];

const PRESETS = [
  { name: 'Velachery', lat: 12.9815, lng: 80.2180, postcode: '600042' },
  { name: 'Adyar', lat: 12.9975, lng: 80.2520, postcode: '600020' },
  { name: 'OMR Road', lat: 12.9279, lng: 80.2301, postcode: '600119' },
  { name: 'Tambaram', lat: 12.9228, lng: 80.1278, postcode: '600045' },
  { name: 'Anna Nagar', lat: 13.0850, lng: 80.2101, postcode: '600040' }
];

export const Navbar: React.FC = () => {
  const { 
    language, setLanguage, role, setRole, location, locationCoords,
    locationDetails, requestLiveLocation, updateManualLocation, walletBalance,
    addWalletMoney, notifications, markNotificationsAsRead, simulateGPS
  } = useApp();

  const { t } = useTranslation();

  // Dropdown visibility states
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Deposit input
  const [depositAmount, setDepositAmount] = useState('500');

  // Manual GPS inputs
  const [manualLat, setManualLat] = useState('12.9815');
  const [manualLng, setManualLng] = useState('80.2180');

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (!isNaN(amt) && amt > 0) {
      addWalletMoney(amt);
      setDepositAmount('500');
      setShowWalletDropdown(false);
    }
  };

  const handleManualLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      await updateManualLocation(lat, lng);
      setShowLocationModal(false);
    }
  };

  const selectPreset = async (preset: typeof PRESETS[0]) => {
    const customDetails: LocationDetails = {
      address: `${preset.name} Main Road`,
      city: "Chennai",
      district: "Chennai District",
      state: "Tamil Nadu",
      postcode: preset.postcode,
      country: "India"
    };
    await updateManualLocation(preset.lat, preset.lng, customDetails);
    setShowLocationModal(false);
  };

  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0F172A]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-fuchsia-600 text-white shadow-lg animate-pulse">
            <span className="text-xl font-bold font-mono">R</span>
            <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-slate-900 shadow-md" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-white via-pink-400 to-fuchsia-500 bg-clip-text text-xl font-black tracking-tight text-transparent">
              {t('brand')}
            </span>
            <span className="hidden sm:block text-[9px] text-pink-400 font-bold uppercase tracking-wider">
              A2Z Super Platform
            </span>
          </div>
        </div>

        {/* Center Mode Switcher */}
        <div className="hidden md:flex items-center space-x-1.5 rounded-2xl bg-slate-900/80 p-1 border border-white/5">
          <button
            onClick={() => setRole('customer')}
            className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 ${
              role === 'customer'
                ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>{t('customerMode')}</span>
          </button>

          <button
            onClick={() => setRole('partner')}
            className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 ${
              role === 'partner'
                ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>{t('partnerMode')}</span>
          </button>

          <button
            onClick={() => setRole('admin')}
            className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 ${
              role === 'admin'
                ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>{t('adminMode')}</span>
          </button>
        </div>

        {/* Right Tools */}
        <div className="flex items-center space-x-2 md:space-x-3">
          
          {/* Geocoder Location Selector Trigger */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center space-x-1 rounded-xl border border-white/5 bg-slate-900/60 px-3 py-2 text-xs font-bold text-slate-350 hover:border-pink-500/50 hover:bg-slate-900 transition-all max-w-[120px] sm:max-w-[180px] overflow-hidden truncate"
            title="Click to configure precise Geolocation coordinates"
          >
            <MapPin className="h-3.5 w-3.5 text-pink-505 shrink-0 text-pink-500" />
            <span className="truncate hidden sm:inline">{locationDetails ? locationDetails.address : location}</span>
            <span className="sm:hidden text-[9px] uppercase tracking-wide text-pink-400">GPS</span>
          </button>

          {/* Wallet Drawer */}
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
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">{t('walletBalance')}</span>
                <span className="text-xl font-black text-white block mt-1">₹{walletBalance.toFixed(2)}</span>

                <form onSubmit={handleDeposit} className="mt-3 border-t border-white/5 pt-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide block mb-1">{t('addMoney')}</label>
                  <div className="mt-1 flex space-x-1.5">
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={e => setDepositAmount(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-pink-500 text-white"
                      placeholder="Amount"
                    />
                    <button type="submit" className="rounded-xl btn-pink-gradient px-3 py-2 text-xs flex items-center justify-center shrink-0">
                      <Plus className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  <div className="mt-2 flex justify-between gap-1">
                    {['200', '500', '1000'].map(val => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setDepositAmount(val)}
                        className="flex-1 rounded-lg bg-slate-800 py-1 text-[10px] font-extrabold text-slate-350 hover:bg-slate-700"
                      >
                        +₹{val}
                      </button>
                    ))}
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Lang Dropdown */}
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
              <div className="absolute right-0 mt-2.5 w-40 origin-top-right rounded-2xl border border-white/10 bg-slate-900 p-1.5 shadow-2xl z-50 max-h-60 overflow-y-auto">
                {LANGUAGES_LIST.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code as Language); setShowLangDropdown(false); }}
                    className={`flex w-full items-center rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors ${language === lang.code ? 'bg-pink-500/10 text-pink-400' : 'hover:bg-white/5 text-slate-300 hover:text-white'}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notif Alarm Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowWalletDropdown(false);
                setShowLangDropdown(false);
                markNotificationsAsRead();
              }}
              className="relative p-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadNotifs > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-pink-500" />
              )}
            </button>
            {showNotifDropdown && (
              <div className="absolute right-0 mt-2.5 w-72 origin-top-right rounded-2xl border border-white/10 bg-slate-900 p-3 shadow-2xl z-50 divide-y divide-white/5 max-h-64 overflow-y-auto">
                <span className="text-[10px] font-black uppercase text-pink-400 block tracking-wider mb-2">{t('notification')}</span>
                {notifications.length === 0 ? (
                  <p className="text-[10px] text-slate-500 py-4 text-center">No notifications</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="py-2.5 text-xs">
                      <span className="font-extrabold text-white block">{n.title}</span>
                      <p className="text-slate-450 text-[10px] mt-0.5">{n.message}</p>
                      <span className="text-[8px] text-slate-500 block mt-1">{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Geolocation Details & Selection Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="glass-premium max-w-md w-full rounded-3xl p-6 shadow-2xl border border-white/10 relative text-xs">
            <button 
              onClick={() => setShowLocationModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-xl hover:bg-slate-800 text-slate-450"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 text-pink-400">
              <Compass className="h-5 w-5 shrink-0" />
              <h3 className="text-sm font-black uppercase tracking-wider text-white">Precise Location Geocoding</h3>
            </div>

            {/* Geocode outputs */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-2 mb-4 text-slate-350">
              <h4 className="text-[10px] font-black uppercase text-pink-450 tracking-widest mb-1.5">GPS Location Coordinates</h4>
              <div>📍 Address: <span className="font-bold text-white">{locationDetails?.address || 'N/A'}</span></div>
              <div>🏙️ City: <span className="font-bold text-white">{locationDetails?.city || 'N/A'}</span></div>
              <div>🏢 District: <span className="font-bold text-white">{locationDetails?.district || 'N/A'}</span></div>
              <div>🏛️ State: <span className="font-bold text-white">{locationDetails?.state || 'N/A'}</span></div>
              <div>📮 PIN Code: <span className="font-bold text-white">{locationDetails?.postcode || 'N/A'}</span></div>
              <div>🇮🇳 Country: <span className="font-bold text-white">{locationDetails?.country || 'N/A'}</span></div>
              <div className="text-[9px] text-slate-500 pt-2 border-t border-white/5 mt-2">
                Coords: lat {locationCoords.lat.toFixed(4)}, lng {locationCoords.lng.toFixed(4)}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={async () => {
                  await requestLiveLocation();
                  setShowLocationModal(false);
                }}
                className="w-full py-2.5 rounded-xl btn-pink-gradient text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
              >
                <Navigation className="h-4 w-4" />
                <span>Automatically Detect GPS Location</span>
              </button>

              <div className="border-t border-white/5 my-3 pt-3">
                <span className="text-[9px] font-black uppercase text-slate-500 block mb-2 tracking-wider">Select Pre-configured Locations</span>
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => selectPreset(preset)}
                      className="p-2 rounded-xl bg-slate-900 border border-white/5 hover:border-pink-500 hover:text-pink-400 text-left font-bold"
                    >
                      📍 {preset.name} ({preset.postcode})
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual coordinate inputs */}
              <form onSubmit={handleManualLocationSubmit} className="border-t border-white/5 pt-3 space-y-2">
                <span className="text-[9px] font-black uppercase text-slate-500 block mb-1 tracking-wider">Input Custom Coordinates</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualLat}
                    onChange={e => setManualLat(e.target.value)}
                    placeholder="Latitude"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-xs outline-none focus:border-pink-500 text-white"
                  />
                  <input
                    type="text"
                    value={manualLng}
                    onChange={e => setManualLng(e.target.value)}
                    placeholder="Longitude"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-xs outline-none focus:border-pink-500 text-white"
                  />
                  <button type="submit" className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3 text-xs font-bold text-white uppercase shrink-0">
                    Set
                  </button>
                </div>
              </form>

            </div>

          </div>
        </div>
      )}

    </header>
  );
};
