'use client';

import React from 'react';
import { BottomNav } from '@/components/layout/BottomNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between max-w-md mx-auto relative shadow-2xl overflow-x-hidden border-x border-white/60">
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
