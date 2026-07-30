import React, { useState } from 'react';
import {
  ShoppingBag,
  Zap,
  MapPin,
  Shield,
  Activity,
  User,
  Radio,
  ChevronDown,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore, useCartCalculations } from '../../store/useCartStore';
import { useLocationStore } from '../../store/useLocationStore';
import { useOrderStore } from '../../store/useOrderStore';
import { LocationModal } from './LocationModal';
import { SystemHealthModal } from '../../components/SystemHealthModal';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenLiveTracker: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenLiveTracker }) => {
  const { activeRole, switchRole, currentUser } = useAuthStore();
  const { currentLocation } = useLocationStore();
  const { totalItemsCount } = useCartCalculations();
  const activeOrder = useOrderStore((state) => state.getActiveOrder());

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const rolesList: { role: UserRole; label: string; icon: string }[] = [
    { role: 'customer', label: 'Customer Portal', icon: '🍔' },
    { role: 'restaurant', label: 'Restaurant Owner', icon: '👨‍🍳' },
    { role: 'drone_pilot', label: 'Air Operations / Pilot', icon: '🚁' },
    { role: 'admin', label: 'SuperAdmin Governance', icon: '🛡️' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Left: Brand Logo & Location Switcher */}
            <div className="flex items-center space-x-6">
              {/* Brand Logo */}
              <div className="flex items-center space-x-2.5 cursor-pointer group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Zap className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
                  </div>
                </div>
                <div>
                  <span className="text-xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-slate-100 bg-clip-text text-transparent">
                    FlyBite
                  </span>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-amber-500 block -mt-1">
                    Air Express
                  </span>
                </div>
              </div>

              {/* Location Header Selector Button */}
              {activeRole === 'customer' && (
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="hidden md:flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-2xl px-3.5 py-1.5 transition text-left group"
                >
                  <MapPin className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider leading-none">
                      Delivering To
                    </div>
                    <div className="text-xs font-bold text-slate-100 flex items-center space-x-1">
                      <span className="truncate max-w-[140px]">{currentLocation.label}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                </button>
              )}
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-3">
              {/* Active Order Progress Button */}
              {activeOrder && activeOrder.status !== 'delivered' && activeOrder.status !== 'cancelled' && (
                <button
                  onClick={onOpenLiveTracker}
                  className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/40 hover:bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-lg shadow-amber-500/5 animate-pulse"
                >
                  <Radio className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Track Live Flight</span>
                  <span className="bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold">
                    {activeOrder.status.replace('_', ' ')}
                  </span>
                </button>
              )}

              {/* Cart Drawer Trigger Button */}
              {activeRole === 'customer' && (
                <button
                  onClick={onOpenCart}
                  className="relative p-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 rounded-2xl font-bold transition shadow-lg shadow-amber-500/20 flex items-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="hidden sm:inline text-xs font-black uppercase">Basket</span>
                  {totalItemsCount > 0 && (
                    <span className="bg-slate-950 text-amber-400 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center border border-amber-400/40">
                      {totalItemsCount}
                    </span>
                  )}
                </button>
              )}

              {/* System Health Icon */}
              <button
                onClick={() => setIsHealthModalOpen(true)}
                title="System Health & DGCA Telemetry"
                className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 rounded-2xl transition"
              >
                <Activity className="w-5 h-5" />
              </button>

              {/* Role Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-2 rounded-2xl text-xs font-semibold text-slate-200 transition"
                >
                  <span className="text-base">
                    {rolesList.find((r) => r.role === activeRole)?.icon || '👤'}
                  </span>
                  <span className="hidden sm:inline font-bold">
                    {rolesList.find((r) => r.role === activeRole)?.label || 'Portal'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-slate-800/80">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Switch Persona View
                      </p>
                      <p className="text-xs font-semibold text-amber-400 mt-0.5">{currentUser.name}</p>
                    </div>
                    {rolesList.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => {
                          switchRole(r.role);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center space-x-3 transition ${
                          activeRole === r.role
                            ? 'bg-amber-500/10 text-amber-400 border-l-4 border-amber-500 font-bold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-base">{r.icon}</span>
                        <span>{r.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Location Modal */}
      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />

      {/* System Health Modal */}
      <SystemHealthModal isOpen={isHealthModalOpen} onClose={() => setIsHealthModalOpen(false)} />
    </>
  );
};
