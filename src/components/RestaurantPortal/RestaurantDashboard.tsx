import React from 'react';
import { useOrderStore } from '../../store/useOrderStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Utensils, Printer, CheckCircle, Zap, ShieldCheck, Clock } from 'lucide-react';

export const RestaurantDashboard: React.FC = () => {
  const orders = useOrderStore((state) => state.orders);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  const currentUser = useAuthStore((state) => state.currentUser);

  const handlePrintInvoice = (orderId: string) => {
    alert(`[FSSAI GST INVOICE] Generating tax invoice for Order #${orderId}. CGST 2.5% + SGST 2.5% applied.`);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Kitchen Banner */}
      <div className="bg-slate-900 border border-emerald-500/30 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl">
            <Utensils className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Paradise Biryani Kitchen Dashboard</h1>
            <p className="text-xs text-slate-400">Logged in as {currentUser.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>FSSAI License #11223344556677</span>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5">
            <Zap className="w-4 h-4" />
            <span>Roof Launchpad Ready</span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Incoming Kitchen Orders ({orders.length})</h2>

        {orders.length === 0 ? (
          <div className="bg-slate-900/60 p-12 text-center rounded-3xl border border-slate-800 text-slate-400 text-sm">
            No active kitchen orders right now. Waiting for customer requests!
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-mono text-amber-400 font-bold">#{order.id}</span>
                    <h3 className="text-base font-bold text-white">{order.customerName} ({order.customerPhone})</h3>
                    <p className="text-xs text-slate-400">Delivery via: {order.deliveryMode.toUpperCase()}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl text-xs text-amber-400 font-bold">
                      ₹{order.totalAmount} ({order.payment.method.toUpperCase()})
                    </span>
                    <button
                      onClick={() => handlePrintInvoice(order.id)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-xl text-xs flex items-center space-x-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>GST Bill</span>
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2 text-xs text-slate-300">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.quantity}x {item.menuItem.name} ({item.menuItem.weightGrams}g)</span>
                      <span className="font-bold">₹{item.totalPrice}</span>
                    </div>
                  ))}
                </div>

                {/* Status Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                  <div className="flex items-center space-x-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Status: {order.status.toUpperCase()}</span>
                  </div>

                  <div className="flex gap-2">
                    {order.status === 'placed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'kitchen_accepted')}
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl"
                      >
                        Accept &amp; Start Cooking
                      </button>
                    )}
                    {order.status === 'kitchen_accepted' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'drone_vectoring')}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl flex items-center space-x-1"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Dispatch to Air Corridor</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
