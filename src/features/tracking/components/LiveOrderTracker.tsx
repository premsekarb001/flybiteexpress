import React, { useState, useEffect } from 'react';
import { X, Radio, Clock, ShieldCheck, CheckCircle2, ArrowRight, Compass, ShieldAlert, Phone, Package, Flame, AlertCircle } from 'lucide-react';
import { useOrderStore } from '../../../store/useOrderStore';
import { OrderStatus } from '../../../types';

interface LiveOrderTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveOrderTracker: React.FC<LiveOrderTrackerProps> = ({ isOpen, onClose }) => {
  const activeOrder = useOrderStore((state) => state.getActiveOrder());
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);

  const [secondsRemaining, setSecondsRemaining] = useState(720); // 12 minutes default

  const milestoneSteps: { status: OrderStatus; label: string; desc: string; icon: string }[] = [
    { status: 'placed', label: 'Order Placed', desc: 'Payment verified via NPCI', icon: '📝' },
    { status: 'kitchen_accepted', label: 'Kitchen Preparing', desc: 'Chef preparing fresh meal', icon: '🍳' },
    { status: 'drone_vectoring', label: 'Air Dispatch', desc: 'VTOL vectoring to rooftop pad', icon: '📡' },
    { status: 'airborne', label: 'Airborne Flight', desc: 'In air corridor at 120m altitude', icon: '🚁' },
    { status: 'hovering_landing', label: 'Precision Hovering', desc: 'Descending to rooftop pad', icon: '🛬' },
    { status: 'delivered', label: 'Order Delivered', desc: 'Payload released cleanly', icon: '🎉' }
  ];

  // Live countdown timer effect
  useEffect(() => {
    if (!isOpen || !activeOrder) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, activeOrder]);

  // Auto milestone simulation transition effect
  useEffect(() => {
    if (!isOpen || !activeOrder || activeOrder.status === 'delivered') return undefined;

    const statusOrder: OrderStatus[] = [
      'placed',
      'kitchen_accepted',
      'drone_vectoring',
      'airborne',
      'hovering_landing',
      'delivered'
    ];

    const currentIndex = statusOrder.indexOf(activeOrder.status);
    if (currentIndex >= 0 && currentIndex < statusOrder.length - 1) {
      const timer = setTimeout(() => {
        updateOrderStatus(activeOrder.id, statusOrder[currentIndex + 1]);
      }, 5000);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isOpen, activeOrder?.status, updateOrderStatus]);

  if (!isOpen || !activeOrder) return null;

  const currentStepIndex = milestoneSteps.findIndex((s) => s.status === activeOrder.status);
  const progressPercent = Math.round(((currentStepIndex + 1) / milestoneSteps.length) * 100);
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-amber-500/10 via-slate-900 to-orange-500/10">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-black text-slate-100">Live Flight Tracker</h3>
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-amber-500/30">
                  {activeOrder.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {activeOrder.restaurantName} • {activeOrder.deliveryMode === 'drone_express' ? 'Autonomous VTOL Drone' : 'Ground Express Rider'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Percentage Bar */}
        <div className="w-full bg-slate-950 h-2 relative">
          <div
            className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Estimated Countdown Timer & OTP Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ETA Countdown Card */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center space-x-4">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Estimated Arrival
                </div>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {minutes}m {seconds < 10 ? `0${seconds}` : seconds}s
                </div>
                <div className="text-[11px] text-slate-400">DGCA Air Corridor Verified</div>
              </div>
            </div>

            {/* Rooftop Landing Pad OTP Card */}
            <div className="bg-slate-950/80 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Landing Pad Release OTP
                </div>
                <div className="text-3xl font-black text-slate-100 font-mono tracking-widest mt-0.5">
                  {activeOrder.landingOtp}
                </div>
                <div className="text-[10px] text-slate-400">Share with landing courier or rooftop pad</div>
              </div>
              <div className="w-10 h-10 bg-amber-500 text-slate-950 rounded-xl flex items-center justify-center font-black text-lg">
                🔐
              </div>
            </div>
          </div>

          {/* Step-by-Step Milestone Tracker */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Flight Milestones &amp; Progression
              </h4>
              <span className="text-xs font-mono font-bold text-amber-400">{progressPercent}% Complete</span>
            </div>

            <div className="space-y-2">
              {milestoneSteps.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div
                    key={step.status}
                    className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                      isCurrent
                        ? 'bg-amber-500/10 border-amber-500/60 text-slate-100 shadow-lg shadow-amber-500/5'
                        : isPassed
                        ? 'bg-slate-950/40 border-slate-800/60 text-slate-300'
                        : 'bg-slate-950/20 border-slate-900 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{step.icon}</span>
                      <div>
                        <div className="text-xs font-bold flex items-center space-x-2">
                          <span>{step.label}</span>
                          {isCurrent && (
                            <span className="bg-amber-500 text-slate-950 text-[9px] uppercase font-black px-2 py-0.5 rounded-full animate-pulse">
                              IN PROGRESS
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{step.desc}</div>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs font-bold ${
                        isPassed
                          ? 'bg-amber-500 border-amber-500 text-slate-950'
                          : 'border-slate-800 text-slate-600'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Telemetry Radar HUD Card */}
          {activeOrder.assignedDrone && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                  <Compass className="w-4 h-4" />
                  <span>VTOL Telemetry Data ({activeOrder.assignedDrone.droneId})</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">LIVE FEED</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-900 p-2 rounded-xl">
                  <div className="text-[10px] text-slate-400">Altitude</div>
                  <div className="font-bold text-slate-100 font-mono">
                    {activeOrder.assignedDrone.altitudeMeters}m
                  </div>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl">
                  <div className="text-[10px] text-slate-400">Airspeed</div>
                  <div className="font-bold text-slate-100 font-mono">
                    {activeOrder.assignedDrone.speedKmh} km/h
                  </div>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl">
                  <div className="text-[10px] text-slate-400">Battery</div>
                  <div className="font-bold text-emerald-400 font-mono">
                    {activeOrder.assignedDrone.batteryPercent}%
                  </div>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl">
                  <div className="text-[10px] text-slate-400">DGCA Status</div>
                  <div className="font-bold text-amber-400 font-mono">CLEAR</div>
                </div>
              </div>
            </div>
          )}

          {/* Order Summary Items */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ordered Items
            </h4>
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
              {activeOrder.items.map((item) => (
                <div key={item.cartItemId} className="flex justify-between items-center">
                  <span className="text-slate-300">
                    {item.quantity}x {item.menuItem.name}
                  </span>
                  <span className="font-bold text-amber-400">₹{item.totalPrice}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-slate-100">
                <span>Total Amount Paid</span>
                <span className="text-amber-400 font-black">₹{activeOrder.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl text-xs transition"
          >
            Close Tracker View
          </button>
        </div>
      </div>
    </div>
  );
};
