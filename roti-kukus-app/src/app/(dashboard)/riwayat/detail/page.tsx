'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { storageService } from '@/services/storageService';
import { Sale } from '@/types';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

function DetailPenjualanInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id') || '';

  const [sale, setSale] = useState<Sale | null>(null);

  useEffect(() => {
    if (!id) return;
    const s = storageService.getSales().find((item) => item.id === id);
    if (s) setSale(s);
  }, [id]);

  if (!sale) {
    return (
      <div>
        <Header title="Detail Penjualan" showBack />
        <div className="p-4 text-center text-xs text-slate-500 font-medium">Memuat transaksi...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Struk / Nota Penjualan" showBack />

      <div className="p-4 space-y-4">
        <div className="glass-card rounded-3xl p-6 shadow-xl space-y-4">
          <div className="text-center pb-3 border-b border-dashed border-purple-200">
            <h2 className="text-base font-black text-slate-900 tracking-tight">ROTI KUKUS THAILAND</h2>
            <p className="text-[11px] text-purple-700 font-bold">Ibu Ai Salamah</p>
            <div className="text-[10px] text-slate-400 mt-1 font-medium">{sale.invoice_number}</div>
            <div className="text-[10px] text-slate-400 font-medium">{formatDateTime(sale.sold_at)}</div>
          </div>

          <div className="space-y-3 py-1">
            {sale.items?.map((item, idx) => {
              const toppingNames =
                item.toppings?.map((t) => t.topping?.name || 'Topping').join(' + ') || 'Topping';
              return (
                <div key={idx} className="border-b border-purple-50 pb-2.5 last:border-b-0">
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <div className="font-extrabold text-slate-900">Roti Kukus</div>
                      <div className="text-[11px] text-purple-700 font-bold mt-0.5">Topping: {toppingNames}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {item.quantity} porsi x {formatCurrency(item.calculated_unit_price)}{' '}
                        ({item.unique_topping_count === 1 ? '1 Topping' : 'Mixed Topping'})
                      </div>
                    </div>
                    <div className="font-black text-slate-900 text-sm">{formatCurrency(item.subtotal)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-dashed border-purple-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Metode Pembayaran</span>
              <span className="font-bold text-slate-800">{sale.payment_method}</span>
            </div>
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Status</span>
              <span className="font-extrabold text-purple-700 uppercase">Sukses</span>
            </div>
            <div className="flex justify-between items-center pt-2 text-sm">
              <span className="font-black text-slate-900">Total Bayar</span>
              <span className="text-base font-black text-purple-700">{formatCurrency(sale.total)}</span>
            </div>
          </div>
        </div>

        <Button fullWidth variant="outline" size="md" onClick={() => router.back()}>
          Kembali ke Daftar Riwayat
        </Button>
      </div>
    </div>
  );
}

export default function DetailPenjualanPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-xs text-slate-500">Memuat...</div>}>
      <DetailPenjualanInner />
    </Suspense>
  );
}
