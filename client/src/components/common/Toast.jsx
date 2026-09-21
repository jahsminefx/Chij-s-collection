import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

let toastFn = null;

export const showToast = (message, type = 'success', duration = 3500) => {
  if (toastFn) {
    toastFn({ message, type, duration, id: Date.now() });
  }
};

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastFn = (newToast) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, newToast.duration);
    };

    return () => {
      toastFn = null;
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <aside aria-label="Notifications" className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-4 shadow-lift border text-xs font-medium transition-all duration-300 transform translate-y-0 ${
            toast.type === 'error'
              ? 'bg-red-50 text-red-900 border-red-200'
              : toast.type === 'info'
              ? 'bg-blue-50 text-blue-900 border-blue-200'
              : 'bg-zinc-900 text-white border-zinc-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-brand-accent flex-shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-3 p-1 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </aside>
  );
}
