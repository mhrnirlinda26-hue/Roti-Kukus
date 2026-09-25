# PRD — Sistem Administrasi & Analisis Penjualan
## Roti Kukus Thailand — Ibu Ai Salamah

**Dokumen:** `prd.md`  
**Versi:** 2.1 (Revisi Bug Transaction Count, Timezone Asia/Jakarta & Master Topping Susu + Kacang)  
**Status:** Ready for implementation  
**Platform utama:** Android mobile web / PWA  
**Target pengguna utama:** Owner usaha, Ibu Ai Salamah  
**Prioritas:** Operasional harian cepat, administrasi sederhana, stok akurat, analisis penjualan yang mudah dipahami

---

# 1. Definisi Metrik Bisnis Utama

Untuk mencegah kesalahan perhitungan di seluruh aplikasi, definisi metrik usaha ditetapkan secara mutlak:

1. **Transaction Count (`transaction_count`)**:
   - Dihitung dari **jumlah record transaksi/sale unik** yang berhasil disimpan (`COUNT(*)` record penjualan non-cancelled).
   - **TIDAK BOLEH** dihitung dari `SUM(quantity)`.
   - Contoh: 1 transaksi berisi 2 porsi Cokelat dan 1 porsi Keju menghasilkan **Transaction Count = 1** dan **Units Sold = 3**.
2. **Units Sold / Porsi Terjual (`units_sold`)**:
   - Dihitung dari akumulasi total kuantitas porsi roti yang terjual (`SUM(quantity)` item penjualan).
3. **Omzet / Revenue (`revenue`)**:
   - Dihitung dari akumulasi nilai total penjualan (`SUM(total)`).
4. **Timezone Operasional**:
   - Seluruh filter tanggal transaksi (Hari Ini, Kemarin, dsb) wajib menggunakan zona waktu **`Asia/Jakarta` (WIB)**, bukan tanggal UTC mentah.

---

# 2. Master Topping & Pricing Rules

### 2.1 Master Topping Lengkap
Topping aktif yang tersedia untuk operasional usaha:
- Cokelat
- Green Tea
- Tiramisu
- Blueberry
- Strawberry
- Red Velvet
- Sosis
- Baso
- Mentega
- Keju
- Jagung
- **Susu** *(Topping Baru)*
- **Kacang** *(Topping Baru)*

Status costing awal untuk topping baru adalah `costing_pending` sampai owner memasukkan harga beli dan takaran resep.

### 2.2 Aturan Harga Berbasis Distinct Topping
Harga per porsi ditentukan secara otomatis oleh sistem:
- **Tepat 1 jenis topping berbeda** $\rightarrow$ **Rp3.000 / porsi**
  - *Contoh:* Roti + Susu (Rp3.000), Roti + Kacang (Rp3.000), Roti + Cokelat (Rp3.000).
- **2 atau lebih jenis topping berbeda (Mixed Topping)** $\rightarrow$ **Rp5.000 / porsi**
  - *Contoh:* Roti + Susu + Kacang (Rp5.000), Roti + Cokelat + Susu (Rp5.000), Roti + Keju + Kacang (Rp5.000).
- **Validasi Wajib:** Transaksi tanpa topping ditolak (*"Minimal pilih 1 topping"*).
- Kasir tidak dapat mengubah harga secara manual pada alur normal.

---

# 3. Model Data & Skema Database

- `products`: Item dasar (Roti Kukus Thailand).
- `pricing_rules`:
  - 1 Topping: `min_unique_toppings=1`, `max_unique_toppings=1`, `selling_price=3000`
  - Mixed Topping: `min_unique_toppings=2`, `max_unique_toppings=null`, `selling_price=5000`
- `sale_items`: Menyimpan `quantity`, `unique_topping_count`, `calculated_unit_price`, `subtotal`, dan `recorded_hpp`.
- `sale_item_toppings`: Menyimpan rincian topping yang digunakan pada masing-masing item transaksi.
