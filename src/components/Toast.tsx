import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2 max-w-sm pointer-events-none">
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
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className="pointer-events-auto glass-panel p-3.5 rounded-2xl border border-orange-500/40 bg-slate-950/90 text-white shadow-2xl flex items-center justify-between space-x-3 text-xs animate-slide-up glow-orange">
      <div className="flex items-center space-x-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="font-bold">{toast.text}</span>
      </div>
      <button onClick={() => onDismiss(toast.id)} className="text-slate-400 hover:text-white">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
