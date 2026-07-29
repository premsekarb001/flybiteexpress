import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, ShieldCheck, Smartphone, Lock, CheckCircle2, UserCheck, KeyRound } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginCustomerOTP, verifyOTP, loginAdminPassword, otpSent, pendingPhone } = useAuth();
  const [tab, setTab] = useState<'customer' | 'admin'>('customer');
  
  // Customer OTP State
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('');
  
  // Admin Credentials State
  const [adminEmail, setAdminEmail] = useState('admin@flybite.in');
  const [adminPassword, setAdminPassword] = useState('admin123');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    loginCustomerOTP(phone);
    setSuccessMsg(`SMS OTP sent to +91 ${phone}. Use demo OTP: 123456`);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = verifyOTP(otp);
    if (ok) {
      onClose();
    } else {
      setError('Invalid OTP. Use demo OTP: 123456');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = loginAdminPassword(adminEmail, adminPassword);
    if (ok) {
      onClose();
    } else {
      setError('Invalid admin credentials. Try admin@flybite.in / admin123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-md glass-panel border border-slate-700 bg-slate-950 rounded-3xl p-6 shadow-2xl space-y-6 glow-orange">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-orange-400" />
            <div>
              <h3 className="text-lg font-extrabold text-white">Authentication Portal</h3>
              <p className="text-xs text-slate-400">FlyBite Express India • Secure Access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => { setTab('customer'); setError(''); }}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              tab === 'customer'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Customer OTP</span>
          </button>
          <button
            onClick={() => { setTab('admin'); setError(''); }}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              tab === 'admin'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>SuperAdmin Access</span>
          </button>
        </div>

        {/* Customer SMS OTP Form */}
        {tab === 'customer' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Enter Indian Mobile Number (+91)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-xs font-bold text-orange-400">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full bg-slate-900 border border-slate-700 text-white text-sm font-mono rounded-xl pl-12 pr-4 py-2.5 outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg transition-all"
                >
                  Send 6-Digit SMS OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-xs text-emerald-400 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center justify-between">
                    <span>Enter 6-Digit OTP</span>
                    <span className="text-[10px] text-cyan-400 font-mono">Demo: 123456</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-slate-900 border border-slate-700 text-white text-center text-lg font-mono tracking-widest rounded-xl py-2.5 outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg transition-all"
                >
                  Verify & Log In
                </button>
              </form>
            )}
          </div>
        )}

        {/* SuperAdmin Access Form */}
        {tab === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded-xl text-[11px] text-purple-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Demo Admin ID: <strong>admin@flybite.in</strong> | Password: <strong>admin123</strong></span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Admin Email ID</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@flybite.in"
                className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl p-3 outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Admin Password</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl p-3 outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg transition-all"
            >
              Authorize SuperAdmin Access
            </button>
          </form>
        )}

        {/* Error Notification */}
        {error && (
          <p className="text-xs text-rose-400 font-semibold bg-rose-500/10 p-3 rounded-xl border border-rose-500/30">
            {error}
          </p>
        )}

      </div>
    </div>
  );
};
