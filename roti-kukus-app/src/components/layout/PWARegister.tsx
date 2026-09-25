'use client';

import { useEffect, useState } from 'react';
import { WifiOff, Check, Download } from 'lucide-react';
import { useOnlineStatus, usePWAInstall } from '@/hooks/usePWA';

export function PWARegister() {
  const isOnline = useOnlineStatus();
  const { canInstall, install } = usePWAInstall();
  const [showBackOnline, setShowBackOnline] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const register = () => {
        navigator.serviceWorker.register('/sw.js').catch(() => undefined);
      };
      if (document.readyState === 'complete') register();
      else window.addEventListener('load', register, { once: true });
    }
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      setShowBackOnline(true);
      const t = setTimeout(() => {
        setShowBackOnline(false);
        setWasOffline(false);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [isOnline, wasOffline]);

  // Banner dirender in-flow (sticky) agar tidak menutupi header/konten
  if (showBackOnline) {
    return (
      <div className="sticky top-0 z-50 bg-emerald-600 text-white text-[11px] font-bold py-1.5 px-3 flex items-center justify-center gap-1.5">
        <Check size={14} />
        <span>Online kembali — data tersimpan aman</span>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="sticky top-0 z-50 bg-amber-500 text-white text-[11px] font-bold py-1.5 px-3 flex items-center justify-center gap-1.5">
        <WifiOff size={14} />
        <span>Mode offline — jualan tetap jalan, tersimpan di HP</span>
      </div>
    );
  }

  if (canInstall) {
    return (
      <button
        onClick={() => install()}
        className="sticky top-0 z-50 w-full bg-purple-700 text-white text-[11px] font-bold py-1.5 px-3 flex items-center justify-center gap-1.5"
      >
        <Download size={14} />
        <span>Pasang aplikasi di HP Android (1 ketuk, bisa offline)</span>
      </button>
    );
  }

  return null;
}
