# Roti Kukus Thailand — Ibu Ai Salamah
## Sistem Administrasi & Analisis Penjualan (PWA Mobile-First)

Aplikasi administrasi dan analisis penjualan berbasis mobile-first yang dirancang khusus untuk operasional harian usaha **Roti Kukus Thailand milik Ibu Ai Salamah**.

### ✨ Fitur Utama
1. **Penjualan Cepat (Jual)**: Input transaksi dengan preset varian harga (Rp3.000 / Rp5.000), pilihan topping, keranjang dinamis, metode bayar (Tunai, QRIS, Transfer), dan invoice otomatis.
2. **Dashboard / Beranda**: Informasi real-time omzet hari ini, jumlah transaksi, porsi terjual, peringatan stok kritis, dan shortcut aksi.
3. **Inventori & Stok**: Pemantauan bahan baku, topping, saus, kemasan, batas minimum stok, status aman/kritis, dan mutasi stok otomatis (Inventory Movement).
4. **Resep & Komposisi HPP**: Pengaturan resep per varian harga untuk estimasi HPP akurat dan pengurangan stok otomatis saat penjualan.
5. **Pembelian & Belanja**: Pencatatan belanja bahan baku yang otomatis menambah stok gudang.
6. **Pengeluaran Operasional**: Pencatatan biaya non-bahan (Gas LPG, plastik, transportasi, dsb).
7. **Analitik Penjualan**: Evaluasi performa varian harga (Rp3.000 vs Rp5.000), rata-rata nilai transaksi, dan tren omzet.
8. **Laporan & Ekspor**: Unduh laporan lengkap rekapitulasi penjualan, pengeluaran, dan stok bahan dalam format Excel (.xlsx).
9. **PWA & Offline Support**: Siap diinstal di layar utama (Add to Home Screen) HP Android Ibu Ai dan mendukung penyimpanan data lokal.

---

### 🚀 Cara Menjalankan Lokal

```bash
# Pindah ke direktori aplikasi
cd roti-kukus-app

# Install dependencies
npm install

# Jalankan server development
npm run dev
```

Buka peramban di: `http://localhost:3000`

---

### 🗄️ Database & Supabase Migration
File migrasi PostgreSQL dan seed data master awal tersedia pada:
- `src/supabase/migrations/01_initial_schema.sql` (Skema tabel, RLS, Indexes)
- `src/supabase/migrations/02_seed_data.sql` (Data produk awal & bahan baku)
