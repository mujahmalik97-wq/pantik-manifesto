# PANTIK Zine

Website statis untuk Vercel + Supabase.

## Isi proyek
- `index.html`: halaman utama dan arsip
- `karya.html`: halaman baca karya
- `admin.html`: login dan dashboard redaksi
- `config.js`: konfigurasi URL dan anon key Supabase
- `supabase-setup.sql`: tabel awal dan kebijakan akses

## Langkah pemasangan
1. Buat project di Supabase.
2. Buka SQL Editor, jalankan isi `supabase-setup.sql`.
3. Di Supabase Storage, buat bucket `covers` dan atur Public.
4. Di Authentication > Users, buat akun admin.
5. Isi `config.js` dengan Project URL dan anon/public key dari Supabase.
6. Unggah seluruh file proyek ini ke repository GitHub.
7. Di Vercel pilih Add New > Project, impor repository, lalu Deploy. Framework preset: Other; Build Command dan Output Directory dikosongkan (atau output `.` jika diminta).
8. Setelah deploy, buka domain Vercel. Login admin melalui `/admin.html`.

## Catatan keamanan penting
- Jangan pernah memasukkan `service_role` key ke `config.js` atau file frontend.
- Kebijakan SQL di atas mengizinkan semua akun authenticated mengelola konten. Untuk penggunaan publik yang serius, buat tabel admin/roles dan batasi kebijakan hanya untuk akun redaksi yang ditunjuk.
- Gunakan password unik dan aktifkan proteksi akun admin.
