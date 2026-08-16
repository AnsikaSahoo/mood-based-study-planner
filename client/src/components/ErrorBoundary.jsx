import React from 'react';
import { AlertCircle, RotateCcw, LayoutDashboard } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled React Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div class="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center p-6 text-center">
          <div class="glass-card p-8 sm:p-10 rounded-3xl border border-rose-500/30 max-w-md w-full space-y-4 shadow-2xl">
            <div class="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto text-2xl">
              <AlertCircle size={28} />
            </div>
            <h2 class="font-display font-bold text-xl text-slate-100">Something went wrong</h2>
            <p class="text-xs text-slate-400 leading-relaxed">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>

            <div class="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                class="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-glow-purple flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} />
                Reload Page
              </button>
              <a
                href="/dashboard"
                class="w-full py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs hover:bg-slate-700 flex items-center justify-center gap-2"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
