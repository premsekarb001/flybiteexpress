import React, { useState } from 'react';
import { Tag, Sparkles, Check, X, Info } from 'lucide-react';
import { useCartStore, useCartCalculations } from '../../../store/useCartStore';

export const CartSummary: React.FC = () => {
  const { appliedCoupon, applyCoupon, removeCoupon, deliveryMode } = useCartStore();
  const {
    subtotal,
    discountAmount,
    gstTax,
    deliveryFee,
    droneSurgeFee,
    totalAmount
  } = useCartCalculations();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    const res = applyCoupon(promoCodeInput);
    setPromoFeedback(res);
    if (res.success) {
      setPromoCodeInput('');
    }
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        Bill Breakdown &amp; Fees
      </h4>

      {/* Item Subtotal */}
      <div className="space-y-2 text-xs font-medium">
        <div className="flex justify-between text-slate-300">
          <span>Item Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        {/* Promo Discount */}
        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-400 font-bold">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Promo Discount ({appliedCoupon})</span>
            </span>
            <span>-₹{discountAmount}</span>
          </div>
        )}

        {/* Delivery Fee */}
        <div className="flex justify-between text-slate-300">
          <span>Delivery &amp; Logistics Fee</span>
          <span>{deliveryFee > 0 ? `₹${deliveryFee}` : 'FREE'}</span>
        </div>

        {/* Drone Air Surge */}
        {deliveryMode === 'drone_express' && (
          <div className="flex justify-between text-amber-400 font-medium">
            <span className="flex items-center space-x-1">
              <span>Rooftop Drone Air Surge</span>
              <Info className="w-3 h-3 text-slate-500" />
            </span>
            <span>{droneSurgeFee > 0 ? `₹${droneSurgeFee}` : 'WAIVED'}</span>
          </div>
        )}

        {/* GST Tax */}
        <div className="flex justify-between text-slate-400">
          <span>Government GST (5%)</span>
          <span>₹{gstTax}</span>
        </div>
      </div>

      {/* Promo Code Input Box */}
      <div className="pt-3 border-t border-slate-800">
        {appliedCoupon ? (
          <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-2xl text-xs text-emerald-400 font-bold">
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4" />
              <span>Coupon {appliedCoupon} applied!</span>
            </div>
            <button
              onClick={removeCoupon}
              className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                placeholder="Promo Code (FLYBITE50)"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 uppercase focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition"
              >
                Apply
              </button>
            </div>
            {promoFeedback && (
              <p
                className={`text-[11px] font-semibold ${
                  promoFeedback.success ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {promoFeedback.message}
              </p>
            )}
          </form>
        )}
      </div>

      {/* Total Amount Payable */}
      <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-slate-100">
        <div>
          <div className="text-xs text-slate-400">Total Payable</div>
          <div className="text-[10px] text-emerald-400 font-semibold">Inclusive of all taxes &amp; fees</div>
        </div>
        <div className="text-2xl font-black text-amber-400">₹{totalAmount}</div>
      </div>
    </div>
  );
};
