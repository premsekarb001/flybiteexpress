import React, { Component, ErrorInfo, ReactNode } from 'react';
import { securityService } from '../services/securityService';
import { AlertTriangle, RefreshCw, ShieldCheck } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    securityService.logAction(
      'System Error Boundary',
      'admin',
      'Unhandled Component Exception',
      '127.0.0.1',
      'high',
      `Error: ${error.message}`
    );
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-panel border border-rose-500/40 p-8 rounded-3xl text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white">Something Went Wrong</h2>
              <p className="text-xs text-slate-400">
                The application encountered an unexpected error. Don't worry, your cart & active order state are safely stored.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-rose-300 text-left overflow-x-auto">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold py-3 px-6 rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 text-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application Safe State</span>
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-500 pt-2 border-t border-slate-900">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Protected by FlyBite CTO Security Guard</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
