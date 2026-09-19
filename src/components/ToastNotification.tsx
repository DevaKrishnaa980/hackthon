import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Loader2 } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'loading';
  message: string;
  detail?: string;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isLoading = toast.type === 'loading';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-xl backdrop-blur-md flex items-start space-x-3 transition-all animate-in fade-in slide-in-from-bottom-2 ${
              isSuccess
                ? 'bg-white/95 border-emerald-200 text-slate-900 shadow-emerald-500/5'
                : isError
                ? 'bg-white/95 border-rose-200 text-slate-900 shadow-rose-500/5'
                : isLoading
                ? 'bg-white/95 border-purple-200 text-slate-900 shadow-purple-500/10'
                : 'bg-white/95 border-purple-100 text-slate-900 shadow-purple-500/10'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-500" />}
              {isLoading && <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-purple-600" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 leading-snug">
                {toast.message}
              </p>
              {toast.detail && (
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  {toast.detail}
                </p>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 text-slate-400 hover:text-slate-700 hover:bg-purple-50 p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
