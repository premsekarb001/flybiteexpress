import React, { useState } from 'react';
import { X, User, ShieldCheck, Mail, Phone, Lock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginCustomerOTP, verifyOTP, loginAdminPassword, switchRole } = useAuthStore();

  const [mode, setMode] = useState<'customer' | 'admin'>('customer');

  // Customer Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpStep, setIsOtpStep] = useState(false);

  // Admin Form State
  const [adminEmail, setAdminEmail] = useState('admin@flybite.in');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isOtpStep) {
      if (!customerName || !customerPhone) {
        setErrorMessage('Please provide your name and phone number.');
        return;
      }
      loginCustomerOTP(customerPhone);
      setIsOtpStep(true);
    } else {
      const success = verifyOTP(otpCode || '123456');
      if (success) {
        // Also update user name if provided
        const store = useAuthStore.getState();
        if (customerName) {
          useAuthStore.setState({
            currentUser: {
              ...store.currentUser,
              name: customerName,
              email: customerEmail || store.currentUser.email,
              phone: customerPhone
            }
          });
        }
        onClose();
      } else {
        setErrorMessage('Invalid OTP code. Try entering 123456.');
      }
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const success = loginAdminPassword(adminEmail, adminPassword);
    if (success) {
      onClose();
    } else {
      setErrorMessage('Invalid admin credentials. (Demo: admin@flybite.in / admin123)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-100">
                {mode === 'customer' ? 'Customer Sign In' : 'Admin Security Gateway'}
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'customer' ? 'Manage orders, fast checkout & air pad codes' : 'SuperAdmin platform governance'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 p-2 bg-slate-950 border-b border-slate-800 gap-1 text-xs font-bold">
          <button
            onClick={() => {
              setMode('customer');
              setErrorMessage('');
            }}
            className={`py-2 rounded-xl transition ${
              mode === 'customer'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Customer Account
          </button>

          <button
            onClick={() => {
              setMode('admin');
              setErrorMessage('');
            }}
            className={`py-2 rounded-xl transition ${
              mode === 'admin'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SuperAdmin Access
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl font-medium">
              {errorMessage}
            </div>
          )}

          {mode === 'customer' ? (
            <form onSubmit={handleCustomerSubmit} className="space-y-3.5">
              {!isOtpStep ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Aarav Patel"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mobile Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="aarav.patel@flybite.in"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs rounded-xl">
                    SMS 6-Digit OTP sent to <span className="font-mono font-bold">{customerPhone}</span>.
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Enter Verification Code (Demo: 123456)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-center text-lg font-mono font-black text-amber-400 tracking-widest focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-xl text-xs transition shadow-lg flex items-center justify-center space-x-2"
              >
                <span>{isOtpStep ? 'Verify OTP & Complete Sign In' : 'Send One-Time Passcode'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  SuperAdmin Email ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@flybite.in"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Security Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-rose-500 via-amber-500 to-orange-500 text-slate-950 font-black rounded-xl text-xs transition shadow-lg flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Authenticate &amp; Launch Admin Portal</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
