import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, isRTL } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className={`fixed z-50 flex flex-col gap-2 max-w-sm w-full p-4 pointer-events-none ${
        isRTL ? 'left-4 bottom-16 md:bottom-4' : 'right-4 bottom-16 md:bottom-4'
      }`}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 px-4 py-3 bg-[#0c342b] text-[#fdfbf7] rounded-lg shadow-xl border border-[#c5a059]/40 pointer-events-auto transition-all transform translate-y-0"
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-[#c5a059] shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#c5a059] shrink-0" />}
          <span className="text-sm font-medium leading-snug">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
