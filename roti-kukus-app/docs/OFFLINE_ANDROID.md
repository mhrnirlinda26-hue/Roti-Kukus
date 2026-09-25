# Panduan Offline Android — Roti Kukus Thailand

Aplikasi ini **100% bisa jalan offline** di HP Android dan tetap **ringan & kencang**.

## Kenapa bisa offline?

1. **App Shell di-cache Service Worker** (`public/sw.js`):
   - Halaman Beranda, Jual, Stok, dll. tersimpan di cache HP setelah dibuka 1x saat online.
   - Saat internet mati, halaman tetap terbuka instan dari cache.
   - Ada halaman darurat `offline.html` (±2KB) bila cache halaman belum ada.
2. **Data tersimpan lokal di HP** (`localStorage` via `storageService`):
   - Penjualan, stok, pembelian, pengeluaran tersimpan langsung di HP.
   - Tidak perlu internet untuk jualan, catat stok, atau lihat laporan.
   - Saat online kembali, banner hijau muncul dan dashboard me-refresh otomatis lewat event `rkt_sales_updated`.
3. **Bundle ringan**:
   - Font sistem (tanpa unduh font Google).
   - Ikon SVG (±1KB per ikon, bukan PNG besar).
   - Library Excel `xlsx` (±400KB) hanya diunduh saat tombol "Unduh Excel" diklik (dynamic import).
   - Library tak terpakai (`recharts`, `jspdf`, `date-fns`, `zod`, `react-hook-form`) tidak masuk bundle karena tidak di-import.
   - `lucide-react` di-tree-shake via `optimizePackageImports`.
   - Efek kaca dibuat hemat GPU (blur 12–14px, tanpa `background-attachment: fixed`).

## Cara memasang di HP Android (2 menit)

### Opsi A — Tombol otomatis (Chrome Android terbaru)
1. Jalankan production: `npm run build` lalu `npm start` (atau deploy ke Vercel).
2. Buka URL di Chrome HP (satu WiFi, mis. `http://192.168.1.5:3000`).
3. Banner ungu **"Pasang aplikasi di HP Android"** muncul di atas → ketuk → **Install**.
4. Ikon "Roti Kukus" muncul di layar utama → buka seperti aplikasi asli (tanpa address bar).

### Opsi B — Manual (semua Chrome Android)
1. Buka aplikasi di Chrome HP.
2. Ketuk titik tiga (⋮) → **Tambahkan ke Layar Utama / Install App**.
3. Buka dari ikon layar utama.

### Tes offline
1. Setelah terpasang & pernah dibuka 1x saat online, aktifkan **Mode Pesawat**.
2. Buka aplikasi dari ikon → harus tetap terbuka.
3. Coba catat penjualan Roti + Susu → harga otomatis Rp3.000, tersimpan, stok berkurang.
4. Matikan Mode Pesawat → banner hijau "Online kembali" muncul.

## Cara menjalankan production yang cepat di laptop (untuk diakses HP)

```powershell
cd "G:\Roti Kukus Thailand APP\roti-kukus-app"
npm run build
npm start
# Lalu di HP Chrome buka: http://<IP-LAPTOP>:3000  (contoh: http://192.168.1.5:3000)
```

Cek IP laptop: `ipconfig` → IPv4 Address.

## File terkait offline & performa

- `public/sw.js` — cache app shell + strategi Cache-First aset statis (cepat) & Network-First navigasi (fresh).
- `public/offline.html` — fallback super ringan saat cache kosong.
- `public/manifest.json` + `icon-*.svg` — syarat install di Android.
- `src/components/layout/PWARegister.tsx` — daftar SW + banner offline/online/install (in-flow, tidak menutupi header).
- `src/components/layout/InstallAppBanner.tsx` — tombol install + panduan manual di Pengaturan.
- `src/hooks/usePWA.ts` — `useOnlineStatus()` + `usePWAInstall()` tanpa dependensi tambahan.
- `src/app/(dashboard)/laporan/page.tsx` — `xlsx` di-dynamic-import agar halaman tetap ringan.
- `next.config.ts` — `compress`, `optimizePackageImports: ["lucide-react"]`, header cache SW/manifest.
- `src/app/globals.css` — blur hemat GPU + hormat `prefers-reduced-motion`.
