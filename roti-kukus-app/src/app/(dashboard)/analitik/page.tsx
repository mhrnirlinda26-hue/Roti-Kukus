'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { storageService } from '@/services/storageService';
import { Sale, Expense } from '@/types';
import { formatCurrency, formatNumber, getJakartaDateString } from '@/utils/formatters';
import {
  TrendingUp,
  Award,
  PieChart as PieIcon,
  DollarSign,
  BarChart3,
  Flame,
} from 'lucide-react';

export default function AnalitikPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    setSales(storageService.getSales());
    setExpenses(storageService.getExpenses());
  }, []);

  const validSales = sales.filter((s) => s.status !== 'cancelled');
  const totalOmzet = validSales.reduce((acc, curr) => acc + curr.total, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Transaction Count: JUMLAH RECORD TRANSAKSI AKTUAL
  const totalTransactions = validSales.length;
  const avgTransactionValue = totalTransactions > 0 ? totalOmzet / totalTransactions : 0;

  // Breakdown 1 Topping vs Mixed Topping
  let countSingle = 0;
  let omzetSingle = 0;
  let countMixed = 0;
  let omzetMixed = 0;

  // Tracking Topping Tunggal & Kombinasi Terlaris
  const singleToppingMap: Record<string, number> = {};
  const comboToppingMap: Record<string, number> = {};

  validSales.forEach((s) => {
    s.items?.forEach((item) => {
      if (item.unique_topping_count === 1) {
        countSingle += item.quantity;
        omzetSingle += item.subtotal;

        const topName = item.toppings?.[0]?.topping?.name || 'Topping';
        singleToppingMap[topName] = (singleToppingMap[topName] || 0) + item.quantity;
      } else if (item.unique_topping_count >= 2) {
        countMixed += item.quantity;
        omzetMixed += item.subtotal;

        const comboName =
          item.toppings
            ?.map((t) => t.topping?.name || 'Topping')
            .sort()
            .join(' + ') || 'Kombinasi';
        comboToppingMap[comboName] = (comboToppingMap[comboName] || 0) + item.quantity;
      }
    });
  });

  const sortedSingle = Object.entries(singleToppingMap).sort((a, b) => b[1] - a[1]);
  const sortedCombo = Object.entries(comboToppingMap).sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Analisis Penjualan" subtitle="Performa bisnis Ibu Ai" />

      <div className="p-4 space-y-4">
        {/* Ringkasan Finansial Utama Glass Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-purple-600/10 border-purple-200/80 p-4">
            <span className="text-[11px] font-extrabold text-purple-900 flex items-center gap-1">
              <TrendingUp size={14} className="text-purple-600" /> Total Omzet
            </span>
            <div className="text-xl font-black text-purple-950 mt-1">
              {formatCurrency(totalOmzet)}
            </div>
            <span className="text-[10px] text-purple-700/80 block mt-0.5 font-medium">
              {formatNumber(totalTransactions)} Transaksi
            </span>
          </Card>

          <Card className="bg-rose-500/10 border-rose-200/80 p-4">
            <span className="text-[11px] font-extrabold text-rose-900 flex items-center gap-1">
              <DollarSign size={14} className="text-rose-600" /> Pengeluaran
            </span>
            <div className="text-xl font-black text-rose-950 mt-1">
              {formatCurrency(totalExpenses)}
            </div>
            <span className="text-[10px] text-rose-700/80 block mt-0.5 font-medium">
              Biaya Operasional
            </span>
          </Card>
        </div>

        {/* Average Transaction Value */}
        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold">Rata-rata Nilai Transaksi</span>
            <div className="text-lg font-black text-purple-900 mt-0.5">
              {formatCurrency(avgTransactionValue)}
            </div>
          </div>
          <div className="p-2.5 bg-purple-100 text-purple-700 rounded-2xl shadow-sm">
            <BarChart3 size={20} />
          </div>
        </Card>

        {/* Analisis Performa 1 Topping vs Mixed Topping */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 px-1">
            <PieIcon size={14} className="text-purple-600" />
            Performa 1 Topping vs Mixed Topping
          </h3>

          <div className="grid grid-cols-2 gap-2.5">
            <Card className="p-3.5">
              <div className="text-[11px] font-bold text-slate-500">1 Topping (Rp3.000)</div>
              <div className="text-base font-black text-slate-900 mt-1">{formatNumber(countSingle)} porsi</div>
              <div className="text-xs text-purple-700 font-black mt-0.5">{formatCurrency(omzetSingle)}</div>
              <div className="text-[10px] text-slate-400 mt-1">
                {totalOmzet > 0 ? ((omzetSingle / totalOmzet) * 100).toFixed(0) : 0}% dari omzet
              </div>
            </Card>

            <Card className="p-3.5">
              <div className="text-[11px] font-bold text-slate-500">Mixed Topping (Rp5.000)</div>
              <div className="text-base font-black text-slate-900 mt-1">{formatNumber(countMixed)} porsi</div>
              <div className="text-xs text-purple-700 font-black mt-0.5">{formatCurrency(omzetMixed)}</div>
              <div className="text-[10px] text-slate-400 mt-1">
                {totalOmzet > 0 ? ((omzetMixed / totalOmzet) * 100).toFixed(0) : 0}% dari omzet
              </div>
            </Card>
          </div>
        </div>

        {/* Kombinasi & Topping Terlaris (Termasuk Susu & Kacang) */}
        <div className="space-y-3">
          <Card className="p-4 space-y-2.5">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Flame size={15} className="text-amber-500" />
              Kombinasi Topping Terlaris (Mixed)
            </h4>
            {sortedCombo.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium">Belum ada penjualan mixed topping.</p>
            ) : (
              <div className="space-y-2">
                {sortedCombo.slice(0, 5).map(([combo, qty], i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">{combo}</span>
                    <span className="font-black text-purple-700">{qty} porsi</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-4 space-y-2.5">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Award size={15} className="text-purple-600" />
              Topping Tunggal Terlaris (1 Topping)
            </h4>
            {sortedSingle.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium">Belum ada penjualan 1 topping.</p>
            ) : (
              <div className="space-y-2">
                {sortedSingle.slice(0, 5).map(([name, qty], i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">{name}</span>
                    <span className="font-black text-purple-700">{qty} porsi</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Status HPP & Margin */}
        <Card className="border-amber-200/90 bg-amber-50/70 p-4">
          <div className="flex items-start gap-2.5">
            <Award size={18} className="text-amber-700 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-950">Status Perhitungan HPP & Laba</h4>
              <p className="text-[11px] text-amber-900/80 mt-0.5 leading-relaxed">
                HPP dihitung spesifik berdasarkan topping yang dipilih pada setiap transaksi.
                Status costing tetap <strong>Pending</strong> sampai Ibu Ai memasukkan harga beli bahan di
                menu Pembelian / Stok.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
