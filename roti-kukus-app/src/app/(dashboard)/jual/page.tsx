'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency, generateInvoiceNumber } from '@/utils/formatters';
import { calculateUnitPrice, getUniqueToppingCount } from '@/utils/pricing';
import { storageService, CreateSaleResult } from '@/services/storageService';
import { Ingredient, Sale, SaleItem, SaleItemTopping, PaymentMethod } from '@/types';
import { Plus, Minus, Trash2, CheckCircle2, ShoppingBag, Sparkles, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function JualPage() {
  const router = useRouter();
  const [toppings, setToppings] = useState<Ingredient[]>([]);

  // Selected toppings untuk item saat ini
  const [selectedToppings, setSelectedToppings] = useState<Ingredient[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Cart
  const [cart, setCart] = useState<
    Array<{
      id: string;
      toppings: Ingredient[];
      uniqueCount: number;
      unitPrice: number;
      ruleName: string;
      quantity: number;
      subtotal: number;
    }>
  >([]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Tunai');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [saleResult, setSaleResult] = useState<CreateSaleResult | null>(null);

  useEffect(() => {
    const ingredients = storageService.getIngredients();
    setToppings(ingredients.filter((i) => i.category === 'Topping' && i.is_active));
  }, []);

  // Hitung jumlah jenis topping unik & harga otomatis
  const uniqueCount = getUniqueToppingCount(selectedToppings.map((t) => t.id));
  const pricing = calculateUnitPrice(uniqueCount);

  const toggleTopping = (topping: Ingredient) => {
    setValidationError(null);
    setSelectedToppings((prev) => {
      const exists = prev.some((t) => t.id === topping.id);
      if (exists) {
        return prev.filter((t) => t.id !== topping.id);
      } else {
        return [...prev, topping];
      }
    });
  };

  const handleAddToCart = () => {
    if (selectedToppings.length === 0) {
      setValidationError('Minimal pilih 1 topping.');
      return;
    }

    const itemSubtotal = pricing.price * quantity;
    const newItem = {
      id: 'cart-' + Date.now(),
      toppings: [...selectedToppings],
      uniqueCount,
      unitPrice: pricing.price,
      ruleName: pricing.ruleName,
      quantity,
      subtotal: itemSubtotal,
    };

    setCart((prev) => [...prev, newItem]);
    setSelectedToppings([]);
    setQuantity(1);
    setValidationError(null);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalAmount = cart.reduce((acc, curr) => acc + curr.subtotal, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const invoice = generateInvoiceNumber();
    const products = storageService.getProducts();
    const baseProduct = products[0];

    const saleItems: SaleItem[] = cart.map((c) => {
      const saleItemId = 'si-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      const itemToppings: SaleItemTopping[] = c.toppings.map((top) => ({
        id: 'sit-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        sale_item_id: saleItemId,
        topping_id: top.id,
        quantity: 1,
        created_at: new Date().toISOString(),
        topping: top,
      }));

      return {
        id: saleItemId,
        sale_id: '',
        product_id: baseProduct?.id || 'prod-roti-kukus',
        quantity: c.quantity,
        unique_topping_count: c.uniqueCount,
        calculated_unit_price: c.unitPrice,
        subtotal: c.subtotal,
        recorded_hpp: null,
        created_at: new Date().toISOString(),
        product: baseProduct,
        toppings: itemToppings,
      };
    });

    const newSale: Sale = {
      id: 'sale-' + Date.now(),
      invoice_number: invoice,
      sold_at: new Date().toISOString(),
      subtotal: totalAmount,
      discount: 0,
      total: totalAmount,
      payment_method: paymentMethod,
      status: 'completed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: saleItems,
    };

    const result = storageService.createSale(newSale);
    setSaleResult(result);
    setIsSuccess(true);
    setCart([]);
  };

  if (isSuccess && saleResult) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Transaksi Berhasil" />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-3xl glass-purple flex items-center justify-center text-white mb-4 shadow-xl shadow-purple-500/30">
            <CheckCircle2 size={44} />
          </div>
          <h2 className="text-xl font-black text-slate-900">Transaksi Selesai!</h2>
          <p className="text-xs text-purple-700 font-bold mt-1">{saleResult.invoiceNumber}</p>
          <div className="text-3xl font-black text-purple-700 my-4 drop-shadow-sm">
            {formatCurrency(saleResult.total)}
          </div>

          {/* Ringkasan Akurat: Transaction Count vs Unit Quantity */}
          <div className="w-full glass-card rounded-2xl p-3.5 mb-6 text-xs text-slate-700 space-y-1.5 border border-purple-100">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-500">Porsi Terjual (Unit)</span>
              <span className="font-black text-slate-900">{saleResult.itemQuantity} porsi</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-purple-100/60">
              <span className="font-semibold text-slate-500">Total Transaksi Hari Ini</span>
              <span className="font-black text-purple-700">{saleResult.transactionCount} transaksi</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 max-w-xs mb-6 font-medium">
            Stok roti, mika, dan topping terpilih telah dikurangi otomatis dari inventori.
          </p>
          <div className="w-full space-y-2.5">
            <Button fullWidth size="lg" onClick={() => setIsSuccess(false)}>
              Transaksi Baru Lagi
            </Button>
            <Button
              fullWidth
              variant="outline"
              size="md"
              onClick={() => router.push('/beranda')}
            >
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Penjualan Baru" subtitle="Input cepat pesanan pelanggan" />

      <div className="p-4 space-y-4 pb-36">
        {/* Step 1: Base Product Display */}
        <div className="glass p-3 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-purple-700 font-extrabold uppercase tracking-wider block">
              Item Dasar
            </span>
            <div className="text-sm font-black text-slate-900">Roti Kukus Thailand</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-semibold block">Harga Otomatis</span>
            <span className="text-xs font-black text-purple-700">1 Topping = Rp3.000 | Mixed = Rp5.000</span>
          </div>
        </div>

        {/* Step 2: Pilih Topping (Termasuk Susu & Kacang) */}
        <div>
          <div className="flex justify-between items-center mb-2 px-1">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Pilih Topping
            </label>
            <span className="text-[11px] font-bold text-purple-700">
              {uniqueCount} Topping Terpilih
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {toppings.map((top) => {
              const isSelected = selectedToppings.some((t) => t.id === top.id);
              return (
                <button
                  key={top.id}
                  type="button"
                  onClick={() => toggleTopping(top)}
                  className={`p-2.5 rounded-xl text-center transition-all duration-200 ${
                    isSelected
                      ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-500/30 scale-[1.03]'
                      : 'glass text-slate-700 hover:bg-white text-xs font-medium'
                  }`}
                >
                  <span className="truncate block text-xs">{top.name}</span>
                </button>
              );
            })}
          </div>

          {validationError && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 font-bold mt-2 px-1">
              <AlertCircle size={14} /> {validationError}
            </div>
          )}
        </div>

        {/* Real-time Pricing Preview Card */}
        {selectedToppings.length > 0 && (
          <div className="glass-card rounded-2xl p-3.5 border-purple-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-purple-600 font-extrabold uppercase tracking-wider block">
                {pricing.ruleName} ({uniqueCount} jenis topping)
              </span>
              <div className="text-xs font-bold text-slate-800 mt-0.5">
                {selectedToppings.map((t) => t.name).join(' + ')}
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-purple-700">
                {formatCurrency(pricing.price)}
              </span>
              <span className="text-[10px] text-slate-400 block font-semibold">/ porsi</span>
            </div>
          </div>
        )}

        {/* Step 3: Jumlah & Tombol Tambah ke Keranjang */}
        <div className="glass p-3 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-xl bg-white border border-purple-100 flex items-center justify-center text-purple-900 shadow-sm active:scale-95"
            >
              <Minus size={16} />
            </button>
            <span className="text-base font-extrabold text-slate-900 w-6 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-xl bg-white border border-purple-100 flex items-center justify-center text-purple-900 shadow-sm active:scale-95"
            >
              <Plus size={16} />
            </button>
          </div>

          <Button
            size="md"
            onClick={handleAddToCart}
            className="gap-2 font-bold"
          >
            <Plus size={16} />
            Tambah ke Keranjang
          </Button>
        </div>

        {/* Keranjang Display */}
        <div>
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1">
            <ShoppingBag size={14} className="text-purple-600" />
            Keranjang ({cart.length} item)
          </h3>

          {cart.length === 0 ? (
            <Card className="text-center py-6">
              <p className="text-xs font-semibold text-slate-500">Keranjang masih kosong.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Pilih topping di atas lalu tekan Tambah.</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {cart.map((item) => (
                <Card key={item.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Roti + {item.toppings.map((t) => t.name).join(' + ')}
                    </div>
                    <div className="text-[11px] text-purple-700 font-semibold mt-0.5">
                      {item.quantity} porsi x {formatCurrency(item.unitPrice)}{' '}
                      <span className="text-slate-400 font-normal">({item.ruleName})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-purple-700">
                      {formatCurrency(item.subtotal)}
                    </span>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </Card>
              ))}

              {/* Payment Method Selector */}
              <div className="pt-2">
                <label className="text-[11px] font-bold text-slate-600 block mb-1.5 px-1">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Tunai', 'QRIS', 'Transfer'] as PaymentMethod[]).map((pm) => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setPaymentMethod(pm)}
                      className={`py-2 text-xs rounded-xl font-bold transition-all ${
                        paymentMethod === pm
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                          : 'glass text-slate-700 hover:bg-white'
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Glass Checkout Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto p-3.5 glass-nav border-t border-purple-200/50 shadow-2xl z-40">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold text-slate-600">Total Pembayaran</span>
            <span className="text-lg font-black text-purple-900">
              {formatCurrency(totalAmount)}
            </span>
          </div>
          <Button fullWidth size="lg" onClick={handleCheckout} className="font-extrabold text-sm">
            Simpan & Selesaikan Transaksi
          </Button>
        </div>
      )}
    </div>
  );
}
