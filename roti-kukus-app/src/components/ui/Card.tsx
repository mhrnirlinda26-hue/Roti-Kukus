'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-4 transition-all duration-200 ${
        onClick ? 'cursor-pointer active:scale-[0.99] hover:bg-white/90' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
