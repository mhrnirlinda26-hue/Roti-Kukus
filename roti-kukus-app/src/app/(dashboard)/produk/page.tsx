'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { storageService } from '@/services/storageService';
import { PricingRule, Ingredient } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { Sparkles, UtensilsCrossed, ShieldAlert } from 'lucide-react';

export default function ProdukResepPage() {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    setPricingRules(storageService.getPricingRules());
    setIngredients(storageService.getIngredients());
  }, []);

  const toppings = ingredients.filter((i) => i.category === 'Topping');

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Aturan Harga & Topping" subtitle="Model pricing berbasis topping" showBack />

      <div className="p-4 space-y-4">
        {/* Aturan Bisnis Card */}
        <Card className="p-4 border-purple-200 bg-purple-50/40 space-y-2">
          <div className="flex items-center gap-2 text-purple-900 font-extrabold text-xs">
            <Sparkles size={16} className="text-purple-600" />
            <span>Aturan Penetapan Harga Otomatis</span>
          </div>
          <p className="text-[11px] text-purple-950/80 leading-relaxed font-medium">
            Harga Roti Kukus ditentukan otomatis berdasarkan jumlah jenis topping unik yang dipilih
            oleh pelanggan:
          </p>
          <div className="space-y-1.5 pt-1">
            {pricingRules.map((rule) => (
              <div
                key={rule.id}
                className="flex justify-between items-center glass p-2.5 rounded-xl border border-purple-100"
              >
                <div>
                  <span className="text-xs font-black text-slate-900">{rule.name}</span>
                  <span className="text-[10px] text-slate-500 block">
                    {rule.min_unique_toppings === 1 && rule.max_unique_toppings === 1
                      ? 'Tepat 1 jenis topping'
                      : '2 atau lebih topping berbeda'}
                  </span>
                </div>
                <span className="text-sm font-black text-purple-700">
                  {formatCurrency(rule.selling_price)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Master Topping List */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider px-1 flex items-center gap-1.5">
            <UtensilsCrossed size={14} className="text-purple-600" />
            Daftar Topping Tersedia ({toppings.length})
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {toppings.map((top) => (
              <Card key={top.id} className="p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{top.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium">Satuan: {top.base_unit}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                  Aktif
                </span>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Validasi Kasir */}
        <Card className="p-4 border-amber-200/80 bg-amber-50/60">
          <div className="flex items-start gap-2.5">
            <ShieldAlert size={18} className="text-amber-700 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-950">Validasi Penjualan</h4>
              <p className="text-[11px] text-amber-900/80 mt-0.5 leading-relaxed font-medium">
                Sistem menolak transaksi jika tidak ada topping yang dipilih. Kasir tidak dapat mengubah
                harga secara manual di alur normal penjualan untuk menjaga akurasi omzet.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
