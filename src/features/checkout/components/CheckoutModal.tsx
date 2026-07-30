import React, { useState } from 'react';
import { X, QrCode, CreditCard, Landmark, Banknote, ShieldCheck, CheckCircle, Radio, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCartStore, useCartCalculations } from '../../../store/useCartStore';
import { useLocationStore } from '../../../store/useLocationStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useOrderStore } from '../../../store/useOrderStore';
import { PaymentMethod, UPIApp } from '../../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess
}) => {
  const { items, currentRestaurant, deliveryMode, clearCart } = useCartStore();
  const { currentLocation, customPincode, customLandingPad } = useLocationStore();
  const { currentUser } = useAuthStore();
  const placeOrder = useOrderStore((state) => state.placeOrder);

  const {
    subtotal,
    discountAmount,
    gstTax,
    deliveryFee,
    droneSurgeFee,
    totalAmount
  } = useCartCalculations();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<UPIApp>('gpay');
  const [vpaHandle, setVpaHandle] = useState('aarav@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !currentRestaurant) return null;

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log('Confetti triggered');
      }

      const paymentObj = {
        method: paymentMethod,
        upiApp: paymentMethod === 'upi' ? selectedUpiApp : undefined,
        vpaHandle: paymentMethod === 'upi' ? vpaHandle : undefined,
        paidAmount: totalAmount,
        status: 'success' as const,
        transactionId: `TXN-${Date.now()}`,
        timestamp: new Date().toISOString()
      };

      const fullAddress = `${currentLocation.label}, ${currentLocation.city} (Pincode: ${customPincode})`;

      // Place order in store
      placeOrder(
        currentUser.id,
        currentUser.name,
        currentUser.phone,
        currentRestaurant.id,
        currentRestaurant.name,
        items,
        subtotal,
        discountAmount,
        gstTax,
        deliveryFee,
        droneSurgeFee,
        totalAmount,
        deliveryMode,
        fullAddress,
        paymentObj
      );

      setIsProcessing(false);
      clearCart();
      onPaymentSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">Secure Payment Checkout</h3>
              <p className="text-xs text-slate-400">256-Bit NPCI Encrypted Transaction Gateway</p>
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
          {/* Order & Address Summary Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-amber-400">
              <span>Ordering from {currentRestaurant.name}</span>
              <span>{deliveryMode === 'drone_express' ? '🚁 Air Express' : '🛵 Ground Express'}</span>
            </div>
            <div className="text-xs text-slate-300">
              Deliver to: <span className="font-semibold text-slate-100">{currentLocation.label}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Landing Pad Code: {customLandingPad}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Choose Payment Method
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition ${
                  paymentMethod === 'upi'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span className="text-xs">Instant UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition ${
                  paymentMethod === 'card'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">Credit / Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition ${
                  paymentMethod === 'netbanking'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <Landmark className="w-5 h-5" />
                <span className="text-xs">Net Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition ${
                  paymentMethod === 'cod'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-xs">Cash on Delivery</span>
              </button>
            </div>
          </div>

          {/* Specific Method Configuration View */}
          {paymentMethod === 'upi' && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-4">
              <label className="block text-xs font-semibold text-slate-300">
                Select Preferred UPI Application
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['gpay', 'phonepe', 'paytm', 'bhim'] as const).map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setSelectedUpiApp(app)}
                    className={`py-2 rounded-xl border text-xs font-bold uppercase transition ${
                      selectedUpiApp === app
                        ? 'bg-amber-500 text-slate-950 border-amber-500'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {app}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">UPI VPA Handle</label>
                <input
                  type="text"
                  value={vpaHandle}
                  onChange={(e) => setVpaHandle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="MM/YY"
                  defaultValue="08/28"
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                />
                <input
                  type="password"
                  placeholder="CVV"
                  defaultValue="•••"
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                />
              </div>
            </div>
          )}

          {/* Amount Display */}
          <div className="flex justify-between items-center p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400">Total Payable Amount</span>
            <span className="text-2xl font-black text-amber-400">₹{totalAmount}</span>
          </div>
        </div>

        {/* Submit Payment Action */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={handlePayNow}
            disabled={isProcessing}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-orange-500 hover:from-emerald-600 hover:to-orange-600 disabled:opacity-50 text-slate-950 font-black rounded-2xl text-sm transition shadow-lg flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <span>Authorizing NPCI Payment...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Pay ₹{totalAmount} &amp; Dispatch Order</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
