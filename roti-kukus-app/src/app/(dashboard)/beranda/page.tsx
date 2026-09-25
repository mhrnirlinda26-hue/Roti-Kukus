'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatNumber, getJakartaDateString } from '@/utils/formatters';
import { storageService } from '@/services/storageService';
import { Sale, InventoryBalance } from '@/types';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
  Plus,
  Sparkles,
} from 'lucide-react';

export default function BerandaPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [balances, setBalances] = useState<InventoryBalance[]>([]);
  const [period, setPeriod] = useState<'today' | 'yesterday' | 'week' | 'month'>('today');

  const loadData = () => {
    setSales(storageService.getSales());
    setBalances(storageService.getInventoryBalances());
  };

  useEffect(() => {
    loadData();

    // Auto-refresh saat ada mutasi transaksi / storage event
    const handleSalesUpdate = () => {
      loadData();
    };

    window.addEventListener('rkt_sales_updated', handleSalesUpdate);
    window.addEventListener('storage', handleSalesUpdate);

    return () => {
      window.removeEventListener('rkt_sales_updated', handleSalesUpdate);
      window.removeEventListener('storage', handleSalesUpdate);
    };
  }, []);

  const todayJakarta = getJakartaDateString(new Date());

  // Filter sales based on Asia/Jakarta timezone
  const currentSales = sales.filter((s) => {
    if (s.status === 'cancelled') return false;
    const saleJakartaDate = getJakartaDateString(s.sold_at);

    if (period === 'today') {
      return saleJakartaDate === todayJakarta;
    }
    if (period === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return saleJakartaDate === getJakartaDateString(yesterday);
    }
    if (period === 'week') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      return s.sold_at >= d.toISOString();
    }
    if (period === 'month') {
      const currentMonth = todayJakarta.slice(0, 7);
      return saleJakartaDate.startsWith(currentMonth);
    }
    return true;
  });

  const omzet = currentSales.reduce((acc, curr) => acc + curr.total, 0);

  // Transaction Count: JUMLAH RECORD TRANSAKSI AKTUAL (Bukan sum quantity)
  const totalTransactions = currentSales.length;

  // Units Sold: TOTAL QUANTITY PORSI TERJUAL
  const totalUnits = currentSales.reduce(
    (acc, curr) => acc + (curr.items?.reduce((iAcc, item) => iAcc + item.quantity, 0) || 0),
    0
  );

  // Breakdown 1 Topping vs Mixed Topping
  let omzetSingle = 0;
  let unitSingle = 0;
  let omzetMixed = 0;
  let unitMixed = 0;

  currentSales.forEach((s) => {
    s.items?.forEach((item) => {
      if (item.unique_topping_count === 1) {
        unitSingle += item.quantity;
        omzetSingle += item.subtotal;
      } else if (item.unique_topping_count >= 2) {
        unitMixed += item.quantity;
        omzetMixed += item.subtotal;
      }
    });
  });

  const criticalItems = balances.filter(
    (b) => b.ingredient && b.current_quantity <= b.ingredient.minimum_stock
  );

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="Roti Kukus Thailand"
        subtitle="Ibu Ai Salamah"
        rightAction={
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-purple-500/20 border border-white/40">
            AI
          </div>
        }
      />

      <div className="p-4 space-y-4">
        {/* Period Selector Tabs */}
        <div className="flex glass p-1.5 rounded-2xl gap-1 text-xs font-bold">
          {(
            [
              { id: 'today', label: 'Hari Ini' },
              { id: 'yesterday', label: 'Kemarin' },
              { id: 'week', label: '7 Hari' },
              { id: 'month', label: 'Bulan Ini' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id)}
              className={`flex-1 py-2 rounded-xl transition-all duration-200 ${
                period === tab.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-purple-900/70 hover:text-purple-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Hero Omzet Glass Card */}
        <div className="glass-purple rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center gap-1.5 text-purple-100 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={14} className="text-purple-200" />
            <span>Omzet Penjualan</span>
          </div>

          <div className="text-3xl font-black mt-1.5 tracking-tight drop-shadow-sm">
            {formatCurrency(omzet)}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/20">
            <div>
              <span className="text-purple-200 text-[11px] block font-medium">Transaksi</span>
              <span className="text-lg font-extrabold">{formatNumber(totalTransactions)}</span>
            </div>
            <div>
              <span className="text-purple-200 text-[11px] block font-medium">Porsi Terjual</span>
              <span className="text-lg font-extrabold">{formatNumber(totalUnits)} pcs</span>
            </div>
          </div>
        </div>

        {/* Breakdown 1 Topping vs Mixed Topping Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <Card className="p-3.5 border-purple-200/80 bg-white/70">
            <span className="text-[10px] text-purple-700 font-extrabold uppercase tracking-wider block">
              1 Topping (Rp3.000)
            </span>
            <div className="text-base font-black text-slate-900 mt-1">
              {formatNumber(unitSingle)} porsi
            </div>
            <div className="text-xs font-bold text-purple-700 mt-0.5">
              {formatCurrency(omzetSingle)}
            </div>
          </Card>

          <Card className="p-3.5 border-purple-200/80 bg-white/70">
            <span className="text-[10px] text-purple-700 font-extrabold uppercase tracking-wider block">
              Mixed Topping (Rp5.000)
            </span>
            <div className="text-base font-black text-slate-900 mt-1">
              {formatNumber(unitMixed)} porsi
            </div>
            <div className="text-xs font-bold text-purple-700 mt-0.5">
              {formatCurrency(omzetMixed)}
            </div>
          </Card>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/jual">
            <Button fullWidth size="md" className="gap-2">
              <Plus size={18} />
              Catat Penjualan
            </Button>
          </Link>
          <Link href="/pembelian">
            <Button fullWidth size="md" variant="secondary" className="gap-2">
              <ShoppingBag size={18} />
              Beli Bahan
            </Button>
          </Link>
        </div>

        {/* Stock Alert Warning */}
        {criticalItems.length > 0 && (
          <div className="glass-card rounded-2xl p-4 border-amber-200/80 bg-amber-50/70">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl mt-0.5 shadow-sm">
                <AlertTriangle size={18} />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-amber-950">
                  {criticalItems.length} Bahan Menipis / Kritis!
                </h4>
                <p className="text-[11px] text-amber-900/80 mt-0.5 leading-snug">
                  {criticalItems.map((c) => c.ingredient?.name).slice(0, 3).join(', ')}
                  {criticalItems.length > 3 ? ` dan ${criticalItems.length - 3} lainnya` : ''}
                </p>
                <Link
                  href="/stok"
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-purple-700 mt-2 hover:underline"
                >
                  Cek Semua Stok <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Recent Transactions List */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Transaksi Terakhir
            </h3>
            <Link href="/riwayat" className="text-xs text-purple-700 font-bold hover:underline">
              Lihat Semua
            </Link>
          </div>

          {currentSales.length === 0 ? (
            <Card className="text-center py-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-400 flex items-center justify-center mx-auto mb-2 border border-purple-100">
                <ShoppingBag size={22} />
              </div>
              <p className="text-xs font-semibold text-slate-600">
                Belum ada penjualan untuk periode ini.
              </p>
              <Link href="/jual" className="inline-block mt-3">
                <Button size="sm">Tambah Penjualan</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-2">
              {currentSales.slice(0, 5).map((sale) => (
                <Link href={`/riwayat/${sale.id}`} key={sale.id}>
                  <Card className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">
                        {sale.invoice_number}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        {sale.items?.length || 0} item • {sale.payment_method}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-purple-700">
                        {formatCurrency(sale.total)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {new Date(sale.sold_at).toLocaleTimeString('id-ID', {
                          timeZone: 'Asia/Jakarta',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
