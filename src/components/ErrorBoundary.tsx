import React, { Component, ErrorInfo, ReactNode } from 'react';
import { securityService } from '../services/securityService';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    securityService.logAction(
      'System Error Boundary',
      'admin',
      'React Exception Caught',
      '127.0.0.1',
      'high',
      `Error: ${error.message} | Component Stack: ${errorInfo.componentStack?.slice(0, 150)}`
    );
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-rose-500/40 text-center space-y-4 glow-rose">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-extrabold text-white">Something Went Wrong</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our safety exception system intercepted a runtime glitch. The error has been logged to the security audit trail.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
