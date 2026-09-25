'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { storageService } from '@/services/storageService';
import { InventoryBalance, IngredientCategory } from '@/types';
import { getStockStatus, formatNumber } from '@/utils/formatters';
import { Search, Plus } from 'lucide-react';
import Link from 'next/link';

export default function StokPage() {
  const [balances, setBalances] = useState<InventoryBalance[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');

  useEffect(() => {
    setBalances(storageService.getInventoryBalances());
  }, []);

  const categories = ['Semua', 'Bahan Utama', 'Topping', 'Saus', 'Kemasan', 'Operasional'];

  const filteredBalances = balances.filter((b) => {
    if (!b.ingredient) return false;
    const matchSearch = b.ingredient.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === 'Semua' || b.ingredient.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="Inventori & Stok"
        subtitle="Pantau ketersediaan bahan"
        rightAction={
          <Link href="/pembelian">
            <Button size="sm" className="gap-1 font-bold">
              <Plus size={14} />
              Beli Bahan
            </Button>
          </Link>
        }
      />

      <div className="p-4 space-y-3.5">
        {/* Search Bar Glass */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3.5 text-purple-400" />
          <input
            type="text"
            placeholder="Cari nama bahan / topping..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full glass rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-slate-800"
          />
        </div>

        {/* Category Pills Glass */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all duration-200 ${
                categoryFilter === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                  : 'glass text-slate-600 hover:text-purple-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stock List */}
        <div className="space-y-2 pt-1">
          {filteredBalances.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-xs text-slate-500 font-semibold">Bahan tidak ditemukan.</p>
            </Card>
          ) : (
            filteredBalances.map((bal) => {
              const ing = bal.ingredient!;
              const statusInfo = getStockStatus(bal.current_quantity, ing.minimum_stock);

              return (
                <Link href={`/stok/detail?id=${ing.id}`} key={bal.id}>
                  <Card className="flex items-center justify-between py-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{ing.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${
                            statusInfo.status === 'Habis'
                              ? 'bg-rose-100 text-rose-800'
                              : statusInfo.status === 'Kritis'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {statusInfo.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Kategori: {ing.category} • Min. {formatNumber(ing.minimum_stock)} {ing.base_unit}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-purple-900">
                        {formatNumber(bal.current_quantity)}{' '}
                        <span className="text-[10px] text-purple-600 font-medium">
                          {ing.base_unit}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
