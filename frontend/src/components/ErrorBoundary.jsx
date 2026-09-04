import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('GymForce ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 text-white">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="text-red-400" size={28} />
            </div>
            <h2 className="text-2xl font-black mb-2">Something went wrong</h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              An unexpected error occurred while loading this page. Click below to reload the dashboard.
            </p>
            {this.state.error?.message && (
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-3 mb-6 text-left overflow-x-auto">
                <p className="text-xs font-mono text-red-400">{this.state.error.message}</p>
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 bg-[#39FF14] text-gray-950 font-bold py-3.5 rounded-xl hover:bg-[#39FF14]/90 transition-all text-sm neon-glow"
            >
              <RefreshCw size={15} /> Reload Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
