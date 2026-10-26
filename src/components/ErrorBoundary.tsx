import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { safeStorage } from '../utils/safeStorage';
import { STORAGE_KEY } from '../hooks/useGitProgress';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error('GitMaster crashed:', error, info.componentStack);
  }

  private handleResetData = () => {
    safeStorage.remove(STORAGE_KEY);
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-base font-bold">Что-то пошло не так</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Возможно, сохранённые данные повреждены. Попробуйте перезапустить приложение или сбросить прогресс.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition-colors"
            >
              Перезапустить
            </button>
            <button
              onClick={this.handleResetData}
              className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Сбросить данные и перезапустить
            </button>
          </div>
        </div>
      </div>
    );
  }
}
