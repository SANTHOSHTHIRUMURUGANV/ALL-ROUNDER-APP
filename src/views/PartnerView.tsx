import React, { useState, useEffect } from 'react';
import { useApp, Partner, Booking } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, Upload, AlertCircle, FileText, Landmark, Camera,
  User, Check, X, Wallet, ArrowRight, BarChart2, Star,
  Compass, Map, ShieldAlert, Navigation, Activity, MessageSquare, Phone, CheckCircle2,
  Calendar, Clock, Sliders, PlayCircle, Eye, ArrowUpRight, Brain, AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ALL_PROFESSIONS = [
  'Painter', 'Carpenter', 'Electrician', 'Plumber', 'AC Technician', 'Mechanic',
  'Beautician', 'Cleaner', 'Home Cleaner', 'Tutor', 'Photographer', 'Videographer',
  'Home Cook', 'Gym Trainer', 'Courier Partner', 'Delivery Partner', 'Driver',
  'Doctor', 'Lab Technician', 'Lawyer', 'Water Supplier', 'Laundry Service',
  'Packers & Movers', 'Event Planner', 'Flower Seller', 'Cake Shop', 'Pet Care',
  'Mobile Repair', 'Laptop Repair', 'Electronics Repair', 'Interior Designer',
  'Architect', 'Mason', 'Welder', 'CCTV Technician', 'RO Water Service', 'Pest Control'
];

export const PartnerView: React.FC = () => {
  const { 
    bookings, updateBookingStatus, partners, setPartners,
    addNotification, partnerReg, setPartnerReg, submitPartnerRegistration,
    location
  } = useApp();

  const { t } = useTranslation();

  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('');
  const [showRegisterWizard, setShowRegisterWizard] = useState(false);

  const activePartner = partners.find(p => p.id === selectedPartnerId || (p as any)._id === selectedPartnerId) || partners[0];
  const currentStep = partnerReg.step;

  useEffect(() => {
    if (partners.length > 0 && (!selectedPartnerId || !partners.find(p => p.id === selectedPartnerId || (p as any)._id === selectedPartnerId))) {
      setSelectedPartnerId(partners[0].id || (partners[0] as any)._id);
    }
  }, [partners, selectedPartnerId]);

  // Payout states
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('500');
  const [upiId, setUpiId] = useState('suresh@okicici');

  // Self scanner state
  const [selfieScanning, setSelfieScanning] = useState(false);
  const [selfieScanned, setSelfieScanned] = useState(false);
  const [selfieScanProgress, setSelfieScanProgress] = useState(0);

  const handleAccept = (bId: string) => {
    updateBookingStatus(bId, 'accepted');
    addNotification('Task Accepted! 🚕', 'Route is visible to customer. Navigation started.', 'success');
    setTimeout(() => {
      updateBookingStatus(bId, 'ongoing');
    }, 4500);
  };

  const handleReject = (bId: string) => {
    updateBookingStatus(bId, 'cancelled');
    addNotification('Task Rejected 🔴', 'Passed request to another available pro.', 'warning');
  };

  const handleToggleOnline = (id: string) => {
    setPartners(prev =>
      prev.map(p => (p.id === id ? { ...p, isOnline: !p.isOnline } : p))
    );
    addNotification(
      'Availability Status Changed 🔄',
      `You are now ${!activePartner?.isOnline ? 'Online' : 'Offline'}.`,
      !activePartner?.isOnline ? 'success' : 'info'
    );
  };

  const handleWithdrawal = (e: React.FormEvent, balance: number) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (!isNaN(amt) && amt > 0 && amt <= balance) {
      setWithdrawOpen(false);
      confetti();
      addNotification('UPI Transfer Dispatched 💸', `₹${amt} credited to ${upiId}.`, 'success');
    } else {
      addNotification('Payout Error ⚠️', 'Check amount constraints.', 'warning');
    }
  };

  const updateWizardField = (section: keyof typeof partnerReg, field: string, value: any) => {
    setPartnerReg(prev => {
      const sect = prev[section];
      if (typeof sect === 'object') {
        return {
          ...prev,
          [section]: {
            ...sect,
            [field]: value
          }
        };
      }
      return prev;
    });
  };

  const nextStep = () => {
    setPartnerReg(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const prevStep = () => {
    setPartnerReg(prev => ({ ...prev, step: prev.step - 1 }));
  };

  const handleProfessionSelect = (prof: string) => {
    setPartnerReg(prev => ({ ...prev, profession: prof }));
    nextStep();
  };

  const triggerSelfieScan = () => {
    setSelfieScanning(true);
    setSelfieScanProgress(0);
    const interval = setInterval(() => {
      setSelfieScanProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setSelfieScanning(false);
          setSelfieScanned(true);
          updateWizardField('uploads', 'selfieFile', 'VerifiedFaceSelfie.png');
          addNotification('Face Match Successful 📸', '98.4% Match with Aadhaar Photo.', 'success');
          return 100;
        }
        return p + 10;
      });
    }, 200);
  };

  const handleFinalSubmit = () => {
    submitPartnerRegistration();
    setShowRegisterWizard(false);
    const newlyCreated = partners[partners.length - 1];
    if (newlyCreated) {
      setSelectedPartnerId(newlyCreated.id);
    }
    confetti();
  };

  const calculateProfilePercentage = () => {
    if (!activePartner) return 0;
    let score = 20;
    if (activePartner.avatar) score += 15;
    if (activePartner.phone && activePartner.whatsapp) score += 15;
    if (activePartner.price && activePartner.experience) score += 20;
    if (activePartner.portfolio.length > 0) score += 15;
    if (activePartner.aadhaarNumber) score += 15;
    return score;
  };

  const renderWizard = () => {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="glass-premium rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative">
          
          <button 
            onClick={() => setShowRegisterWizard(false)}
            className="absolute right-4 top-4 p-2 rounded-xl bg-slate-900 border border-white/5 hover:border-cyan-400/40 text-slate-400"
          >
            Cancel
          </button>

          {/* Stepper tracker */}
          <div className="flex justify-between items-center mb-8 overflow-x-auto pb-2 scrollbar-none">
            {[1, 2, 3, 4, 5, 6, 7].map(st => (
              <div key={st} className="flex items-center shrink-0">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black border transition-all ${
                  currentStep >= st 
                    ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-white border-cyan-400' 
                    : 'bg-slate-950 border-white/5 text-slate-500'
                }`}>
                  {st}
                </div>
                {st < 7 && <div className={`w-8 h-0.5 mx-1.5 ${currentStep > st ? 'bg-cyan-500' : 'bg-slate-800'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Choose Profession */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Step 1: Choose Profession</h3>
              <p className="text-xs text-slate-400">Select your specialization from 35+ supported trades</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-2">
                {ALL_PROFESSIONS.map(prof => (
                  <button
                    key={prof}
                    onClick={() => handleProfessionSelect(prof)}
                    className="p-3 text-xs font-bold rounded-2xl bg-slate-900 border border-white/5 text-slate-350 hover:border-cyan-400 hover:text-cyan-400 text-left transition-all animate-in fade-in"
                  >
                    💼 {t(`categories.${prof}`, prof)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Personal Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Step 2: Personal Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter legal name"
                    value={partnerReg.personalDetails.name}
                    onChange={e => updateWizardField('personalDetails', 'name', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Mobile Number</label>
                    <input
                      type="text"
                      placeholder="+91 99999 88888"
                      value={partnerReg.personalDetails.phone}
                      onChange={e => updateWizardField('personalDetails', 'phone', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Email ID</label>
                    <input
                      type="email"
                      placeholder="provider@allcounter.com"
                      value={partnerReg.personalDetails.email}
                      onChange={e => updateWizardField('personalDetails', 'email', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Gender</label>
                    <select
                      value={partnerReg.personalDetails.gender}
                      onChange={e => updateWizardField('personalDetails', 'gender', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={partnerReg.personalDetails.dob}
                      onChange={e => updateWizardField('personalDetails', 'dob', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Profile Photo URL</label>
                  <input
                    type="text"
                    placeholder="https://unsplash.com/photo-... (Portrait URL)"
                    value={partnerReg.personalDetails.photo}
                    onChange={e => updateWizardField('personalDetails', 'photo', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Current Residential Address</label>
                  <input
                    type="text"
                    placeholder="Residential address"
                    value={partnerReg.personalDetails.address}
                    onChange={e => updateWizardField('personalDetails', 'address', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <button onClick={prevStep} className="px-4 py-2 text-xs font-bold bg-slate-800 text-slate-350 rounded-xl">Back</button>
                <button onClick={nextStep} className="px-5 py-2 text-xs btn-cyan-gradient rounded-xl">Continue</button>
              </div>
            </div>
          )}

          {/* Step 3: Business Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Step 3: Business Details</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Business/Trade Name</label>
                    <input
                      type="text"
                      placeholder="E.g. Rohan Masonry Studio"
                      value={partnerReg.businessDetails.businessName}
                      onChange={e => updateWizardField('businessDetails', 'businessName', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Shop Name</label>
                    <input
                      type="text"
                      placeholder="E.g. Rohan & Sons Masons"
                      value={partnerReg.businessDetails.shopName}
                      onChange={e => updateWizardField('businessDetails', 'shopName', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Exp (Years)</label>
                    <input
                      type="text"
                      placeholder="E.g. 6"
                      value={partnerReg.businessDetails.experience}
                      onChange={e => updateWizardField('businessDetails', 'experience', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Price (₹/Visit)</label>
                    <input
                      type="number"
                      placeholder="E.g. 199"
                      value={partnerReg.businessDetails.pricing}
                      onChange={e => updateWizardField('businessDetails', 'pricing', parseFloat(e.target.value))}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Radius (km)</label>
                    <input
                      type="number"
                      placeholder="E.g. 10"
                      value={partnerReg.businessDetails.serviceRadius}
                      onChange={e => updateWizardField('businessDetails', 'serviceRadius', parseInt(e.target.value))}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-white/5">
                  <label className="flex items-center gap-2 text-slate-350 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={partnerReg.businessDetails.emergencyService} 
                      onChange={e => updateWizardField('businessDetails', 'emergencyService', e.target.checked)}
                    />
                    <span>24/7 Emergency Support</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-350 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={partnerReg.businessDetails.doorstepService} 
                      onChange={e => updateWizardField('businessDetails', 'doorstepService', e.target.checked)}
                    />
                    <span>Doorstep Services</span>
                  </label>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Business Description</label>
                  <textarea
                    placeholder="Describe your trade expertise"
                    value={partnerReg.businessDetails.description}
                    onChange={e => updateWizardField('businessDetails', 'description', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white h-20 resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <button onClick={prevStep} className="px-4 py-2 text-xs font-bold bg-slate-800 text-slate-355 rounded-xl">Back</button>
                <button onClick={nextStep} className="px-5 py-2 text-xs btn-cyan-gradient rounded-xl">Continue</button>
              </div>
            </div>
          )}

          {/* Step 4: Documents Upload */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Step 4: Verification Documents</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-dashed border-white/10 rounded-2xl p-4 bg-slate-950 text-center">
                  <FileText className="h-6 w-6 text-cyan-400 mx-auto" />
                  <span className="text-[9px] font-bold text-slate-400 block mt-1 uppercase">Aadhaar Card PDF</span>
                  <button type="button" onClick={() => updateWizardField('uploads', 'aadhaarFile', 'AadhaarVerified.pdf')} className={`mt-2 text-[9px] px-2 py-1 rounded ${partnerReg.uploads.aadhaarFile ? 'bg-emerald-500 text-white' : 'btn-cyan-gradient'}`}>
                    {partnerReg.uploads.aadhaarFile ? 'Uploaded' : 'Upload File'}
                  </button>
                </div>
                <div className="border border-dashed border-white/10 rounded-2xl p-4 bg-slate-950 text-center">
                  <FileText className="h-6 w-6 text-cyan-400 mx-auto" />
                  <span className="text-[9px] font-bold text-slate-400 block mt-1 uppercase">PAN Card PDF</span>
                  <button type="button" onClick={() => updateWizardField('uploads', 'panFile', 'PanVerified.pdf')} className={`mt-2 text-[9px] px-2 py-1 rounded ${partnerReg.uploads.panFile ? 'bg-emerald-500 text-white' : 'btn-cyan-gradient'}`}>
                    {partnerReg.uploads.panFile ? 'Uploaded' : 'Upload File'}
                  </button>
                </div>
              </div>

              {/* Selfie scanner */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-3">
                <h4 className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">Live Face Verification</h4>
                
                {selfieScanning ? (
                  <div className="text-center py-4 space-y-2">
                    <div className="h-12 w-12 rounded-full border-4 border-t-cyan-500 border-white/10 animate-spin mx-auto" />
                    <span className="text-xs text-slate-400 block">Biometric scanning: {selfieScanProgress}%</span>
                  </div>
                ) : selfieScanned ? (
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold justify-center py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/15">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                    <span>Liveness Biometric Verification Pass</span>
                  </div>
                ) : (
                  <button 
                    type="button" 
                    onClick={triggerSelfieScan}
                    className="w-full py-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-cyan-455 text-xs font-bold hover:bg-cyan-500 hover:text-white flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Start Biometric Selfie Recognition</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Bank Account Number</label>
                  <input
                    type="text"
                    placeholder="Account number"
                    value={partnerReg.uploads.bankAccount}
                    onChange={e => updateWizardField('uploads', 'bankAccount', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">UPI Account ID</label>
                  <input
                    type="text"
                    placeholder="name@upi"
                    value={partnerReg.uploads.upi}
                    onChange={e => updateWizardField('uploads', 'upi', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button onClick={prevStep} className="px-4 py-2 text-xs font-bold bg-slate-800 text-slate-350 rounded-xl">Back</button>
                <button onClick={nextStep} className="px-5 py-2 text-xs btn-cyan-gradient rounded-xl">Continue</button>
              </div>
            </div>
          )}

          {/* Step 5: Portfolio Upload */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Step 5: Portfolio Upload</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Portfolio Work Photos (URLs separated by comma)</label>
                  <input
                    type="text"
                    placeholder="https://unsplash.com/photo-1..., https://unsplash.com/photo-2..."
                    onChange={e => updateWizardField('portfolio', 'workPhotos', e.target.value.split(','))}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Awards & Accreditations (Separated by comma)</label>
                  <input
                    type="text"
                    placeholder="E.g. Certified Leakage Technician, Best Mason Award 2026"
                    onChange={e => updateWizardField('portfolio', 'awards', e.target.value.split(','))}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <button onClick={prevStep} className="px-4 py-2 text-xs font-bold bg-slate-800 text-slate-350 rounded-xl">Back</button>
                <button onClick={nextStep} className="px-5 py-2 text-xs btn-cyan-gradient rounded-xl">Continue</button>
              </div>
            </div>
          )}

          {/* Step 6: Availability */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Step 6: Availability Setup</h3>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 block">Initial Availability Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Available Now', 'Busy', 'Offline', 'Holiday Mode'].map(st => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setPartnerReg(prev => ({ ...prev, availabilityStatus: st as any }))}
                      className={`py-3 text-xs font-bold rounded-2xl border transition-all ${
                        partnerReg.availabilityStatus === st 
                          ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                          : 'bg-slate-950 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <button onClick={prevStep} className="px-4 py-2 text-xs font-bold bg-slate-800 text-slate-350 rounded-xl">Back</button>
                <button onClick={nextStep} className="px-5 py-2 text-xs btn-cyan-gradient rounded-xl">Continue</button>
              </div>
            </div>
          )}

          {/* Step 7: Onboard Complete */}
          {currentStep === 7 && (
            <div className="space-y-4 text-center">
              <Clock className="h-16 w-16 text-cyan-500 mx-auto animate-pulse" />
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Step 7: Verification Review</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Your onboarding logs are ready. Proceed to submit your application to the Admin queue for document validation.
              </p>
              <div className="flex justify-center gap-1.5 pt-4">
                <button onClick={prevStep} className="px-4 py-2 text-xs font-bold bg-slate-800 text-slate-355 rounded-xl">Back</button>
                <button onClick={handleFinalSubmit} className="px-6 py-2.5 text-xs btn-cyan-gradient rounded-xl">Submit Application</button>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    if (partners.length === 0) {
      return (
        <div className="mx-auto max-w-lg px-4 py-24 text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-cyan-400 animate-pulse" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider">No Partner Registered Yet</h2>
          <p className="text-sm text-slate-400">Click 'Register as Partner' to continue.</p>
        </div>
      );
    }

    if (!activePartner) return null;

    const ourJobs = bookings.filter(b => b.category === activePartner.category);
    const pendingJobs = ourJobs.filter(b => b.status === 'pending');
    const activeJobs = ourJobs.filter(b => b.status === 'accepted' || b.status === 'ongoing');
    const completedJobs = ourJobs.filter(b => b.status === 'completed');

    const completedTotal = completedJobs.length;
    const earningsVal = completedJobs.reduce((sum, b) => sum + b.price, 0);

    const displayRating = activePartner.reviewsCount > 0 ? activePartner.rating : (completedJobs.length > 0 ? 5.0 : 0.0);
    const displayReviews = activePartner.reviewsCount > 0 ? activePartner.reviewsCount : completedJobs.length;

    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
        
        {/* Verification banner check */}
        {(activePartner.adminStatus === 'pending' || activePartner.adminStatus === 'review') ? (
          <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-5 flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h3 className="text-sm font-extrabold text-white">
                {activePartner.adminStatus === 'review' ? '⏳ UNDER REVIEW' : '⏳ PENDING VERIFICATION'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your identity documents, Aadhaar files, and liveness selfies are pending Admin authorization. You will appear inside customer search matching directories once verified.
              </p>
              <span className="inline-block mt-3 text-[9px] font-black bg-amber-500/10 text-amber-450 px-2 py-0.5 rounded uppercase">
                {activePartner.adminStatus === 'review' ? 'Verification Under Review' : 'Verification Pending'}
              </span>
            </div>
          </div>
        ) : activePartner.adminStatus === 'rejected' ? (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-5 flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-extrabold text-white">❌ REJECTED</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your verification application failed document validations or selfie mismatch index. Please upload clean certificates to request review.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-3.5 flex items-center justify-between text-xs text-emerald-400 font-bold">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-emerald-400" />
              <span>✅ {t('verifiedPartner')} • Listing active in Chennai regions</span>
            </span>
            <span className="bg-emerald-500 text-white rounded px-2 py-0.5 text-[9px] uppercase font-black tracking-widest">Active</span>
          </div>
        )}

        {/* Profile completion slider */}
        <div className="rounded-3xl bg-slate-900 border border-white/5 p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider">Profile Setup Index</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Complete files to get recommended first on customer searches.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:max-w-xs">
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
              <div className="bg-cyan-500 h-full transition-all duration-500" style={{ width: `${calculateProfilePercentage()}%` }} />
            </div>
            <span className="text-xs font-bold text-white shrink-0">{calculateProfilePercentage()}%</span>
          </div>
        </div>

        {/* 1. Dashboard values */}
        <section className="grid sm:grid-cols-4 gap-4">
          
          <div className="rounded-3xl bg-slate-900 border border-white/5 p-6 shadow-md flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{t('earnings')}</span>
                <h3 className="text-2xl font-black text-white mt-1">₹{earningsVal}</h3>
              </div>
              <span className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Wallet className="h-5 w-5" />
              </span>
            </div>
            <button 
              onClick={() => setWithdrawOpen(true)}
              className="mt-6 w-full rounded-xl btn-cyan-gradient py-2 text-xs font-bold uppercase"
            >
              Withdraw Money
            </button>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-white/5 p-6 shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{t('completedJobsLabel')}</span>
            <h3 className="text-2xl font-black text-white mt-1">{completedTotal} Tasks</h3>
            <span className="text-[9px] text-cyan-400 font-bold block mt-2">
              All-time completed jobs
            </span>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-white/5 p-6 shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Cancelled Jobs</span>
            <h3 className="text-2xl font-black text-white mt-1">
              {bookings.filter(b => b.category === activePartner.category && b.status === 'cancelled').length} Tasks
            </h3>
            <span className="text-[9px] text-slate-500 block mt-4">Cancellation penalty: ₹0</span>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-white/5 p-6 shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{t('ratingScoreLabel')}</span>
            <h3 className="text-2xl font-black text-white mt-1 flex items-center gap-1">★ {displayRating}</h3>
            <span className="text-[9px] text-slate-455 block mt-4">Based on {displayReviews} jobs</span>
          </div>

        </section>

        {/* AI Business Forecasting & Insights */}
        <section className="rounded-3xl border border-white/5 bg-slate-900/60 p-5 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 text-cyan-400">
            <Brain className="h-5 w-5 text-cyan-455 animate-pulse shrink-0" />
            <h3 className="text-xs font-black uppercase text-white tracking-widest">AI Merchant Operations forecast</h3>
          </div>
          <div className="grid sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[9px] font-black uppercase text-slate-500 block tracking-wider">Estimated Monthly Earnings</span>
              <div className="text-lg font-black text-white">₹18,400</div>
              <p className="text-[10px] text-slate-450 leading-relaxed">
                Projected next month earnings based on monsoon painting/wiring demand projections in Velachery sector.
              </p>
            </div>
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[9px] font-black uppercase text-slate-500 block tracking-wider">Suggested service Pricing</span>
              <div className="text-lg font-black text-cyan-400">₹{activePartner.price + 40} <span className="text-[9px] text-slate-500 font-semibold">/visit</span></div>
              <p className="text-[10px] text-slate-450 leading-relaxed">
                Suggested base rate adjustments. Market indices are high, and your current rating is {activePartner.rating}/5.
              </p>
            </div>
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[9px] font-black uppercase text-slate-500 block tracking-wider">Optimal Dispatch Hours</span>
              <div className="text-sm font-black text-white flex items-center gap-1">
                <Clock className="h-4 w-4 text-cyan-400" />
                <span>Tue, 10 AM - 1 PM</span>
              </div>
              <p className="text-[10px] text-slate-450 leading-relaxed">
                Historical bookings matching high speed response ratios and low commuter transit index.
              </p>
            </div>
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[9px] font-black uppercase text-slate-500 block tracking-wider">Suggestions for profile visibility</span>
              <div className="text-[10px] font-bold text-white flex items-center gap-1 text-amber-500">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>Upload Certifications</span>
              </div>
              <p className="text-[10px] text-slate-450 leading-relaxed">
                Upload 2 trade certifications to unlock "AI Top Rated Tier" badge matching.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Availability sliders & Holiday Mode */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-3xl bg-slate-900 border border-white/5 p-5 space-y-4">
            <h3 className="text-xs font-black uppercase text-cyan-400 tracking-wider">Availability Settings</h3>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-extrabold text-white text-xs block">Holiday Mode Status</span>
                <span className="text-[10px] text-slate-400">Offline status toggler</span>
              </div>
              <button 
                onClick={() => handleToggleOnline(activePartner.id)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all ${
                  activePartner.isOnline 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                {activePartner.isOnline ? t('online') : t('holidayMode')}
              </button>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Working radius limit: {activePartner.serviceRadius} km</label>
              <input 
                type="range" 
                min="5" 
                max="50" 
                value={activePartner.serviceRadius}
                onChange={e => setPartners(prev => prev.map(p => p.id === activePartner.id ? { ...p, serviceRadius: parseInt(e.target.value) } : p))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-white/5 p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black uppercase text-cyan-400 tracking-wider">Price Configuration</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Define your hourly visit charge for customers</p>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-slate-400 font-bold">₹</span>
              <input
                type="number"
                value={activePartner.price}
                onChange={e => setPartners(prev => prev.map(p => p.id === activePartner.id ? { ...p, price: parseFloat(e.target.value) || 0 } : p))}
                className="w-24 rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-xs outline-none focus:border-cyan-400 text-white font-bold"
              />
              <span className="text-xs text-slate-500">per service visit</span>
            </div>
          </div>
        </div>

        {/* 3. Incoming requests */}
        {pendingJobs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2 animate-pulse">
              <Activity className="h-4.5 w-4.5 shrink-0" />
              <span>Incoming Customer Service Requests ({pendingJobs.length})</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {pendingJobs.map(job => (
                <div key={job.id} className="rounded-3xl border border-cyan-500/30 bg-slate-900 p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 bg-cyan-500 text-white text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                    Alert
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-cyan-400 block uppercase tracking-wider">{t(`categories.${job.category}`)}</span>
                    <h4 className="text-xs font-black text-white mt-1">{job.title}</h4>
                    <div className="mt-3 space-y-1 text-xs text-slate-400">
                      <p>📍 Address: Velachery Sector 5, Chennai</p>
                      <p>💰 Est. Earnings: <span className="text-cyan-400 font-extrabold">₹{job.price}</span></p>
                    </div>
                  </div>
                  <div className="mt-5 flex gap-2 pt-3 border-t border-white/5">
                    <button
                      onClick={() => handleReject(job.id)}
                      className="flex-1 rounded-xl border border-white/5 bg-slate-950 py-2.5 text-xs font-bold text-slate-450 hover:text-white flex items-center justify-center gap-1 transition-all"
                    >
                      <X className="h-4 w-4 text-cyan-455 shrink-0" />
                      <span>{t('reject')}</span>
                    </button>
                    <button
                      onClick={() => handleAccept(job.id)}
                      className="flex-1 rounded-xl btn-cyan-gradient py-2.5 text-xs uppercase font-black flex items-center justify-center gap-1"
                    >
                      <Check className="h-4 w-4 shrink-0" />
                      <span>{t('accept')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Maps navigation if job is active */}
        {activeJobs.length > 0 && (
          <div className="rounded-3xl border border-white/5 bg-slate-900 p-6 shadow-md space-y-4">
            <h3 className="text-xs font-black uppercase text-cyan-400 tracking-wider">Google GPS Navigation</h3>
            <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/5 flex items-center justify-center">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00E5FF_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
              <svg className="absolute inset-0 w-full h-full stroke-cyan-500/20 stroke-[3] fill-none">
                <path d="M 10,10 L 150,120 L 300,160 H 600" />
              </svg>
              <div className="absolute left-[80%] top-[80%] bg-cyan-500 text-white text-[9px] px-2 py-0.5 rounded shadow font-black uppercase tracking-wider">
                Client Address
              </div>
              <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-white/5 px-2.5 py-1.5 rounded-xl text-[9px] text-slate-400">
                <span className="font-extrabold text-white block">Active Route</span>
                Navigating to: {location}
              </div>
            </div>
          </div>
        )}

        {/* 5. Payout Modal */}
        {withdrawOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
            <div className="glass-premium max-w-sm w-full rounded-3xl p-6 shadow-2xl relative border border-white/10 mx-4">
              <button 
                onClick={() => setWithdrawOpen(false)}
                className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-455"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 mb-4 text-cyan-400">
                <Wallet className="h-5 w-5 shrink-0" />
                <h3 className="text-xs font-black tracking-widest uppercase text-white">Withdraw Payout</h3>
              </div>
              
              <form onSubmit={e => handleWithdrawal(e, earningsVal)} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Enter Amount (INR)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    max={earningsVal}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
                    placeholder="Amount"
                    required
                  />
                  <span className="text-[9px] text-slate-500 block mt-1">Available earnings: ₹{earningsVal}</span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Enter UPI Account Address</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-cyan-400 text-white"
                    placeholder="name@upi"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl btn-cyan-gradient py-2.5 text-xs uppercase font-black tracking-wider"
                >
                  Verify & Dispatch Fund
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 pb-16">
      
      {/* Banner */}
      <section className="bg-gradient-to-r from-indigo-500/10 via-slate-900 to-[#0B1020] py-12 px-4 border-b border-white/5">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-pulse">💼</span>
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-wider text-white">{t('partnerMode')}</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
              {!showRegisterWizard ? 'Merchant Workspace' : 'Onboarding Registry'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!showRegisterWizard && (
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Select Profile:</span>
                <select 
                  value={selectedPartnerId}
                  onChange={e => setSelectedPartnerId(e.target.value)}
                  className="bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs font-bold text-cyan-400 outline-none cursor-pointer"
                >
                  {partners.map(p => (
                    <option key={p.id} value={p.id} className="bg-slate-950">
                      {p.name} ({t(`categories.${p.category}`, p.category)} - {p.adminStatus.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <button
              onClick={() => {
                setShowRegisterWizard(true);
                setPartnerReg({
                  step: 1,
                  profession: '',
                  personalDetails: { name: '', photo: '', phone: '', email: '', gender: 'Male', dob: '', address: '' },
                  businessDetails: { businessName: '', shopName: '', experience: '', description: '', pricing: 199, languages: [], workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], workingHours: '9 AM - 6 PM', serviceRadius: 10, emergencyService: false, doorstepService: true, businessAddress: '' },
                  uploads: { aadhaarFile: '', panFile: '', selfieFile: '', bankAccount: '', upi: '' },
                  portfolio: { workPhotos: [], beforeAfterPhotos: [], videos: [], certificates: [], awards: [] },
                  availabilityStatus: 'Available Now'
                });
                setSelfieScanned(false);
              }}
              className="rounded-xl bg-slate-800 border border-white/5 px-4 py-2.5 text-xs font-black uppercase tracking-wider hover:border-cyan-400 hover:text-cyan-400 text-white transition-all cursor-pointer"
            >
              {t('onboardPartner')}
            </button>
          </div>
        </div>
      </section>

      {showRegisterWizard ? renderWizard() : renderDashboard()}

    </div>
  );
};
