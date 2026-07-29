import React from 'react';
import { useOrders } from '../../context/OrderContext';
import { Order } from '../../types';
import { DELIVERY_MODE_CONFIGS } from '../../services/deliveryLogistics';
import { X, ShoppingBag, Clock, CheckCircle2, ChevronRight, KeyRound } from 'lucide-react';

interface CustomerOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder: (order: Order) => void;
}

export const CustomerOrdersModal: React.FC<CustomerOrdersModalProps> = ({ isOpen, onClose, onTrackOrder }) => {
  const { orders } = useOrders();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl glass-panel border border-slate-700 bg-slate-950 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 glow-orange">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Your Order History</h2>
              <p className="text-xs text-slate-400">FlyBite Express India • Real-time Orders Log</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500 text-2xl">
                🍱
              </div>
              <p className="text-slate-400 text-sm font-medium">No order history found yet. Place your first order!</p>
            </div>
          ) : (
            orders.map((ord) => {
              const modeCfg = DELIVERY_MODE_CONFIGS[ord.deliveryMode];
              const isDelivered = ord.status === 'delivered';
              return (
                <div
                  key={ord.id}
                  className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-lg hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div>
                      <span className="text-xs font-mono text-orange-400 font-bold">#{ord.id}</span>
                      <h3 className="text-sm font-extrabold text-white">{ord.restaurantName}</h3>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>Placed at {ord.createdAt}</span>
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                          isDelivered
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 animate-pulse'
                        }`}
                      >
                        {ord.status.replace('_', ' ')}
                      </span>
                      <p className="text-xs font-bold text-white">₹{ord.totalAmount}</p>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="text-xs text-slate-300 space-y-1">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-slate-400">
                        <span>{it.quantity}x {it.menuItem.name}</span>
                        <span className="font-mono text-slate-300">₹{it.menuItem.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <span>{modeCfg.icon}</span>
                      <span>{modeCfg.title.split(' ')[0]}</span>
                      <span className="text-[10px] text-amber-300 font-mono">OTP: {ord.landingOtp}</span>
                    </span>

                    {!isDelivered && (
                      <button
                        onClick={() => {
                          onClose();
                          onTrackOrder(ord);
                        }}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-md"
                      >
                        <span>Live Track</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
