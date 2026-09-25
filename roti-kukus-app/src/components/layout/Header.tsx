'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  rightAction,
}) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 glass border-b border-purple-100/50 px-4 py-3 max-w-md mx-auto">
      <div className="flex items-center justify-between min-h-[40px]">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-2 -ml-1 text-purple-900 hover:text-purple-600 rounded-xl hover:bg-white/80 active:scale-95 transition-all"
              aria-label="Kembali"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight">
              {title}
            </h1>
            {subtitle && <p className="text-[11px] text-purple-700/80 font-semibold">{subtitle}</p>}
          </div>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
};
