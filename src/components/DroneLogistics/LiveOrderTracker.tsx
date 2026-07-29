import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { DroneRadarHUD } from './DroneRadarHUD';
import { MOCK_DRONES } from '../../data/mockData';
import { DELIVERY_MODE_CONFIGS } from '../../services/deliveryLogistics';
import { OrderStatus } from '../../types';
import { X, CheckCircle, Clock, ShieldCheck, KeyRound, PhoneCall, UserCheck, Bike, Navigation } from 'lucide-react';

interface LiveOrderTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveOrderTracker: React.FC<LiveOrderTrackerProps> = ({ isOpen, onClose }) => {
  const { activeOrder, updateOrderStatus } = useOrders();
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [otpError, setOtpError] = useState('');

  if (!isOpen || !activeOrder) return null;

  const modeConfig = DELIVERY_MODE_CONFIGS[activeOrder.deliveryMode];
  const isDrone = activeOrder.deliveryMode === 'drone_express';

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'placed', label: 'Order Placed', desc: 'Payment Authorized via UPI' },
    { key: 'kitchen_accepted', label: 'Kitchen Preparing', desc: 'FSSAI Hygiene Chef Cooking' },
    { key: 'drone_vectoring', label: isDrone ? 'Drone Vectoring' : 'Rider Assigned', desc: isDrone ? 'DGCA Green Airway Locked' : 'Navigating to Kitchen' },
    { key: 'airborne', label: isDrone ? 'Airborne Express' : 'En Route to Doorstep', desc: isDrone ? 'VTOL Drone in Transit' : `In Transit via ${modeConfig.title}` },
    { key: 'hovering_landing', label: isDrone ? 'Hovering for Drop' : 'Arrived at Location', desc: isDrone ? 'Enter 4-Digit Release OTP' : 'Share OTP with Rider' },
    { key: 'delivered', label: 'Delivered Hot', desc: 'Order Received Safely' }
  ];

  const getStepProgress = () => {
    switch (activeOrder.status) {
      case 'placed': return 15;
      case 'kitchen_accepted': return 35;
      case 'drone_vectoring': return 55;
      case 'airborne': return 75;
      case 'hovering_landing': return 90;
      case 'delivered': return 100;
      default: return 10;
    }
  };

  const handleVerifyOtp = () => {
    setOtpError('');
    if (enteredOtp === activeOrder.landingOtp) {
      setOtpSuccess(true);
      updateOrderStatus(activeOrder.id, 'delivered');
    } else {
      setOtpError('Incorrect OTP. Check 4-digit code in order details.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-3xl glass-panel border border-cyan-500/40 bg-slate-950 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 glow-cyan">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <span>{modeConfig.icon} Live {modeConfig.title} Tracker</span>
              </h2>
            </div>
            <p className="text-xs text-slate-400">Order ID: #{activeOrder.id} • {activeOrder.restaurantName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Visualizer */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-semibold">
            <span>Progress Status</span>
            <span className="text-cyan-400 font-bold uppercase">{activeOrder.status.replace('_', ' ')}</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 via-amber-400 to-cyan-400 h-full rounded-full transition-all duration-700 shadow-md"
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>
        </div>

        {/* Telemetry Display: Drone Canvas Radar OR Ground Rider Profile */}
        {isDrone ? (
          <DroneRadarHUD
            drone={activeOrder.assignedDrone || MOCK_DRONES[0]}
            flightProgress={getStepProgress()}
          />
        ) : (
          <div className="glass-panel p-6 rounded-3xl border border-orange-500/30 space-y-4 glow-orange">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={activeOrder.assignedRider?.avatar || 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80'}
                  alt="Rider"
                  className="w-12 h-12 rounded-2xl object-cover border border-orange-500/40"
                />
                <div>
                  <h3 className="font-extrabold text-white text-base">{activeOrder.assignedRider?.name || 'Vikram Singh'}</h3>
                  <p className="text-xs text-orange-400 font-semibold">{activeOrder.assignedRider?.vehicleName}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1 rounded-xl font-bold">
                  ★ {activeOrder.assignedRider?.rating || 4.9} Rating
                </span>
                <p className="text-[10px] text-slate-400 mt-1">{activeOrder.assignedRider?.completedOrdersCount || 1200}+ Deliveries</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Transport Mode</span>
                <span className="font-extrabold text-white flex items-center justify-center gap-1 mt-0.5">
                  {modeConfig.icon} {modeConfig.title.split(' ')[0]}
                </span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Estimated Arrival</span>
                <span className="font-extrabold text-cyan-400 text-sm mt-0.5">~{modeConfig.etaMinutes} Mins</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Carbon Footprint</span>
                <span className="font-extrabold text-emerald-400 text-xs mt-0.5">{modeConfig.carbonFootprint}</span>
              </div>
            </div>
          </div>
        )}

        {/* Safe Release / Delivery OTP Box */}
        <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-orange-950/40 p-5 rounded-2xl border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
              <KeyRound className="w-4 h-4" />
              <span>4-Digit {isDrone ? 'Landing Pad Release OTP' : 'Delivery Pin Code'}</span>
            </div>
            <span className="text-xl font-mono font-black text-amber-300 tracking-widest bg-slate-900 px-3 py-1 rounded-xl border border-amber-500/40">
              {activeOrder.landingOtp}
            </span>
          </div>

          <p className="text-xs text-slate-300">
            {isDrone
              ? 'Provide or enter this OTP when the drone hovers above your rooftop/lawn pad to release payload bay doors safely.'
              : 'Share this 4-digit code with your delivery rider upon arrival to receive your hot food.'}
          </p>

          {activeOrder.status === 'hovering_landing' && !otpSuccess && (
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                maxLength={4}
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                placeholder="Enter OTP"
                className="bg-slate-900 border border-slate-700 text-white font-mono text-center text-sm rounded-xl px-4 py-2 outline-none focus:border-cyan-400 w-32"
              />
              <button
                onClick={handleVerifyOtp}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-5 py-2 rounded-xl transition-all"
              >
                Verify & Receive Order
              </button>
            </div>
          )}

          {otpError && <p className="text-xs text-rose-400 font-semibold">{otpError}</p>}
          {otpSuccess && (
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/30">
              <CheckCircle className="w-4 h-4" />
              <span>Order Received Safely! Enjoy your meal.</span>
            </div>
          )}
        </div>

        {/* Support Footer */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>FSSAI Hygiene & Safety Verified Delivery</span>
          </span>
          <button className="flex items-center space-x-1 text-orange-400 hover:underline font-bold">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call Support / Rider</span>
          </button>
        </div>

      </div>
    </div>
  );
};
