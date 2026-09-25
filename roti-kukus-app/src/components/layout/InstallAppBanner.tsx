'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Download, Check, Loader2 } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWA';

export function InstallAppBanner({ compact = false }: { compact?: boolean }) {
  const { canInstall, isInstalled, install } = usePWAInstall();
  const [loading, setLoading] = useState(false);

  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
        <Check size={14} />
        <span>Aplikasi sudah terpasang — bisa dibuka offline dari layar utama</span>
      </div>
    );
  }

  if (!canInstall) {
    return (
      <div className="text-[11px] text-slate-500 leading-relaxed bg-white/60 border border-purple-100 rounded-xl px-3 py-2.5">
        <span className="font-bold text-slate-700 block mb-0.5">Cara pasang di Android:</span>
        Buka di Chrome → titik tiga (⋮) → <b>Tambahkan ke Layar Utama / Install App</b>. Setelah itu aplikasi bisa dibuka tanpa browser &amp; tetap jalan saat offline.
      </div>
    );
  }

  return (
    <Button
      fullWidth={!compact}
      size={compact ? 'sm' : 'md'}
      className="gap-2 font-bold"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await install();
        setLoading(false);
      }}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      Pasang Aplikasi di HP
    </Button>
  );
}
