import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-cyan-400 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/40 bg-slate-950/95 text-slate-100 glow-emerald',
    error: 'border-rose-500/40 bg-slate-950/95 text-slate-100',
    info: 'border-cyan-500/40 bg-slate-950/95 text-slate-100 glow-cyan'
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl border text-xs shadow-2xl transition-all duration-300 transform translate-x-0 ${borders[toast.type]}`}
    >
      <div className="flex items-center space-x-2.5">
        {icons[toast.type]}
        <span className="font-semibold">{toast.text}</span>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-3 text-slate-500 hover:text-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
