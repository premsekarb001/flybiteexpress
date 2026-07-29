import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { INDIAN_CITIES } from '../data/mockData';
import { LoginModal } from './Auth/LoginModal';
import { SystemHealthModal } from './SystemHealthModal';
import { CustomerOrdersModal } from './CustomerPortal/CustomerOrdersModal';
import { UserRole } from '../types';
import { Zap, ShoppingBag, MapPin, Navigation, UserCheck, ShieldCheck, Activity, LogOut, Clock, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenLiveTracker: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenLiveTracker }) => {
  const { currentUser, activeRole, switchRole, isLoggedIn, logout, selectedCity, setSelectedCity } = useAuth();
  const { totalItemsCount } = useCart();
  const { activeOrder } = useOrders();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);

  const roleConfigs: Record<UserRole, { label: string; icon: string }> = {
    customer: { label: 'Customer Portal', icon: '🛍️' },
    restaurant: { label: 'Restaurant Kitchen', icon: '👨‍🍳' },
    drone_pilot: { label: 'Drone Fleet Command', icon: '🚁' },
    admin: { label: 'SuperAdmin Audit', icon: '🛡️' }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left Brand Identity & City Selector */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => switchRole('customer')}
                className="flex items-center space-x-3 group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-cyan-400 p-0.5 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Zap className="w-6 h-6 text-orange-400 fill-orange-400 group-hover:animate-bounce" />
                  </div>
                </div>

                <div className="text-left">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xl font-extrabold text-white tracking-tight">FlyBite</span>
                    <span className="text-[10px] bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      Express
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                    India Multi-Modal Air &amp; Ground
                  </p>
                </div>
              </button>

              {/* City Selection Dropdown */}
              <div className="hidden lg:flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-2xl">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-200 outline-none cursor-pointer"
                >
                  {INDIAN_CITIES.map((city) => (
                    <option key={city} value={city} className="bg-slate-900 text-slate-200">
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Staff / Admin Portal Badge (Hidden for regular customer view) */}
            {activeRole !== 'customer' && (
              <div className="flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 px-3.5 py-1.5 rounded-2xl text-xs font-bold text-purple-300">
                <span className="flex items-center space-x-1.5">
                  <span>{roleConfigs[activeRole].icon}</span>
                  <span>{roleConfigs[activeRole].label}</span>
                </span>
                <button
                  onClick={() => switchRole('customer')}
                  className="ml-2 text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-lg transition-colors font-mono"
                  title="Switch back to customer view"
                >
                  Exit Portal
                </button>
              </div>
            )}

            {/* Right Action Icons & Active Order Tracker */}
            <div className="flex items-center space-x-3">
              
              {/* System Health CTO Metric */}
              <button
                onClick={() => setIsHealthModalOpen(true)}
                className="hidden sm:flex items-center space-x-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-2 rounded-2xl transition-all"
                title="System Health & SLA Status"
              >
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>Health 99.99%</span>
              </button>

              {/* Active Order Live Tracker Launcher */}
              {activeOrder && activeOrder.status !== 'delivered' && (
                <button
                  onClick={onOpenLiveTracker}
                  className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-2xl transition-all shadow-lg animate-pulse"
                >
                  <Navigation className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Live Track Order</span>
                </button>
              )}

              {/* Order History */}
              <button
                onClick={() => setIsOrdersModalOpen(true)}
                className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all flex items-center space-x-1.5 text-xs font-bold"
                title="Order History"
              >
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="hidden md:inline">Orders</span>
              </button>

              {/* Cart Button with Counter */}
              <button
                onClick={onOpenCart}
                className="relative p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white transition-all flex items-center justify-center group"
                title="Food Basket"
              >
                <ShoppingBag className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* Auth Profile / Login Button */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 pl-3 rounded-2xl">
                  <div className="text-left">
                    <p className="text-xs font-extrabold text-white leading-none">{currentUser.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-cyan-400 font-mono capitalize">{activeRole}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-lg transition-all flex items-center space-x-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Log In</span>
                </button>
              )}

            </div>
          </div>
        </div>
      </nav>

      {/* Global Modals */}
      <LoginModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <SystemHealthModal isOpen={isHealthModalOpen} onClose={() => setIsHealthModalOpen(false)} />
      <CustomerOrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        onTrackOrder={() => {
          setIsOrdersModalOpen(false);
          onOpenLiveTracker();
        }}
      />
    </>
  );
};
