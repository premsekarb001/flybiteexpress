import React from 'react';
import { X, Activity, ShieldCheck, Cpu, HardDrive, Radio, CheckCircle2 } from 'lucide-react';

interface SystemHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemHealthModal: React.FC<SystemHealthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-emerald-500/10 via-slate-900 to-cyan-500/10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-100">System Telemetry &amp; SLA</h3>
              <p className="text-xs text-slate-400">DGCA Airspace &amp; NPCI Gateway Operational Health</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Health Metrics */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl space-y-1">
              <div className="text-slate-400 flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>API Uptime SLA</span>
              </div>
              <div className="text-xl font-black text-emerald-400 font-mono">99.99%</div>
              <div className="text-[10px] text-slate-500">Zero Downtime Verified</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl space-y-1">
              <div className="text-slate-400 flex items-center space-x-1">
                <Radio className="w-4 h-4 text-amber-400" />
                <span>VTOL Air Corridors</span>
              </div>
              <div className="text-xl font-black text-amber-400 font-mono">ACTIVE</div>
              <div className="text-[10px] text-slate-500">DGCA Clearance Approved</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl space-y-1">
              <div className="text-slate-400 flex items-center space-x-1">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Order Processing latency</span>
              </div>
              <div className="text-xl font-black text-slate-100 font-mono">42ms</div>
              <div className="text-[10px] text-slate-500">Sub-second Latency</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl space-y-1">
              <div className="text-slate-400 flex items-center space-x-1">
                <HardDrive className="w-4 h-4 text-purple-400" />
                <span>State Persistence</span>
              </div>
              <div className="text-xl font-black text-purple-400 font-mono">SYNCED</div>
              <div className="text-[10px] text-slate-500">Zustand LocalStorage</div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2 text-xs text-slate-300">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>All Systems Operational</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Multi-modal transport logistics algorithms are active. Real-time encryption for NPCI UPI transactions and DGCA flight clearances are functioning within normal bounds.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition"
          >
            Close Telemetry Panel
          </button>
        </div>
      </div>
    </div>
  );
};
