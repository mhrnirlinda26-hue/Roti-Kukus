'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none select-none';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 h-8',
    md: 'text-sm px-5 py-2.5 h-11',
    lg: 'text-base px-6 py-3.5 h-13',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25 border border-white/20',
    secondary:
      'bg-white/80 hover:bg-white text-purple-900 border border-purple-100 shadow-sm backdrop-blur-md',
    danger:
      'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-md shadow-red-500/20',
    outline:
      'border border-purple-200/80 bg-white/60 hover:bg-white/90 text-purple-900 shadow-sm backdrop-blur-md',
    ghost:
      'bg-transparent hover:bg-purple-100/60 text-purple-800',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Memuat...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
