import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { ShieldCheck, Mail, RefreshCw, AlertTriangle } from 'lucide-react';

interface AdminVerifyOtpProps {
  email: string;
  onVerificationSuccess: (token: string) => void;
  onCancel: () => void;
}

export const AdminVerifyOtpView: React.FC<AdminVerifyOtpProps> = ({ email, onVerificationSuccess, onCancel }) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(60);

  // Timer cooldown logic for Resending OTP code
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input box
    if (element.value !== '' && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);

      // Focus previous input box
      if ((e.target as HTMLInputElement).previousSibling) {
        ((e.target as HTMLInputElement).previousSibling as HTMLInputElement).focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP code.');
      setLoading(false);
      return;
    }

    try {
      const res = await apiRequest('/auth/admin/verify', {
        method: 'POST',
        body: JSON.stringify({ email, otp: otpCode })
      });

      if (res.success && res.token) {
        onVerificationSuccess(res.token);
      } else {
        setError(res.message || 'OTP verification failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError('');
    setLoading(true);

    try {
      const res = await apiRequest('/auth/admin/resend', {
        method: 'POST',
        body: JSON.stringify({ email })
      });

      if (res.success) {
        setCooldown(60);
        setOtp(Array(6).fill(''));
        // Focus first input field
        const firstInput = document.getElementById('otp-0');
        if (firstInput) firstInput.focus();
      } else {
        setError(res.message || 'Failed to resend OTP.');
      }
    } catch (err: any) {
      setError(err.message || 'Resend request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl backdrop-blur-xl animate-in fade-in duration-300">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 mb-3 border border-cyan-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider">Admin Verification</h2>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mt-2">
            <Mail className="h-3.5 w-3.5" />
            <span className="truncate max-w-[250px]">{email}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">A 6-digit verification code has been dispatched to your email.</p>
          <p className="text-[10px] text-amber-400 mt-2 bg-amber-500/10 border border-amber-500/20 py-1.5 px-3 rounded-xl inline-block font-medium">
            💡 Local Testing Bypass: Check <code className="bg-slate-900 px-1 py-0.5 rounded text-white font-mono">backend/otp-debug.log</code> or console logs for the OTP.
          </p>
        </div>

        {/* Errors */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 mb-6 flex items-start gap-2.5 text-xs text-red-400 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2.5">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(e.target, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                required
                className="w-12 h-14 bg-slate-900/60 border border-white/10 rounded-2xl text-center text-xl text-white outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition font-bold"
              />
            ))}
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-cyan-500 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-cyan-600 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Verifying OTP passcode...' : 'Verify OTP'}
            </button>

            {/* Actions footer */}
            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="text-slate-500 hover:text-white transition"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || loading}
                className={`flex items-center gap-1.5 ${
                  cooldown > 0 ? 'text-slate-600 cursor-not-allowed' : 'text-cyan-400 hover:text-cyan-300'
                } transition`}
              >
                <RefreshCw className="h-3 w-3" />
                <span>{cooldown > 0 ? `Resend OTP (${cooldown}s)` : 'Resend OTP'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
