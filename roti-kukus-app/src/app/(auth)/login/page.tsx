'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Lock, Mail, Store } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('owner@rotikukusthailand.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/beranda');
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 max-w-md mx-auto relative border-x border-white/60">
      <div className="text-center mb-8">
        <div className="w-18 h-18 glass-purple rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-purple-500/30 mb-3 border border-white/40">
          <Store size={36} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Roti Kukus Thailand</h1>
        <p className="text-xs text-purple-700 font-bold mt-1">Sistem Administrasi Ibu Ai Salamah</p>
      </div>

      <div className="glass-card rounded-3xl p-6 shadow-2xl">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 px-1">Email Akun</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-purple-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 px-1">Kata Sandi</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-purple-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" fullWidth size="lg" isLoading={isLoading} className="font-extrabold">
              Masuk ke Aplikasi
            </Button>
          </div>
        </form>
      </div>

      <div className="text-center mt-8 text-[11px] text-purple-900/60 font-semibold">
        Khusus Operasional Usaha Roti Kukus Thailand Ibu Ai Salamah
      </div>
    </div>
  );
}
