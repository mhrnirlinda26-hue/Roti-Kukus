'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { storageService } from '@/services/storageService';
import { Sale, Expense, InventoryBalance } from '@/types';
import { formatCurrency, formatNumber, formatDate } from '@/utils/formatters';
import { Download, Calendar, Sparkles } from 'lucide-react';

export default function LaporanPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<InventoryBalance[]>([]);

  useEffect(() => {
    setSales(storageService.getSales());
    setExpenses(storageService.getExpenses());
    setBalances(storageService.getInventoryBalances());
  }, []);

  const validSales = sales.filter((s) => s.status !== 'cancelled');
  const totalOmzet = validSales.reduce((acc, curr) => acc + curr.total, 0);
  const totalPengeluaran = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Transaction Count: JUMLAH RECORD TRANSAKSI AKTUAL
  const totalTransactions = validSales.length;

  // Units Sold: TOTAL QUANTITY PORSI TERJUAL
  const totalUnit = validSales.reduce(
    (acc, curr) => acc + (curr.items?.reduce((iAcc, item) => iAcc + item.quantity, 0) || 0),
    0
  );

  const [exporting, setExporting] = useState(false);

  const handleExportExcel = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      // Dynamic import: library berat (±400KB) hanya diunduh saat tombol diklik,
      // halaman Laporan tetap ringan & cepat dibuka di HP.
      const XLSX = await import('xlsx');
    const salesData = validSales.map((s) => ({
      'No Invoice': s.invoice_number,
      'Waktu Transaksi (WIB)': formatDate(s.sold_at),
      'Topping Digunakan': s.items
        ?.map((i) => i.toppings?.map((t) => t.topping?.name).join(' + '))
        .join('; '),
      'Porsi (Unit)': s.items?.reduce((acc, i) => acc + i.quantity, 0),
      'Metode Bayar': s.payment_method,
      'Total (Rp)': s.total,
      Status: s.status,
    }));

    const expenseData = expenses.map((e) => ({
      Tanggal: e.expense_date,
      Kategori: e.category,
      Keterangan: e.description,
      'Nominal (Rp)': e.amount,
      'Metode Bayar': e.payment_method,
    }));

    const stockData = balances.map((b) => ({
      'Nama Bahan': b.ingredient?.name,
      Kategori: b.ingredient?.category,
      'Stok Saat Ini': b.current_quantity,
      Satuan: b.ingredient?.base_unit,
      'Stok Minimal': b.ingredient?.minimum_stock,
    }));

    const wb = XLSX.utils.book_new();
    const wsSales = XLSX.utils.json_to_sheet(salesData);
    const wsExpenses = XLSX.utils.json_to_sheet(expenseData);
    const wsStock = XLSX.utils.json_to_sheet(stockData);

    XLSX.utils.book_append_sheet(wb, wsSales, 'Penjualan');
    XLSX.utils.book_append_sheet(wb, wsExpenses, 'Pengeluaran');
    XLSX.utils.book_append_sheet(wb, wsStock, 'Stok Bahan');

    XLSX.writeFile(wb, `Laporan_Roti_Kukus_Thailand_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch {
      alert('Gagal menyiapkan file Excel. Coba lagi saat online.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Laporan & Ekspor" subtitle="Unduh ringkasan data usaha" showBack />

      <div className="p-4 space-y-4">
        {/* Ringkasan Kumulatif Glass Card */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-purple-100/60 pb-3">
            <Calendar size={16} className="text-purple-600" />
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Ringkasan Kumulatif Usaha
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">Total Omzet</span>
              <span className="text-sm font-black text-purple-700">
                {formatCurrency(totalOmzet)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">Total Pengeluaran</span>
              <span className="text-sm font-black text-rose-600">
                {formatCurrency(totalPengeluaran)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">Total Transaksi</span>
              <span className="text-sm font-black text-slate-900">
                {formatNumber(totalTransactions)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">Total Unit Terjual</span>
              <span className="text-sm font-black text-slate-900">
                {formatNumber(totalUnit)} pcs
              </span>
            </div>
          </div>
        </Card>

        {/* Export Card Glass */}
        <Card className="p-5 space-y-3 border-purple-200/80 bg-purple-500/10">
          <div>
            <h3 className="text-xs font-extrabold text-purple-950 flex items-center gap-1.5">
              <Sparkles size={14} className="text-purple-600" />
              Unduh Laporan Excel / CSV
            </h3>
            <p className="text-[11px] text-purple-900/80 mt-1 leading-relaxed font-medium">
              Dapatkan berkas spreadsheet lengkap berisi rekapan transaksi penjualan, pengeluaran,
              dan ketersediaan stok bahan baku (termasuk Susu dan Kacang).
            </p>
          </div>

          <Button
            fullWidth
            size="md"
            onClick={handleExportExcel}
            isLoading={exporting}
            className="gap-2 font-black"
          >
            <Download size={16} />
            {exporting ? 'Menyiapkan...' : 'Unduh Excel (.xlsx)'}
          </Button>
        </Card>
      </div>
    </div>
  );
}
