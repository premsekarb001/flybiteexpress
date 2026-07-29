import React, { useState } from 'react';
import { MOCK_DRONES, MOCK_GROUND_RIDERS } from '../../data/mockData';
import { DroneTelemetry, GroundRider } from '../../types';
import { Radio, ShieldCheck, Battery, AlertTriangle, Wind, Navigation, Bike, Phone } from 'lucide-react';

export const FleetControlDashboard: React.FC = () => {
  const [drones, setDrones] = useState<DroneTelemetry[]>(MOCK_DRONES);
  const [groundRiders] = useState<GroundRider[]>(MOCK_GROUND_RIDERS);
  const [activeTab, setActiveTab] = useState<'all' | 'ground' | 'drones'>('all');

  const handleToggleClearance = (droneId: string) => {
    setDrones((prev) =>
      prev.map((d) => (d.droneId === droneId ? { ...d, dgcaClearance: !d.dgcaClearance } : d))
    );
  };

  const handleEmergencyReturn = (droneId: string) => {
    setDrones((prev) =>
      prev.map((d) => (d.droneId === droneId ? { ...d, status: 'returning', altitudeMeters: 45 } : d))
    );
    alert(`[DGCA ALERT] Emergency RTH (Return to Home) signal transmitted to Drone #${droneId}.`);
  };

  return (
    <div className="space-y-8">
      {/* Logistics Dispatch Header */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-4 glow-cyan">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-2xl">
            <Radio className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Multi-Modal Logistics Command Center</h1>
            <p className="text-xs text-slate-400">Ground Riders (Walkers, Cyclists, EV Bikers, Drivers) & Drone Air Express</p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${activeTab === 'all' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
          >
            All Fleet ({groundRiders.length + drones.length})
          </button>
          <button
            onClick={() => setActiveTab('ground')}
            className={`px-3 py-1.5 rounded-xl transition-all ${activeTab === 'ground' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
          >
            Ground Riders ({groundRiders.length})
          </button>
          <button
            onClick={() => setActiveTab('drones')}
            className={`px-3 py-1.5 rounded-xl transition-all ${activeTab === 'drones' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
          >
            Air Drones ({drones.length})
          </button>
        </div>
      </div>

      {/* Ground Fleet Section */}
      {(activeTab === 'all' || activeTab === 'ground') && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bike className="w-5 h-5 text-orange-400" />
            <span>Ground Transport Delivery Riders</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {groundRiders.map((rider) => (
              <div key={rider.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
                <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
                  <img src={rider.avatar} alt={rider.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-extrabold text-white text-sm">{rider.name.split(' ')[0]} {rider.name.split(' ')[1]}</h3>
                    <p className="text-[11px] text-orange-400 font-semibold">{rider.vehicleName}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mode:</span>
                    <span className="font-bold uppercase text-white">{rider.mode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Deliveries:</span>
                    <span className="font-bold text-emerald-400">{rider.completedOrdersCount}+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rating:</span>
                    <span className="font-bold text-amber-300">★ {rider.rating}</span>
                  </div>
                </div>

                <a
                  href={`tel:${rider.phone}`}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 border border-slate-800 block text-center"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400 inline" />
                  <span>Call {rider.phone}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drone Air Fleet Section */}
      {(activeTab === 'all' || activeTab === 'drones') && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            <span>Autonomous Air Express Drones (DGCA Sky)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {drones.map((drone) => (
              <div
                key={drone.droneId}
                className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl hover:border-cyan-500/40 transition-all"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-extrabold text-white text-base">{drone.codeName}</h3>
                    <p className="text-xs text-cyan-400 font-mono">{drone.droneId}</p>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      drone.status === 'in_transit'
                        ? 'bg-cyan-500 text-slate-950'
                        : drone.status === 'returning'
                        ? 'bg-rose-500 text-white'
                        : 'bg-emerald-500 text-slate-950'
                    }`}
                  >
                    {drone.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Battery SOC:</span>
                    <p className="font-bold text-emerald-400 text-sm">{drone.batteryPercent}%</p>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Altitude:</span>
                    <p className="font-bold text-white text-sm">{drone.altitudeMeters} M</p>
                  </div>
                </div>

                <div className="pt-2 space-y-2 border-t border-slate-800 text-xs">
                  <button
                    onClick={() => handleToggleClearance(drone.droneId)}
                    className={`w-full py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center space-x-1 transition-all ${
                      drone.dgcaClearance
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>DGCA Clearance: {drone.dgcaClearance ? 'APPROVED' : 'GROUNDED'}</span>
                  </button>

                  <button
                    onClick={() => handleEmergencyReturn(drone.droneId)}
                    className="w-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold py-2 rounded-xl flex items-center justify-center space-x-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Emergency Return To Base</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
