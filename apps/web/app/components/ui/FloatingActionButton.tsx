"use client";

import { ReactNode, ButtonHTMLAttributes } from 'react';

interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  onClick?: () => void;
}

export default function FloatingActionButton({ 
  icon, 
  onClick,
  className = '',
  ...props 
}: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-25 right-6 w-16 h-16 bg-slate-600 text-white rounded-full shadow-lg hover:bg-sky-700 flex items-center justify-center transition-all duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-sky-500 z-10 ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
} 