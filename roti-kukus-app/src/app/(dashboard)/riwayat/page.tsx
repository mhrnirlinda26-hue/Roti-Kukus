'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { storageService } from '@/services/storageService';
import { Sale } from '@/types';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { Search, ShoppingBag, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function RiwayatPenjualanPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSales(storageService.getSales());
  }, []);

  const filteredSales = sales.filter((s) =>
    s.invoice_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Riwayat Penjualan" subtitle="Daftar semua transaksi" showBack />

      <div className="p-4 space-y-3">
        {/* Search Glass */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3.5 text-purple-400" />
          <input
            type="text"
            placeholder="Cari nomor nota / invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full glass rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          />
        </div>

        {/* Sales List */}
        <div className="space-y-2 pt-1">
          {filteredSales.length === 0 ? (
            <Card className="text-center py-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-400 flex items-center justify-center mx-auto mb-2 border border-purple-100">
                <ShoppingBag size={22} />
              </div>
              <p className="text-xs text-slate-500 font-semibold">Tidak ada transaksi ditemukan.</p>
            </Card>
          ) : (
            filteredSales.map((sale) => (
              <Link href={`/riwayat/detail?id=${sale.id}`} key={sale.id}>
                <Card className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-xs font-black text-slate-900">{sale.invoice_number}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {sale.items?.length || 0} item • {sale.payment_method}
                    </div>
                    <div className="text-[10px] text-slate-400">{formatDateTime(sale.sold_at)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-xs font-black text-purple-700">
                        {formatCurrency(sale.total)}
                      </div>
                      <span className="text-[9px] px-2 py-0.5 bg-purple-100 text-purple-800 font-extrabold rounded-md">
                        Selesai
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-purple-400" />
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
