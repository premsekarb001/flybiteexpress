import React from 'react';
import { useOrders } from '../../context/OrderContext';
import { DELIVERY_MODE_CONFIGS } from '../../services/deliveryLogistics';
import { X, ShoppingBag, CheckCircle2, Clock, Navigation, Receipt, CreditCard } from 'lucide-react';

interface CustomerOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder: (order: any) => void;
}

export const CustomerOrdersModal: React.FC<CustomerOrdersModalProps> = ({ isOpen, onClose, onTrackOrder }) => {
  const { orders } = useOrders();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl glass-panel border border-slate-700 bg-slate-950 rounded-3xl p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-extrabold text-white">Your Food Order History ({orders.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Orders Feed */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No orders placed yet. Add items from restaurants to place your first order!
            </div>
          ) : (
            orders.map((ord) => {
              const modeCfg = DELIVERY_MODE_CONFIGS[ord.deliveryMode];
              return (
                <div key={ord.id} className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-orange-400">#{ord.id}</span>
                        <span className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded font-mono">
                          {ord.createdAt}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{ord.restaurantName}</h4>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Payment SUCCESS</span>
                      </span>
                      {ord.status !== 'delivered' && (
                        <button
                          onClick={() => { onClose(); onTrackOrder(ord); }}
                          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-3 py-1 rounded-xl flex items-center space-x-1"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Track Live</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-1 text-xs text-slate-300">
                    {ord.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between">
                        <span>{item.quantity}x {item.menuItem.name}</span>
                        <span className="font-mono font-bold">₹{item.menuItem.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Summary & Payment Details */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center gap-1 text-slate-300">
                        <span>{modeCfg.icon}</span>
                        <span className="font-semibold">{modeCfg.title.split(' ')[0]}</span>
                      </span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-cyan-400">TXN: {ord.payment.transactionId || 'TXN-UPI-9942'}</span>
                    </div>

                    <div className="font-extrabold text-white text-sm">
                      Total: <span className="text-orange-400 font-black">₹{ord.totalAmount}</span>
                    </div>
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
