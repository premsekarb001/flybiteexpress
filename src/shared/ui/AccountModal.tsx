import React from 'react';
import { X, User, Phone, Mail, MapPin, Package, Shield, LogOut, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useLocationStore } from '../../store/useLocationStore';
import { UserRole } from '../../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole?: (role: UserRole) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onSelectRole }) => {
  const { currentUser, activeRole, switchRole } = useAuthStore();
  const { currentLocation, customLandingPad } = useLocationStore();
  const orders = useOrderStore((state) => state.orders);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-100">{currentUser.name}</h3>
              <p className="text-xs text-slate-400">{currentUser.phone}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Account Details */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Email Address</span>
              </span>
              <span className="font-semibold text-slate-200">{currentUser.email}</span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
              <span className="text-slate-400 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Default Address</span>
              </span>
              <span className="font-semibold text-slate-200 truncate max-w-[160px]">
                {currentLocation.label}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
              <span className="text-slate-400 flex items-center space-x-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Rooftop Air Pad</span>
              </span>
              <span className="font-mono text-amber-400 font-bold">{customLandingPad}</span>
            </div>
          </div>

          {/* Past Orders Count */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100">Order History</div>
                <div className="text-[11px] text-slate-400">{orders.length} Completed Orders</div>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400 font-mono">ACTIVE</span>
          </div>

          {/* Merchant & Operations Portal Access */}
          <div className="space-y-2 pt-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Management &amp; Merchant Portals
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  switchRole('restaurant');
                  onClose();
                }}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                  activeRole === 'restaurant'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>Merchant Portal</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => {
                  switchRole('admin');
                  onClose();
                }}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                  activeRole === 'admin'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>SuperAdmin</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={() => {
              switchRole('customer');
              onClose();
            }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Switch to Customer Food Discovery</span>
          </button>
        </div>
      </div>
    </div>
  );
};
