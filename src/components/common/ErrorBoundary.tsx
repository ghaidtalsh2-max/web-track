import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../services/supabase';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetSession = () => {
    const finish = () => {
      try {
        sessionStorage.clear();
      } catch (e) {
        console.warn('Storage clear error', e);
      }
      window.location.href = window.location.pathname;
    };
    supabase.auth.signOut().then(finish, finish);
  };

  public render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.message || 'حدث خطأ غير معروف أثناء تشغيل المكون.';

      return (
        <div
          dir="rtl"
          className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 font-sans"
        >
          <div className="max-w-lg w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center relative overflow-hidden">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853]" />

            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle size={32} />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {this.props.fallbackTitle || 'عذراً، حدث خطأ غير متوقع'}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              تم حماية التطبيق من الانهيار ومنع ظهور الشاشة البيضاء. بياناتك وجلستك في أمان تام.
            </p>

            {/* Error Message Box */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs font-mono text-rose-300 text-left mb-6 overflow-x-auto select-all max-h-32">
              <code>{errorMsg}</code>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                إعادة المحاولة الآن
              </button>

              <button
                type="button"
                onClick={this.handleResetSession}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-all border border-slate-600/50 flex items-center justify-center gap-2"
              >
                <Home size={16} />
                العودة للرئيسية وتسجيل الدخول
              </button>
            </div>

            {/* Stack trace toggle for developers */}
            {this.state.errorInfo && (
              <div className="mt-6 pt-4 border-t border-slate-700/60 text-right">
                <button
                  type="button"
                  onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                  className="text-xs text-slate-400 hover:text-slate-300 flex items-center gap-1 mx-auto"
                >
                  {this.state.showDetails ? (
                    <>
                      إخفاء التفاصيل الفنية <ChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      عرض تفاصيل الخطأ البرمجي <ChevronDown size={14} />
                    </>
                  )}
                </button>

                {this.state.showDetails && (
                  <pre className="mt-3 p-3 bg-slate-950/80 rounded-lg text-[10px] font-mono text-slate-400 text-left overflow-auto max-h-48 whitespace-pre-wrap">
                    {this.state.error?.stack}
                    {'\nComponent Stack:'}
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
