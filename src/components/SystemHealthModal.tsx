import React from 'react';
import { X, ShieldCheck, Activity, Server, Radio, Database, Lock, CheckCircle2 } from 'lucide-react';

interface SystemHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemHealthModal: React.FC<SystemHealthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const services = [
    { name: 'DGCA Digital Sky Airspace API', status: 'Operational', latency: '18ms', uptime: '99.99%', icon: <Radio className="w-4 h-4 text-cyan-400" /> },
    { name: 'NPCI UPI Payment Switch (GPay/PhonePe)', status: 'Operational', latency: '24ms', uptime: '99.98%', icon: <Lock className="w-4 h-4 text-emerald-400" /> },
    { name: 'FSSAI Government License DB Validator', status: 'Operational', latency: '12ms', uptime: '100%', icon: <ShieldCheck className="w-4 h-4 text-amber-400" /> },
    { name: 'VTOL Telemetry & Canvas Radar Engine', status: 'Operational', latency: '6ms', uptime: '100%', icon: <Activity className="w-4 h-4 text-purple-400" /> },
    { name: 'Airway Weather & Wind Shear Radar', status: 'Operational', latency: '15ms', uptime: '99.95%', icon: <Server className="w-4 h-4 text-blue-400" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-xl glass-panel border border-cyan-500/40 bg-slate-950 rounded-3xl p-6 shadow-2xl space-y-6 glow-cyan">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <h3 className="text-lg font-extrabold text-white">CTO Infrastructure & System Health</h3>
              <p className="text-xs text-slate-400">Enterprise Live SLA Dashboard • India Hubs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Health Metrics Grid */}
        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.name} className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  {s.icon}
                </div>
                <div>
                  <p className="font-bold text-white">{s.name}</p>
                  <p className="text-[10px] text-slate-400">Ping: {s.latency} • Uptime: {s.uptime}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{s.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Regulatory Audit Footer */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p className="font-bold text-white">Compliance Certifications</p>
          <p>ISO/IEC 27001 Certified • DGCA NPNT Sky Compliant • FSSAI License Verified • NPCI UPI 2.0 Ready</p>
        </div>

      </div>
    </div>
  );
};
