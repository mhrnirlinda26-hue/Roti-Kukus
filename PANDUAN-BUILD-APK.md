# Panduan Build APK — Roti Kukus Thailand
# ========================================

## Cara 1: Build Otomatis via GitHub Actions (RECOMMENDED)

### Langkah 1: Buat Repository GitHub
1. Buka https://github.com/new
2. Nama repository: `roti-kukus-thailand` (atau bebas)
3. Pilih **Public** (agar GitHub Actions gratis tanpa batas)
4. Klik **Create repository**
5. JANGAN centang "Add a README file" (karena sudah ada file lokal)

### Langkah 2: Push Kode ke GitHub
Buka PowerShell di folder `G:\Roti Kukus Thailand APP`, jalankan:

```powershell
# Download Git dulu jika belum ada: https://git-scm.com/download/win
git init
git add .
git commit -m "feat: Roti Kukus Thailand - offline full + Capacitor Android"
git branch -M main
git remote add origin https://github.com/USERNAME_ANDA/roti-kukus-thailand.git
git push -u origin main
```

> Ganti `USERNAME_ANDA` dengan username GitHub Anda.

### Langkah 3: Download APK
1. Buka repository Anda di GitHub
2. Klik tab **Actions** → klik workflow run terbaru → tunggu sampai hijau ✅ (~3-5 menit)
3. Scroll ke bawah ke bagian **Artifacts** → download `roti-kukus-thailand-apk`
4. Extract ZIP → dapat file `app-debug.apk`
5. Transfer ke HP Android → install!

> **Catatan:** APK debug akan muncul warning "Unknown source" saat install di HP — ini normal. Pilih "Install anyway" / "Tetap install".

---

## Cara 2: Build Lokal (butuh Java + Android SDK)

Jika suatu saat ingin build di komputer sendiri:

1. Install Java JDK 17: https://adoptium.net/
2. Install Android Studio (untuk SDK + Build Tools): https://developer.android.com/studio
3. Set environment variable `ANDROID_HOME` ke folder SDK
4. Jalankan:
```powershell
cd roti-kukus-app
npm run build
npx cap sync android
cd android
.\gradlew assembleDebug
```
5. APK ada di: `android\app\build\outputs\apk\debug\app-debug.apk`

---

## File-file Penting

| File | Fungsi |
|------|--------|
| `roti-kukus-app/capacitor.config.ts` | Config Capacitor (appId, appName, webDir) |
| `roti-kukus-app/next.config.ts` | Static export (`output: "export"`) |
| `.github/workflows/build-apk.yml` | Workflow GitHub Actions auto-build APK |
| `roti-kukus-app/android/` | Native Android project (auto-generated) |

## Detail Aplikasi

- **App ID:** `com.rotikukus.thailand`
- **App Name:** Roti Kukus Thailand
- **Storage:** 100% offline (localStorage + IndexedDB)
- **Tidak perlu internet** setelah install
