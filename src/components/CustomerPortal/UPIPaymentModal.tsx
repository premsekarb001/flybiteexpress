import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { securityService } from '../../services/securityService';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, ShieldCheck, QrCode, CreditCard, Banknote, Smartphone, Lock, Sparkles } from 'lucide-react';

interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const UPIPaymentModal: React.FC<UPIPaymentModalProps> = ({ isOpen, onClose, onPaymentSuccess }) => {
  const { totalAmount, subtotal, discountAmount, appliedCoupon, gstTax, deliveryFee, droneSurgeFee, items, currentRestaurant, deliveryMode, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { createOrder } = useOrders();

  const [paymentTab, setPaymentTab] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [selectedUPIApp, setSelectedUPIApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [vpaHandle, setVpaHandle] = useState('aarav.sharma@okaxis');
  const [upiPin, setUpiPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const quickVPAs = [
    'aarav.sharma@okaxis',
    '9876543210@paytm',
    'sharma@ybl'
  ];

  const handlePayNow = () => {
    setErrorMsg('');

    if (paymentTab === 'upi') {
      if (!securityService.validateUPIVPA(vpaHandle)) {
        setErrorMsg('Invalid UPI VPA handle. Example: username@okbank');
        return;
      }
      if (upiPin.length !== 4 && upiPin.length !== 6) {
        setErrorMsg('Please enter a valid 4-digit or 6-digit UPI PIN.');
        return;
      }
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const transactionId = securityService.generateTransactionId();

      // Create new active order
      createOrder(
        currentUser.id,
        currentUser.name,
        currentUser.phone,
        currentRestaurant?.id || 'rest-1',
        currentRestaurant?.name || 'Paradise Biryani',
        items,
        subtotal,
        discountAmount,
        gstTax,
        deliveryFee,
        droneSurgeFee,
        totalAmount,
        deliveryMode,
        currentUser.address?.street || 'Bellandur Bangalore',
        {
          method: paymentTab,
          upiApp: selectedUPIApp,
          vpaHandle,
          transactionId,
          paidAmount: totalAmount,
          status: 'success',
          timestamp: new Date().toLocaleTimeString('en-IN')
        }
      );

      // Trigger celebration confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      clearCart();
      onPaymentSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-lg glass-panel border border-slate-700 bg-slate-950 rounded-3xl p-6 shadow-2xl space-y-6 glow-orange">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-lg font-extrabold text-white">Secure Gateway • India</h3>
              <p className="text-xs text-slate-400">NPCI Encrypted 256-Bit SSL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount & Savings Banner */}
        <div className="bg-gradient-to-r from-orange-950/70 via-slate-900 to-cyan-950/70 p-4.5 rounded-2xl border border-orange-500/40 flex items-center justify-between shadow-inner">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Payable Amount</p>
            <p className="text-2xl font-black text-white">₹{totalAmount}</p>
            {discountAmount > 0 && (
              <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Saved ₹{discountAmount} with {appliedCoupon}
              </p>
            )}
          </div>
          <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs px-3 py-1.5 rounded-full font-extrabold">
            {deliveryMode === 'drone_express' ? '🚁 Drone Air Express' : '🛵 Ground Delivery'}
          </span>
        </div>

        {/* Payment Options Tabs */}
        <div className="grid grid-cols-4 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setPaymentTab('upi')}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center space-x-1 transition-all ${
              paymentTab === 'upi' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>UPI / QR</span>
          </button>
          <button
            onClick={() => setPaymentTab('card')}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center space-x-1 transition-all ${
              paymentTab === 'card' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setPaymentTab('netbanking')}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center space-x-1 transition-all ${
              paymentTab === 'netbanking' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>NetBank</span>
          </button>
          <button
            onClick={() => setPaymentTab('cod')}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center space-x-1 transition-all ${
              paymentTab === 'cod' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>COD</span>
          </button>
        </div>

        {/* UPI Details Content */}
        {paymentTab === 'upi' && (
          <div className="space-y-4">
            {/* App Selectors */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'gpay', name: 'Google Pay', color: 'border-blue-500/50 bg-blue-500/10 text-blue-300' },
                { id: 'phonepe', name: 'PhonePe', color: 'border-purple-500/50 bg-purple-500/10 text-purple-300' },
                { id: 'paytm', name: 'Paytm UPI', color: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300' },
                { id: 'bhim', name: 'BHIM UPI', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' }
              ].map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedUPIApp(app.id as any)}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    selectedUPIApp === app.id ? `${app.color} ring-2 ring-orange-500` : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {app.name}
                </button>
              ))}
            </div>

            {/* VPA Handle Input & Quick Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Enter Virtual Payment Address (VPA)</label>
              <input
                type="text"
                value={vpaHandle}
                onChange={(e) => setVpaHandle(e.target.value)}
                placeholder="username@okaxis"
                className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl p-3 outline-none focus:border-orange-500 font-mono"
              />

              <div className="flex items-center space-x-1.5 pt-1">
                <span className="text-[10px] text-slate-500 font-bold">Quick Select:</span>
                {quickVPAs.map((vpa) => (
                  <button
                    key={vpa}
                    onClick={() => setVpaHandle(vpa)}
                    className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-md font-mono"
                  >
                    {vpa}
                  </button>
                ))}
              </div>
            </div>

            {/* UPI PIN Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-orange-400" />
                <span>Enter 4-Digit UPI PIN</span>
              </label>
              <input
                type="password"
                maxLength={6}
                value={upiPin}
                onChange={(e) => setUpiPin(e.target.value)}
                placeholder="••••"
                className="w-full bg-slate-900 border border-slate-700 text-white text-center text-xl font-mono tracking-widest rounded-xl p-2.5 outline-none focus:border-orange-500"
              />
            </div>
          </div>
        )}

        {paymentTab === 'card' && (
          <div className="space-y-3 text-xs">
            <input type="text" placeholder="Card Number (4532 •••• •••• 8842)" className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl outline-none" />
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="MM/YY" className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl outline-none" />
              <input type="password" maxLength={3} placeholder="CVV" className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl outline-none" />
            </div>
          </div>
        )}

        {paymentTab === 'netbanking' && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((b) => (
              <button key={b} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-bold hover:border-orange-500 text-left">
                {b}
              </button>
            ))}
          </div>
        )}

        {paymentTab === 'cod' && (
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
            <p className="font-bold text-white">Cash / UPI on Delivery</p>
            <p>You can pay via UPI QR code directly to the Drone Landing Operator or Delivery Associate upon arrival.</p>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Submit Pay CTA */}
        <button
          onClick={handlePayNow}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <span className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying UPI PIN with NPCI Bank Gateway...</span>
            </span>
          ) : (
            <>
              <CheckCircle2 className="w-4.5 h-4.5" />
              <span>Authorize & Launch Delivery (₹{totalAmount})</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};
