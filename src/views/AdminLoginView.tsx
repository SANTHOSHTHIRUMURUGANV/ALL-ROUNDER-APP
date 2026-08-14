import React, { useState } from 'react';
import { apiRequest } from '../utils/api';
import { Lock, UserCheck, AlertTriangle } from 'lucide-react';

interface AdminLoginViewProps {
  onLoginSuccess: (email: string) => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onLoginSuccess }) => {
  const [userNumber, setUserNumber] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('vincyvincilin@gmail.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatUserNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const char: Record<number, string> = { 4: ' ', 8: ' ' };
    let formatted = '';
    for (let i = 0; i < numbers.length; i++) {
      if (i > 11) break;
      if (char[i]) formatted += char[i];
      formatted += numbers[i];
    }
    return formatted;
  };

  const handleUserNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserNumber(formatUserNumber(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formattedNum = userNumber.replace(/\s+/g, '');
      if (formattedNum.length !== 12) {
        throw new Error('Admin User Number must be exactly 12 digits.');
      }

      const res = await apiRequest('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ userNumber: formattedNum, password, email })
      });

      if (res.success) {
        onLoginSuccess(email);
      } else {
        setError(res.message || 'Login failed. Please check credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Server error. Please try again.');
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
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider">Admin Portal</h2>
          <p className="text-xs text-slate-500 mt-1">Multi-factor secure gateway access</p>
        </div>

        {/* Error Warning */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 mb-6 flex items-start gap-2.5 text-xs text-red-400 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* User Number */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Admin User Number</label>
            <div className="relative">
              <input
                type="text"
                placeholder="7774 5180 7169"
                value={userNumber}
                onChange={handleUserNumberChange}
                required
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-650 outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/40 transition"
              />
              <UserCheck className="absolute right-4 top-3.5 h-4 w-4 text-slate-500" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-650 outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/40 transition"
              />
            </div>
          </div>

          {/* Email Select */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Verification Email</label>
            <select
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/40 transition cursor-pointer"
            >
              <option value="vincyvincilin@gmail.com" className="bg-slate-950">vincyvincilin@gmail.com</option>
              <option value="vijayanvijayank006@gmail.com" className="bg-slate-950">vijayanvijayank006@gmail.com</option>
              <option value="thirunavukarasu.s.ds@gmail.com" className="bg-slate-950">thirunavukarasu.s.ds@gmail.com</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-500 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-cyan-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {loading ? 'Validating credentials...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};
