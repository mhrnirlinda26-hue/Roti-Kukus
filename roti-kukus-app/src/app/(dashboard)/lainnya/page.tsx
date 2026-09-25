'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import {
  UtensilsCrossed,
  ShoppingBag,
  DollarSign,
  FileSpreadsheet,
  Settings,
  ChevronRight,
  History,
  Sparkles,
} from 'lucide-react';

export default function LainnyaPage() {
  const menuSections = [
    {
      title: 'Operasional & Menu',
      items: [
        { label: 'Produk & Resep', href: '/produk', icon: UtensilsCrossed, color: 'text-purple-700 bg-purple-100/70' },
        { label: 'Riwayat Penjualan', href: '/riwayat', icon: History, color: 'text-indigo-700 bg-indigo-100/70' },
        { label: 'Pembelian Bahan', href: '/pembelian', icon: ShoppingBag, color: 'text-blue-700 bg-blue-100/70' },
        { label: 'Pengeluaran Lainnya', href: '/pengeluaran', icon: DollarSign, color: 'text-rose-700 bg-rose-100/70' },
      ],
    },
    {
      title: 'Laporan & Pengaturan',
      items: [
        { label: 'Laporan Usaha & Export', href: '/laporan', icon: FileSpreadsheet, color: 'text-purple-700 bg-purple-100/70' },
        { label: 'Pengaturan Sistem', href: '/pengaturan', icon: Settings, color: 'text-slate-700 bg-slate-100' },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Menu Lainnya" subtitle="Kelola data usaha" />

      <div className="p-4 space-y-4">
        {menuSections.map((sec) => (
          <div key={sec.title} className="space-y-1.5">
            <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider px-1">
              {sec.title}
            </h3>
            <div className="glass-card rounded-2xl overflow-hidden divide-y divide-purple-100/50">
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between p-3.5 hover:bg-white/80 active:bg-white transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-2xl ${item.color} shadow-sm`}>
                        <Icon size={18} />
                      </div>
                      <span className="text-xs font-extrabold text-slate-800">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-purple-400" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div className="text-center pt-6 pb-2">
          <p className="text-xs font-black text-slate-800">Roti Kukus Thailand — Ibu Ai Salamah</p>
          <p className="text-[10px] text-purple-700 font-semibold mt-0.5">Glassmorphism Edition • Versi 1.0</p>
        </div>
      </div>
    </div>
  );
}
