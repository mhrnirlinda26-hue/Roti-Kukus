'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { storageService } from '@/services/storageService';
import { Expense, ExpenseCategory, PaymentMethod } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Plus, Wallet } from 'lucide-react';

export default function PengeluaranPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const [category, setCategory] = useState<ExpenseCategory>('Operasional');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Tunai');

  const categories: ExpenseCategory[] = [
    'Bahan',
    'Kemasan',
    'Gas/LPG',
    'Transportasi',
    'Operasional',
    'Peralatan',
    'Lainnya',
  ];

  useEffect(() => {
    setExpenses(storageService.getExpenses());
  }, []);

  const handleSaveExpense = () => {
    if (!description || amount <= 0) return;

    const newExpense: Expense = {
      id: 'exp-' + Date.now(),
      expense_date: new Date().toISOString().slice(0, 10),
      category,
      description,
      amount,
      payment_method: paymentMethod,
      created_at: new Date().toISOString(),
    };

    storageService.createExpense(newExpense);
    setExpenses(storageService.getExpenses());
    setIsAdding(false);
    setDescription('');
    setAmount(0);
  };

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="Pengeluaran Operasional"
        subtitle="Catat biaya di luar bahan baku"
        showBack
        rightAction={
          !isAdding && (
            <Button size="sm" onClick={() => setIsAdding(true)} className="gap-1 font-bold">
              <Plus size={14} /> Catat
            </Button>
          )
        }
      />

      <div className="p-4 space-y-4">
        {/* Total Header Glass Card */}
        <Card className="bg-rose-500/10 border-rose-200/80 p-5">
          <span className="text-[11px] font-black text-rose-900 uppercase tracking-wider block">
            Total Pengeluaran
          </span>
          <div className="text-2xl font-black text-rose-950 mt-1">
            {formatCurrency(totalExpense)}
          </div>
        </Card>

        {isAdding && (
          <Card className="border-purple-300 p-4 space-y-3 bg-purple-50/40">
            <h3 className="text-xs font-black text-slate-900">Input Pengeluaran Baru</h3>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full glass rounded-xl px-3 py-2 text-xs font-bold"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Keterangan Biaya
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full glass rounded-xl px-3 py-2 text-xs font-medium"
                placeholder="Contoh: Isi ulang Gas LPG 3kg, Plastik kresek"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Nominal (Rp)</label>
              <input
                type="number"
                min="0"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full glass rounded-xl px-3 py-2 text-xs font-black"
                placeholder="Masukkan jumlah biaya..."
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="md" fullWidth onClick={handleSaveExpense}>
                Simpan Pengeluaran
              </Button>
              <Button size="md" variant="ghost" onClick={() => setIsAdding(false)}>
                Batal
              </Button>
            </div>
          </Card>
        )}

        {/* Expenses List */}
        <div className="space-y-2">
          {expenses.length === 0 ? (
            <Card className="text-center py-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-400 flex items-center justify-center mx-auto mb-2 border border-purple-100">
                <Wallet size={22} />
              </div>
              <p className="text-xs text-slate-500 font-semibold">Belum ada catatan pengeluaran.</p>
            </Card>
          ) : (
            expenses.map((exp) => (
              <Card key={exp.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-xs font-bold text-slate-900">{exp.description}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {formatDate(exp.expense_date)} • {exp.category} ({exp.payment_method})
                  </div>
                </div>
                <div className="text-xs font-black text-rose-600">
                  {formatCurrency(exp.amount)}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
