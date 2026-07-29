import React from 'react';
import { X, ShieldCheck, Activity, Zap, Cpu, Server, CheckCircle2 } from 'lucide-react';

interface SystemHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemHealthModal: React.FC<SystemHealthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-md glass-panel border border-emerald-500/40 bg-slate-950 rounded-3xl p-6 shadow-2xl space-y-6 glow-emerald">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">CTO System Health</h2>
              <p className="text-xs text-slate-400">FlyBite Express Infrastructure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Server className="w-4 h-4 text-emerald-400" /> API Gateway Availability
            </span>
            <span className="text-emerald-400 font-bold font-mono">99.99% SLA</span>
          </div>

          <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Zap className="w-4 h-4 text-cyan-400" /> DGCA Airspace Gateway
            </span>
            <span className="text-cyan-400 font-bold font-mono">NPNT Green Corridor</span>
          </div>

          <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> FSSAI Hygiene Validation Engine
            </span>
            <span className="text-amber-400 font-bold font-mono">Active & Certified</span>
          </div>

          <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Cpu className="w-4 h-4 text-purple-400" /> NPCI UPI 256-Bit SSL Gateway
            </span>
            <span className="text-purple-400 font-bold font-mono">Encrypted & Active</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/30">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>All operational systems functioning nominal. Zero downtime.</span>
        </div>

      </div>
    </div>
  );
};
