'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { storageService } from '@/services/storageService';
import { Purchase, Ingredient, PurchaseItem } from '@/types';
import { formatCurrency, generatePurchaseNumber, formatDate } from '@/utils/formatters';
import { Plus, ShoppingCart } from 'lucide-react';

export default function PembelianPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const [isAdding, setIsAdding] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [purchaseNote, setPurchaseNote] = useState('');

  useEffect(() => {
    setPurchases(storageService.getPurchases());
    const ings = storageService.getIngredients();
    setIngredients(ings);
    if (ings.length > 0) {
      setSelectedIngredientId(ings[0].id);
    }
  }, []);

  const handleSavePurchase = () => {
    const ing = ingredients.find((i) => i.id === selectedIngredientId);
    if (!ing || quantity <= 0 || unitPrice < 0) return;

    const subtotal = quantity * unitPrice;
    const poNumber = generatePurchaseNumber();

    const newPurchaseItem: PurchaseItem = {
      id: 'pi-' + Date.now(),
      purchase_id: '',
      ingredient_id: ing.id,
      quantity,
      unit: ing.base_unit,
      unit_price: unitPrice,
      subtotal,
      created_at: new Date().toISOString(),
      ingredient: ing,
    };

    const newPurchase: Purchase = {
      id: 'po-' + Date.now(),
      purchase_number: poNumber,
      purchased_at: new Date().toISOString().slice(0, 10),
      subtotal,
      total: subtotal,
      payment_status: 'paid',
      note: purchaseNote,
      created_at: new Date().toISOString(),
      items: [newPurchaseItem],
    };

    storageService.createPurchase(newPurchase);
    setPurchases(storageService.getPurchases());
    setIsAdding(false);
    setQuantity(1);
    setUnitPrice(0);
    setPurchaseNote('');
  };

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="Pembelian Bahan"
        subtitle="Tambah stok via belanja"
        showBack
        rightAction={
          !isAdding && (
            <Button size="sm" onClick={() => setIsAdding(true)} className="gap-1 font-bold">
              <Plus size={14} /> Tambah
            </Button>
          )
        }
      />

      <div className="p-4 space-y-4">
        {isAdding && (
          <Card className="border-purple-300 p-4 space-y-3 bg-purple-50/40">
            <h3 className="text-xs font-black text-slate-900">Catat Belanja Bahan Baru</h3>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Pilih Bahan</label>
              <select
                value={selectedIngredientId}
                onChange={(e) => setSelectedIngredientId(e.target.value)}
                className="w-full glass rounded-xl px-3 py-2 text-xs font-bold"
              >
                {ingredients.map((ing) => (
                  <option key={ing.id} value={ing.id}>
                    {ing.name} ({ing.base_unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Jumlah</label>
                <input
                  type="number"
                  min="1"
                  value={quantity || ''}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full glass rounded-xl px-3 py-2 text-xs font-black"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Harga Total (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  value={unitPrice || ''}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="w-full glass rounded-xl px-3 py-2 text-xs font-black"
                  placeholder="Total biaya..."
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Catatan / Tempat Beli (Opsional)
              </label>
              <input
                type="text"
                value={purchaseNote}
                onChange={(e) => setPurchaseNote(e.target.value)}
                className="w-full glass rounded-xl px-3 py-2 text-xs font-medium"
                placeholder="Contoh: Pasar Baru, Agen Toko Roti"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="md" fullWidth onClick={handleSavePurchase}>
                Simpan & Tambah Stok
              </Button>
              <Button size="md" variant="ghost" onClick={() => setIsAdding(false)}>
                Batal
              </Button>
            </div>
          </Card>
        )}

        {/* Purchase History */}
        <div className="space-y-2">
          {purchases.length === 0 ? (
            <Card className="text-center py-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-400 flex items-center justify-center mx-auto mb-2 border border-purple-100">
                <ShoppingCart size={22} />
              </div>
              <p className="text-xs text-slate-500 font-semibold">Belum ada riwayat pembelian.</p>
            </Card>
          ) : (
            purchases.map((po) => (
              <Card key={po.id} className="p-3.5 space-y-1.5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-black text-slate-900">{po.purchase_number}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {formatDate(po.purchased_at)}
                    </span>
                  </div>
                  <span className="text-xs font-black text-purple-700">
                    {formatCurrency(po.total)}
                  </span>
                </div>

                {po.items?.map((item) => (
                  <div key={item.id} className="text-[11px] text-slate-600 flex justify-between">
                    <span>
                      {item.ingredient?.name || 'Bahan'}: {item.quantity} {item.unit}
                    </span>
                    <span className="text-slate-400 font-semibold">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}

                {po.note && <p className="text-[10px] text-slate-400 italic">Catatan: {po.note}</p>}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
