'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Database, RefreshCw, Check, Smartphone } from 'lucide-react';
import { InstallAppBanner } from '@/components/layout/InstallAppBanner';
import { useOnlineStatus } from '@/hooks/usePWA';

export default function PengaturanPage() {
  const [resetSuccess, setResetSuccess] = useState(false);
  const isOnline = useOnlineStatus();

  const handleResetData = () => {
    if (confirm('Apakah Ibu Ai yakin ingin mereset data transaksi kembali ke awal?')) {
      localStorage.removeItem('rkt_sales');
      localStorage.removeItem('rkt_expenses');
      localStorage.removeItem('rkt_purchases');
      localStorage.removeItem('rkt_inventory_movements');
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Pengaturan Sistem" subtitle="Konfigurasi akun & data" showBack />

      <div className="p-4 space-y-4">
        {/* User Glass Card */}
        <Card className="p-4 flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl glass-purple text-white font-black flex items-center justify-center text-sm shadow-md shadow-purple-500/25 border border-white/40">
            AI
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900">Ibu Ai Salamah</h3>
            <span className="text-[11px] text-slate-500 block font-medium">Owner / Administrator</span>
            <span className="text-[10px] text-purple-700 font-bold bg-purple-100/70 px-2 py-0.5 rounded-full inline-block mt-1">
              Role: owner
            </span>
          </div>
        </Card>

        {/* Install di Android */}
        <Card className="p-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <Smartphone size={16} className="text-purple-600" />
            <h4 className="text-xs font-black text-slate-900">Pasang di HP Android</h4>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            Status koneksi saat ini:{' '}
            <b className={isOnline ? 'text-emerald-600' : 'text-amber-600'}>
              {isOnline ? 'Online' : 'Offline (jualan tetap jalan)'}
            </b>
            . Setelah dipasang, aplikasi bisa dibuka dari layar utama tanpa browser dan tetap
            berfungsi saat internet mati.
          </p>
          <InstallAppBanner />
        </Card>

        {/* Database & Sync Status */}
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-purple-600" />
            <h4 className="text-xs font-black text-slate-900">Mode Penyimpanan & Offline</h4>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            Aplikasi menggunakan penyimpanan offline lokal berkecepatan tinggi dengan antrean
            sinkronisasi otomatis saat terhubung ke server Supabase.
          </p>
          <div className="pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Zona Waktu Operasional:
            </span>
            <div className="text-xs font-bold text-purple-900 glass p-2 rounded-xl border border-purple-100">
              Asia/Jakarta (WIB)
            </div>
          </div>
        </Card>

        {/* Reset Storage Action */}
        <div className="glass-card rounded-2xl p-4 border-rose-200/80 bg-rose-50/50 space-y-2">
          <h4 className="text-xs font-black text-rose-950">Bersihkan Transaksi Uji Coba</h4>
          <p className="text-[11px] text-rose-900/80 leading-relaxed font-medium">
            Hapus riwayat penjualan, belanja, dan pengeluaran demo untuk memulai pembukuan bersih.
          </p>
          <Button
            size="sm"
            variant="danger"
            onClick={handleResetData}
            className="gap-2 font-bold text-xs mt-1"
          >
            <RefreshCw size={14} /> Reset Transaksi Demo
          </Button>

          {resetSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-purple-700 font-bold mt-2">
              <Check size={16} /> Berhasil dibersihkan!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
