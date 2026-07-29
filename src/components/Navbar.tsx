import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { INDIAN_CITIES } from '../data/mockData';
import { UserRole } from '../types';
import { SystemHealthModal } from './SystemHealthModal';
import { LoginModal } from './Auth/LoginModal';
import { CustomerOrdersModal } from './CustomerPortal/CustomerOrdersModal';
import { 
  ShoppingBag, 
  MapPin, 
  UserCheck, 
  Navigation, 
  ShieldCheck, 
  UtensilsCrossed, 
  Radio, 
  Sparkles,
  Zap,
  Activity,
  LogIn,
  Receipt,
  LogOut,
  Copy,
  Check,
  X
} from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenLiveTracker: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenLiveTracker }) => {
  const { activeRole, switchRole, selectedCity, setSelectedCity, currentUser, isLoggedIn, logout } = useAuth();
  const { totalItemsCount, totalAmount, setToastNotice } = useCart();
  const { activeOrder, setActiveOrder } = useOrders();
  
  const [isHealthOpen, setIsHealthOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const roleConfigs: Record<UserRole, { label: string; icon: React.ReactNode }> = {
    customer: { label: 'Customer Portal', icon: <ShoppingBag className="w-4 h-4" /> },
    restaurant: { label: 'Restaurant Kitchen', icon: <UtensilsCrossed className="w-4 h-4" /> },
    drone_pilot: { label: 'Drone Fleet Radar', icon: <Radio className="w-4 h-4" /> },
    admin: { label: 'SuperAdmin Audit', icon: <ShieldCheck className="w-4 h-4" /> }
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('FLYBITE50');
    setCopiedCoupon(true);
    setToastNotice('Promo code FLYBITE50 copied to clipboard!');
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      {showAnnouncement && (
        <div className="relative bg-gradient-to-r from-orange-950 via-slate-900 to-cyan-950 text-white font-bold text-[11px] py-1.5 px-4 border-b border-orange-500/30 text-center tracking-wide flex items-center justify-center space-x-2 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>PROMO UNLOCKED: Use code <button onClick={handleCopyCoupon} className="bg-orange-500/20 hover:bg-orange-500/40 border border-orange-400/50 text-amber-300 font-mono font-black px-2 py-0.5 rounded inline-flex items-center gap-1 transition-all">
            <span>FLYBITE50</span>
            {copiedCoupon ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button> for ₹150 OFF on Drone Express Delivery!</span>
          <button onClick={() => setShowAnnouncement(false)} className="absolute right-3 text-slate-500 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 shadow-2xl backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand & City Selector */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-cyan-400 flex items-center justify-center text-2xl shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-all duration-300">
                  <span className="animate-float">🚁</span>
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
                </div>
                <div>
                  <span className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                    FlyBite <span className="shimmer-text">Express</span>
                  </span>
                  <span className="block text-[10px] uppercase font-extrabold tracking-widest text-cyan-400 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 fill-cyan-400" /> DGCA Air-Express • India
                  </span>
                </div>
              </div>

              {/* City Selector */}
              <div className="hidden lg:flex items-center space-x-2 bg-slate-900/90 border border-slate-800 hover:border-orange-500/50 px-3.5 py-2 rounded-full text-xs text-slate-300 transition-all shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-slate-200 border-none outline-none focus:ring-0 cursor-pointer font-semibold"
                >
                  {INDIAN_CITIES.map((city) => (
                    <option key={city} value={city} className="bg-slate-900 text-slate-200">
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role Switcher Pills */}
            <div className="hidden md:flex items-center space-x-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
              {(Object.keys(roleConfigs) as UserRole[]).map((role) => {
                const config = roleConfigs[role];
                const isActive = activeRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => switchRole(role)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 scale-105'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : 'text-slate-500'}>
                      {config.icon}
                    </span>
                    <span>{config.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Action Icons & Active Order Tracker */}
            <div className="flex items-center space-x-3">
              
              {/* Customer Order History Shortcut */}
              {activeRole === 'customer' && (
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="hidden sm:flex items-center space-x-1.5 bg-slate-900 border border-slate-800 hover:border-orange-500/50 px-3 py-2 rounded-xl text-xs text-slate-300 font-bold transition-all"
                >
                  <Receipt className="w-4 h-4 text-orange-400" />
                  <span>My Orders</span>
                </button>
              )}

              {/* Live Drone Order Tracker Launcher */}
              {activeOrder && activeOrder.status !== 'delivered' && (
                <button
                  onClick={onOpenLiveTracker}
                  className="relative flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 hover:bg-cyan-500/30 text-cyan-300 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg glow-cyan animate-pulse-slow"
                >
                  <Navigation className="w-4 h-4 animate-spin text-cyan-400" />
                  <span className="hidden sm:inline">Drone Radar</span>
                  <span className="bg-cyan-400 text-slate-950 font-black px-1.5 py-0.5 rounded text-[10px] uppercase">
                    {activeOrder.status === 'airborne' ? 'AIRBORNE' : 'TRACK'}
                  </span>
                </button>
              )}

              {/* Cart Trigger */}
              {activeRole === 'customer' && (
                <button
                  onClick={onOpenCart}
                  className="relative flex items-center space-x-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white px-4.5 py-2.5 rounded-2xl text-sm font-extrabold shadow-lg shadow-orange-500/30 transition-all duration-200 active:scale-95 border border-orange-400/30"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Cart</span>
                  {totalItemsCount > 0 && (
                    <span className="bg-white text-orange-600 font-extrabold px-2 py-0.5 rounded-lg text-xs shadow-inner">
                      {totalItemsCount} • ₹{totalAmount}
                    </span>
                  )}
                </button>
              )}

              {/* Auth Login / User Status */}
              {!isLoggedIn ? (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs shadow-md transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login / Auth</span>
                </button>
              ) : (
                <div className="hidden xl:flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-2xl text-xs">
                  <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="text-left">
                    <p className="font-bold text-slate-200 truncate max-w-[120px]">
                      {currentUser.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-slate-400 capitalize">{activeRole}</p>
                  </div>
                  <button onClick={logout} className="ml-1 text-slate-500 hover:text-rose-400" title="Logout Session">
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      </header>

      {/* Global Auth & History Modals */}
      <SystemHealthModal isOpen={isHealthOpen} onClose={() => setIsHealthOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <CustomerOrdersModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onTrackOrder={(ord) => {
          setActiveOrder(ord);
          onOpenLiveTracker();
        }}
      />
    </>
  );
};
