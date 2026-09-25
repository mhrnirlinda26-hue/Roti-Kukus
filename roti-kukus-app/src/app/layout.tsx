import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PWARegister } from '@/components/layout/PWARegister';

export const metadata: Metadata = {
  title: 'Roti Kukus Thailand — Ibu Ai Salamah',
  description:
    'Aplikasi kasir & admin Roti Kukus Thailand. Ringan, cepat, bisa offline di HP Android.',
  manifest: '/manifest.json',
  applicationName: 'Roti Kukus Thailand',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Roti Kukus',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icon-192.svg',
    apple: '/icon-192.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#7e22ce',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased text-slate-900 select-none">
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
