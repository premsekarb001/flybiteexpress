import React, { useState } from 'react';
import {
  ShoppingBag,
  Zap,
  MapPin,
  User,
  Radio,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore, useCartCalculations } from '../../store/useCartStore';
import { useLocationStore } from '../../store/useLocationStore';
import { useOrderStore } from '../../store/useOrderStore';
import { LocationModal } from './LocationModal';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenLiveTracker: () => void;
  onOpenAccountModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenLiveTracker, onOpenAccountModal }) => {
  const { currentUser } = useAuthStore();
  const { currentLocation } = useLocationStore();
  const { totalItemsCount } = useCartCalculations();
  const activeOrder = useOrderStore((state) => state.getActiveOrder());

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Left: Brand Logo & Delivery Location Switcher */}
            <div className="flex items-center space-x-6">
              {/* Brand Logo */}
              <a href="#" className="flex items-center space-x-2.5 group">
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
                    Express
                  </span>
                </div>
              </a>

              {/* Delivery Location Selector */}
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="hidden md:flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-2xl px-3.5 py-1.5 transition text-left group"
              >
                <MapPin className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
                <div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none">
                    Delivering To
                  </div>
                  <div className="text-xs font-bold text-slate-100 flex items-center space-x-1">
                    <span className="truncate max-w-[140px]">{currentLocation.label}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              </button>
            </div>

            {/* Right Consumer Controls */}
            <div className="flex items-center space-x-3">
              {/* Active Order Flight Progress Pill */}
              {activeOrder && activeOrder.status !== 'delivered' && activeOrder.status !== 'cancelled' && (
                <button
                  onClick={onOpenLiveTracker}
                  className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/40 hover:bg-amber-500/20 text-amber-300 px-3.5 py-2 rounded-2xl text-xs font-bold transition shadow-lg shadow-amber-500/5 animate-pulse"
                >
                  <Radio className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Track Live Flight</span>
                  <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] uppercase font-extrabold">
                    {activeOrder.status.replace('_', ' ')}
                  </span>
                </button>
              )}

              {/* Cart Basket Trigger */}
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

              {/* Customer Account Button */}
              <button
                onClick={onOpenAccountModal}
                className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3.5 py-2 rounded-2xl text-xs font-bold text-slate-200 transition"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">{currentUser?.name?.split(' ')[0] || 'Account'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Location Selector Modal */}
      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
    </>
  );
};
