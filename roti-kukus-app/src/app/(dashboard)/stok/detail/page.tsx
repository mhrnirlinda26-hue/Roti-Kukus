'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { storageService } from '@/services/storageService';
import { Ingredient, InventoryBalance, InventoryMovement } from '@/types';
import { formatNumber, getStockStatus, formatDateTime } from '@/utils/formatters';
import { Plus, Minus, ArrowDownLeft, ArrowUpRight, History } from 'lucide-react';

function DetailStokInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';

  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [balance, setBalance] = useState<InventoryBalance | null>(null);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [showAdjust, setShowAdjust] = useState(false);
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustNote, setAdjustNote] = useState('');
  const [adjustType, setAdjustType] = useState<'adjustment_in' | 'adjustment_out'>('adjustment_in');

  useEffect(() => {
    if (!id) return;
    const ing = storageService.getIngredients().find((i) => i.id === id);
    if (ing) {
      setIngredient(ing);
      const bal = storageService.getInventoryBalances().find((b) => b.ingredient_id === id);
      setBalance(bal || null);
      const movs = storageService.getMovements().filter((m) => m.ingredient_id === id);
      setMovements(movs);
    }
  }, [id]);

  if (!ingredient || !balance) {
    return (
      <div>
        <Header title="Detail Stok" showBack />
        <div className="p-4 text-center text-xs text-slate-500 font-medium">Memuat data...</div>
      </div>
    );
  }

  const status = getStockStatus(balance.current_quantity, ingredient.minimum_stock);

  const handleSaveAdjustment = () => {
    if (adjustQty <= 0) return;
    const actualQty = adjustType === 'adjustment_in' ? adjustQty : -adjustQty;
    storageService.addMovement({
      ingredient_id: ingredient.id,
      movement_type: adjustType,
      quantity: actualQty,
      unit: ingredient.base_unit,
      note: adjustNote || 'Penyesuaian stok manual',
    });
    setBalance(storageService.getInventoryBalances().find((b) => b.ingredient_id === id) || null);
    setMovements(storageService.getMovements().filter((m) => m.ingredient_id === id));
    setShowAdjust(false);
    setAdjustQty(0);
    setAdjustNote('');
  };

  return (
    <div className="flex flex-col min-h-full">
      <Header title={ingredient.name} subtitle={ingredient.category} showBack />

      <div className="p-4 space-y-4">
        <Card className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] text-slate-500 font-semibold">Stok Saat Ini</span>
              <div className="text-3xl font-black text-slate-900 mt-0.5">
                {formatNumber(balance.current_quantity)}{' '}
                <span className="text-sm font-bold text-purple-700">{ingredient.base_unit}</span>
              </div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-xl font-black ${
              status.status === 'Habis' ? 'bg-rose-100 text-rose-800'
              : status.status === 'Kritis' ? 'bg-amber-100 text-amber-800'
              : 'bg-emerald-100 text-emerald-800'
            }`}>
              {status.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-purple-100/60 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">Batas Minimum</span>
              <span className="font-extrabold text-slate-900">{formatNumber(ingredient.minimum_stock)} {ingredient.base_unit}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">Terakhir Diperbarui</span>
              <span className="font-bold">{formatDateTime(balance.updated_at)}</span>
            </div>
          </div>
        </Card>

        <div className="flex gap-2">
          <Button fullWidth variant="outline" size="md" onClick={() => { setAdjustType('adjustment_in'); setShowAdjust(true); }} className="gap-2 font-bold text-xs">
            <Plus size={16} /> Tambah Stok
          </Button>
          <Button fullWidth variant="outline" size="md" onClick={() => { setAdjustType('adjustment_out'); setShowAdjust(true); }} className="gap-2 font-bold text-xs">
            <Minus size={16} /> Kurangi Stok
          </Button>
        </div>

        {showAdjust && (
          <Card className="border-purple-300 bg-purple-50/50 p-4 space-y-3">
            <h4 className="text-xs font-black text-slate-900">
              {adjustType === 'adjustment_in' ? 'Tambah Stok Masuk' : 'Kurangi Stok Keluar'}
            </h4>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Jumlah ({ingredient.base_unit})</label>
              <input type="number" min="0" value={adjustQty || ''} onChange={(e) => setAdjustQty(Number(e.target.value))}
                className="w-full glass rounded-xl px-3 py-2 text-xs font-black" placeholder="Masukkan jumlah..." />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Alasan / Catatan</label>
              <input type="text" value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)}
                className="w-full glass rounded-xl px-3 py-2 text-xs font-medium" placeholder="Contoh: Rusak, Kadaluarsa, Penyesuaian fisik" />
            </div>
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleSaveAdjustment} className="flex-1 font-bold">Simpan</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAdjust(false)} className="flex-1">Batal</Button>
            </div>
          </Card>
        )}

        <div className="space-y-2">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 px-1">
            <History size={14} className="text-purple-600" /> Riwayat Pergerakan Stok
          </h3>
          {movements.length === 0 ? (
            <Card className="text-center py-6">
              <p className="text-xs text-slate-400 font-medium">Belum ada riwayat pergerakan.</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {movements.map((mov) => {
                const isPositive = mov.quantity > 0;
                return (
                  <Card key={mov.id} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${isPositive ? 'bg-purple-100 text-purple-700' : 'bg-rose-100 text-rose-700'}`}>
                        {isPositive ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">{mov.note || mov.movement_type}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{formatDateTime(mov.created_at)}</div>
                      </div>
                    </div>
                    <div className={`text-xs font-black ${isPositive ? 'text-purple-700' : 'text-rose-600'}`}>
                      {isPositive ? '+' : ''}{formatNumber(mov.quantity)} {mov.unit}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DetailStokPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-xs text-slate-500">Memuat...</div>}>
      <DetailStokInner />
    </Suspense>
  );
}
