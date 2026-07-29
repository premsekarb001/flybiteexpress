import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { deliveryLogisticsService, DELIVERY_MODE_CONFIGS } from '../../services/deliveryLogistics';
import { DeliveryMode } from '../../types';
import { X, Trash2, Scale, ShieldAlert, ChevronRight, ShoppingCart, Tag, CheckCircle2, MapPin } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToPayment: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onProceedToPayment }) => {
  const {
    items,
    currentRestaurant,
    deliveryMode,
    setDeliveryMode,
    updateQuantity,
    removeItem,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discountAmount,
    gstTax,
    deliveryFee,
    droneSurgeFee,
    totalAmount,
    totalWeightGrams
  } = useCart();

  const { currentUser } = useAuth();
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const modes: DeliveryMode[] = ['walking', 'cycling', 'bike', 'car', 'drone_express'];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ type: res.success ? 'success' : 'error', text: res.message });
  };

  const currentModeConfig = DELIVERY_MODE_CONFIGS[deliveryMode];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-slate-800 bg-slate-950 text-slate-100 flex flex-col justify-between shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-extrabold text-white">Your Food Basket</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-600 text-2xl">
                  🍱
                </div>
                <p className="text-slate-400 text-sm font-medium">Your basket is empty. Add delicious Indian food!</p>
              </div>
            ) : (
              <>
                {/* Restaurant Source & Delivery Address */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Ordering from</p>
                      <p className="font-extrabold text-white text-sm">{currentRestaurant?.name}</p>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-extrabold border border-emerald-500/30">
                      FSSAI Verified
                    </span>
                  </div>

                  <div className="flex items-start space-x-2 text-xs text-slate-300">
                    <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">{currentUser.address?.street}</p>
                      <p className="text-[10px] text-cyan-400 font-mono">
                        {deliveryMode === 'drone_express'
                          ? `Rooftop Pad ID: ${currentUser.address?.landingPadCode || 'BLR-PAD-8842'}`
                          : 'Ground Rider Drop at Doorstep'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5-Mode Delivery Transport Selector */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">
                      Choose Delivery Transport Mode
                    </label>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase">{currentModeConfig.carbonFootprint}</span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
                    {modes.map((m) => {
                      const cfg = DELIVERY_MODE_CONFIGS[m];
                      const check = deliveryLogisticsService.checkCapacity(totalWeightGrams, m);
                      const isSelected = deliveryMode === m;
                      return (
                        <button
                          key={m}
                          onClick={() => check.eligible && setDeliveryMode(m)}
                          disabled={!check.eligible}
                          className={`p-2 rounded-xl text-center transition-all border flex flex-col items-center justify-center space-y-1 ${
                            isSelected
                              ? m === 'drone_express'
                                ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg glow-cyan'
                                : 'bg-orange-500/20 border-orange-400 text-white shadow-lg'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          } ${!check.eligible ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                          title={`${cfg.title} (${cfg.etaMinutes}m • ₹${cfg.fee})`}
                        >
                          <span className="text-lg">{cfg.icon}</span>
                          <span className="text-[9px] font-extrabold uppercase truncate max-w-full">{m.replace('_express', '')}</span>
                          <span className="text-[9px] text-amber-300 font-bold">₹{cfg.fee}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Mode Banner */}
                  <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-white flex items-center gap-1.5">
                        <span className="text-base">{currentModeConfig.icon}</span>
                        <span>{currentModeConfig.title}</span>
                      </span>
                      <span className="bg-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded text-[10px]">
                        ~{currentModeConfig.etaMinutes} MINS
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{currentModeConfig.description}</p>
                  </div>

                  {/* Capacity Check Warning */}
                  {(() => {
                    const capacityCheck = deliveryLogisticsService.checkCapacity(totalWeightGrams, deliveryMode);
                    if (!capacityCheck.eligible) {
                      return (
                        <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl flex items-start space-x-2 text-rose-300 text-xs">
                          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <span>{capacityCheck.reason}</span>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Payload Weight Counter */}
                  <div className="flex items-center justify-between text-xs bg-slate-900/60 p-2.5 rounded-xl text-slate-400 border border-slate-800">
                    <span className="flex items-center space-x-1.5">
                      <Scale className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Total Payload Weight:</span>
                    </span>
                    <span className="font-bold text-white">
                      {(totalWeightGrams / 1000).toFixed(2)} kg / {currentModeConfig.maxWeightKg} kg
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3 divide-y divide-slate-800/60">
                  {items.map((item) => (
                    <div key={item.menuItem.id} className="pt-3 flex items-center justify-between">
                      <div className="flex-1 pr-2">
                        <p className="text-xs font-bold text-white">{item.menuItem.name}</p>
                        <p className="text-xs text-orange-400 font-extrabold">₹{item.menuItem.price}</p>
                      </div>

                      <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, -1)}
                          className="w-5 h-5 rounded bg-slate-800 text-slate-300 flex items-center justify-center text-xs hover:bg-slate-700"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, 1)}
                          className="w-5 h-5 rounded bg-slate-800 text-slate-300 flex items-center justify-center text-xs hover:bg-slate-700"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.menuItem.id)}
                        className="ml-3 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                    <span className="flex items-center space-x-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      <span>Apply Promo Coupon</span>
                    </span>
                    {appliedCoupon && (
                      <button onClick={removeCoupon} className="text-[10px] text-rose-400 hover:underline">
                        Remove ({appliedCoupon})
                      </button>
                    )}
                  </div>

                  {!appliedCoupon ? (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Try FLYBITE50"
                        className="bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 uppercase outline-none focus:border-amber-400 flex-1 font-mono"
                      />
                      <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition-all"
                      >
                        Apply
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{appliedCoupon} Applied! You saved ₹{discountAmount}</span>
                    </div>
                  )}

                  {couponMsg && !appliedCoupon && (
                    <p className={`text-[11px] font-semibold ${couponMsg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {couponMsg.text}
                    </p>
                  )}
                </div>

                {/* Bill Breakdown */}
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Item Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Promo Discount ({appliedCoupon})</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Restaurant GST (5%)</span>
                    <span>₹{gstTax}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>{currentModeConfig.title} Fee</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  {deliveryMode === 'drone_express' && (
                    <div className="flex justify-between text-cyan-400 font-semibold">
                      <span>Drone Air-Express Surge</span>
                      <span>₹{droneSurgeFee}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-extrabold text-white">
                    <span>Total Payable</span>
                    <span className="text-orange-400">₹{totalAmount}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout CTA */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-slate-900/90 space-y-2">
              {(() => {
                const capacityCheck = deliveryLogisticsService.checkCapacity(totalWeightGrams, deliveryMode);
                const isWeightValid = capacityCheck.eligible;
                return (
                  <>
                    {!isWeightValid && (
                      <p className="text-[11px] text-rose-400 font-semibold text-center">
                        ⚠️ Please change transport mode or reduce cart weight before proceeding.
                      </p>
                    )}
                    <button
                      onClick={onProceedToPayment}
                      disabled={!isWeightValid}
                      className={`w-full font-extrabold py-3.5 px-6 rounded-2xl shadow-xl transition-all duration-200 flex items-center justify-between group ${
                        isWeightValid
                          ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white cursor-pointer'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                      }`}
                    >
                      <span>Proceed to Pay (₹{totalAmount})</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
