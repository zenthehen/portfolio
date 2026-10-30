import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-panel-2 border border-gold text-cream font-mono text-xs shadow-2xl animate-in slide-in-from-bottom-5">
      <CheckCircle2 size={16} className="text-bull" />
      <span>{message}</span>
    </div>
  );
};
