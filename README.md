# Matematika di Dunia Nyata

Website edukasi matematika interaktif SMA/SMK menggunakan HTML + CSS + JavaScript vanilla + Firebase Authentication + Firestore.

## Jalankan lokal
Karena `auth.js` memakai ES module, jalankan melalui local server, bukan `file://`.
Contoh:
- VS Code → Live Server
- Python: `python -m http.server 5500`
- Buka `http://localhost:5500`

## Firebase
1. Buat project di Firebase Console.
2. Authentication → Sign-in method → aktifkan Email/Password dan Google (opsional).
3. Firestore Database → buat database → gunakan rules pada `firestore.rules`.
4. Project settings → Web app → salin Firebase config.
5. Tempel nilai config ke `js/auth.js` pada `firebaseConfig`.
6. Untuk Google Sign-In pada hosting, tambahkan domain hosting di Authentication → Settings → Authorized domains.

## Deploy
Upload seluruh folder ke GitHub Pages, Netlify, atau Vercel. Tidak perlu build tool.

## Catatan
Mode Tamu memakai localStorage. Saat akun pertama kali dibuat, progres lokal dimigrasikan ke Firestore. Setelah akun sudah memiliki data cloud, data cloud menjadi sumber utama.

Leaderboard cloud pada contoh ini boleh dibaca publik dan score terakhir ditulis oleh akun masing-masing. Untuk aplikasi produksi dengan anti-cheat serius, skor sebaiknya divalidasi server-side/Cloud Functions.


## Halaman Login
Versi ini memiliki halaman **🔐 Akun** khusus yang dapat dibuka dari topbar. Halaman tersebut menyediakan Masuk, Daftar, Google Sign-In, dan mode Tamu. Modal login tetap tersedia dari tombol topbar saat belum login.
