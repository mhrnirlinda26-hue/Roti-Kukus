# Roti Kukus Thailand — Ibu Ai Salamah
## Sistem Administrasi & Analisis Penjualan (100% Offline + APK Android)

Aplikasi kasir & administrasi mobile-first untuk usaha **Roti Kukus Thailand milik Ibu Ai Salamah**.
Data tersimpan **100% offline** di perangkat (localStorage + IndexedDB) — tidak butuh internet & tanpa server.

### ✨ Fitur Utama
1. **Penjualan Cepat (Jual)**: Input transaksi dengan harga otomatis (Rp3.000 / Rp5.000), pilihan topping, keranjang dinamis, metode bayar (Tunai, QRIS, Transfer), invoice otomatis.
2. **Dashboard / Beranda**: Omzet hari ini, jumlah transaksi, porsi terjual, peringatan stok kritis.
3. **Inventori & Stok**: Pantau bahan baku, topping, saus, kemasan, batas minimum, mutasi otomatis.
4. **Pembelian & Belanja**: Catat belanja bahan → stok bertambah otomatis.
5. **Pengeluaran Operasional**: Catat biaya non-bahan (Gas LPG, plastik, dll).
6. **Analitik & Laporan**: Tren omzet, performa varian harga, ekspor Excel (.xlsx).

---

### 📱 Cara Mendapatkan APK Android

APK di-build otomatis via **GitHub Actions** setiap push ke branch `main`:

1. Buka tab **Actions** di repository ini
2. Klik workflow **"Build Android APK"** terbaru yang sudah hijau ✅
3. Download artifact **RotiKukusThailand-APK** → extract → install `RotiKukusThailand-v1.0-debug.apk` di HP

Detail lengkap: lihat [PANDUAN-BUILD-APK.md](./PANDUAN-BUILD-APK.md)

---

### 🚀 Cara Menjalankan Lokal (Development)

```bash
cd roti-kukus-app
npm install
npm run dev
# Buka http://localhost:3000
```

### 📦 Cara Build APK Manual

```bash
cd roti-kukus-app
npm run build          # static export ke folder out/
npx cap sync android   # copy web assets ke project Android
cd android
./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

---

### 🗂️ Struktur Project

```
├── .github/workflows/build-apk.yml  # Auto-build APK di cloud
├── roti-kukus-app/                  # Aplikasi Next.js (static export)
│   ├── src/                         # Source code (app, components, services)
│   ├── android/                     # Native Android project (Capacitor)
│   ├── capacitor.config.ts          # Config Capacitor
│   └── out/                         # Hasil static export (di-ignore git)
└── prd.md                           # PRD / spesifikasi bisnis
```

### 📋 Spesifikasi Teknis

| Item | Detail |
|------|--------|
| App ID | `com.rotikukus.thailand` |
| Storage | localStorage + IndexedDB (100% offline) |
| Framework | Next.js 16 (static export) + Capacitor 8 |
| Target | Android 7.0+ (minSdk 24) |
