import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed z-50 bottom-20 left-3 right-3 sm:left-auto sm:bottom-6 sm:right-6 flex items-center gap-2.5 px-4 py-2.5 bg-sheet-3 border border-ink-faint text-ink text-sm">
      <CheckCircle2 size={16} className="text-mark" />
      <span>{message}</span>
    </div>
  );
};

