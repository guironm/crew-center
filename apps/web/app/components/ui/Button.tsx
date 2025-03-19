'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';

// Props for the button component
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  href?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  isActive?: boolean;
}

export default function Button({
  children,
  className = '',
  href,
  icon,
  iconPosition = 'left',
  isActive = false,
  ...props
}: ButtonProps) {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400';
  
  // Active/inactive styles
  const stateStyles = isActive 
    ? 'bg-slate-600 text-white hover:bg-slate-700' 
    : 'text-slate-800 hover:bg-slate-200';
  
  // Icon styles
  const iconSpacing = children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : '';
  
  // Combine styles
  const buttonStyles = `${baseStyles} ${stateStyles} ${className}`;
  
  // Render as Link if href is provided
  if (href) {
    return (
      <Link href={href} className={buttonStyles}>
        {icon && iconPosition === 'left' && <span className={iconSpacing}>{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className={iconSpacing}>{icon}</span>}
      </Link>
    );
  }
  
  // Otherwise render as button
  return (
    <button className={buttonStyles} {...props}>
      {icon && iconPosition === 'left' && <span className={iconSpacing}>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className={iconSpacing}>{icon}</span>}
    </button>
  );
} 