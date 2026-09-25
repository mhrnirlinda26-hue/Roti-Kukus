'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Layers, BarChart2, MoreHorizontal } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Beranda', href: '/beranda', icon: Home },
    { label: 'Jual', href: '/jual', icon: ShoppingBag },
    { label: 'Stok', href: '/stok', icon: Layers },
    { label: 'Analitik', href: '/analitik', icon: BarChart2 },
    { label: 'Lainnya', href: '/lainnya', icon: MoreHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav px-2 py-1.5 max-w-md mx-auto">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-purple-700 font-extrabold scale-105'
                  : 'text-slate-400 hover:text-purple-600 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                    : 'bg-transparent'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
