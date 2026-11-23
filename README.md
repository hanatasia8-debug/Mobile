# GatherIn 📱 — Aplikasi Komunitas & Kumpul Mahasiswa

Aplikasi mobile berbasis **React Native (Expo SDK 58 + Expo Router)** dengan integrasi basis data **Supabase PostgreSQL** dan sistem autentikasi terenkripsi.

---

## 🚀 Fitur Praktikum (Modul 1 – 4)

### Modul 1 & 2: Desain Komponen & Routing Dinamis
- **File-based Routing**: Menggunakan Expo Router (`src/app/`).
- **Dynamic Route**: Halaman detail dinamis (`src/app/detail/[id].tsx`).
- **Komponen Modular**: `ActivityCard`, `StatCard`, `Loading`, `ErrorMessage`, `CommunityHostCard`, dan `DiscussionCard`.

### Modul 3: Pemrograman Asynchronous, State & Storage
- **Local Storage**: Penyimpanan daftar kegiatan favorit secara persisten menggunakan `AsyncStorage`.
- **Custom Promise**: Validasi kuota dan join kegiatan menggunakan Promise constructor (`new Promise`), method `.then()`, `.resolve()`, dan `.reject()`.
- **External API Fetch**: Pengambilan data host dan topik forum dari API eksternal (dummyjson).

### Modul 4: Database Cloud & Autentikasi Supabase
- **Secure Token Storage**: Singleton Supabase Client dengan `ExpoSecureStoreAdapter` (`expo-secure-store`) untuk enkripsi token sesi pada iOS (Keychain) dan Android (Keystore).
- **Global AuthContext**: Manajemen sesi global dengan real-time subscription (`supabase.auth.onAuthStateChange`).
- **Route Protection Guards**: Proteksi rute otomatis dengan Expo Router (`useSegments()`). Loading state terpusat untuk mencegah *layout flicker*.
- **Mobile UX Form**: Input sanitization `.trim()`, keyboard email, pencegahan multiple submission saat loading, dan penanganan error Supabase.
- **Cloud Database CRUD (RLS)**: Operasi `SELECT`, `INSERT`, `UPDATE`, dan `DELETE` pada tabel `gatherings` dengan **Row Level Security** (`auth.uid() = user_id`).
- **Optimistic UI & Pull-to-Refresh**: Respon instan pada UI saat membuat/mengubah/menghapus ajakan dengan mekanisme *rollback* otomatis jika request jaringan gagal.

---

## 🛠️ Panduan Instalasi & Menjalankan Proyek

### 1. Clone & Instal Dependensi
```bash
git clone https://github.com/hanatasia8-debug/Mobile.git
cd Mobile
npm install
```

### 2. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi variabel dengan kredensial Supabase Anda:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your-anon-key
```

### 3. Eksekusi Skrip Database
Buka **Supabase SQL Editor** dan jalankan seluruh query yang ada di file [`supabase_schema.sql`](./supabase_schema.sql) untuk membuat tabel `gatherings` dan kebijakan RLS.

### 4. Jalankan Aplikasi di Expo Go
```bash
npx expo start --go
```
Scan QR code menggunakan aplikasi **Expo Go** pada perangkat Android atau iOS.
