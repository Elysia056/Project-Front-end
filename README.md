# Bika Ambon, Kelompok 1

535250056 - Elysia Nyoman
535250058 - Richard Harris Yuwono
535250066 - Meisa Putri Nadira
535250074 - Stesa Aurel Titania
535250100 - Surya Banyutama Suprapto

Website landing page sekaligus sistem pemesanan **Bika Ambon**, lengkap dengan login/registrasi, dashboard terpisah untuk Admin dan Pelanggan, serta fitur Admin untuk mengelola isi website.

Repositori ini berisi tugas-tugas kelompok dari awal sampai versi akhir. Project Bika Ambon dikembangkan dalam tiga tahap: **konversi ke Next.js**, **database SQLite dengan Prisma**, dan **PostgreSQL untuk Vercel**.

## Isi repositori

| Folder / file | Keterangan |
|---|---|
| `STEM_BMI` | Tugas kalkulator BMI |
| `Kopi_Nusantara` | Tugas website Kopi Nusantara (HTML, CSS, JavaScript, Responsive UI) |
| `Kopi_JQuery` | Tugas website Kopi Nusantara dengan jQuery |
| `Bootstrap` | Tugas website Kopi Nusantara dengan Bootstrap 5 |
| `PROJECT_UTS` | Project Bika Ambon versi awal (HTML, CSS, JavaScript, data di `localStorage`) |
| `project-konversi-nextjs` | **Tahap 1**: Bika Ambon dikonversi ke Next.js, data masih di `localStorage` |
| `project-nextjs-sqlite` | **Tahap 2**: data dipindah ke database SQLite dengan Prisma dan API Route |
| `project-akhir-nextjs` | **Tahap 3 (versi akhir)**: PostgreSQL, login dengan sesi, Admin kelola website, pesanan banyak rasa, deploy di Vercel |
| `Dokumentasi_Bika_Ambon.pdf` | Laporan Project UTS |
| `Laporan Tugas Kelompok 1 - ....pdf` | Laporan tugas Bootstrap, jQuery, dan Responsive UI |

## Tiga tahap Bika Ambon

1. **Konversi Next.js (`project-konversi-nextjs`)**: lima file HTML menjadi lima halaman di folder `app` (`/`, `/login`, `/signup`, `/user`, `/admin`). Setiap bagian halaman utama menjadi komponen React di folder `components`. Fungsi bantu ada di folder `lib`. Akun dan pesanan masih disimpan di `localStorage`.
2. **SQLite dengan Prisma (`project-nextjs-sqlite`)**: browser tidak lagi menyimpan data sendiri. Halaman memanggil API Route (`app/api`), API memakai Prisma, dan Prisma menyimpan ke SQLite. Ada dua tabel: `User` dan `Pesanan`. Tampilan memakai react-bootstrap.
3. **Vercel dan PostgreSQL (`project-akhir-nextjs`)**: SQLite diganti PostgreSQL karena Vercel tidak bisa menyimpan file baru. Tabel bertambah menjadi tujuh, login memakai sesi dan cookie, dan Admin bisa mengelola isi website.

## Fitur versi akhir (`project-akhir-nextjs`)

### Halaman Utama (`/`)
- **Beranda**, hero section dengan ilustrasi interaktif "belah rongga" (bisa digeser dengan mouse atau touch), deskripsi, dan tombol Login Sekarang (menjadi Pesan Sekarang kalau sudah login)
- **Cerita**, **Keunikan**, **Galeri** (lightbox), **Proses**, dan **Lokasi & Kontak** (peta dan media sosial)
- **Pesan**, form pemesanan dengan:
  - Satu pesanan bisa berisi **beberapa rasa** sekaligus
  - Stepper jumlah loyang (+/-)
  - Ongkos kirim otomatis berdasarkan jarak (km), dengan peta untuk memilih lokasi
  - Resi konfirmasi setelah pesanan dikirim
- Scrollspy, smooth scroll, dan indikator navigasi di sisi kiri layar
- Isi halaman dibaca dari database setiap kali dibuka, sehingga perubahan dari Admin langsung terlihat

### Autentikasi (`/signup`, `/login`)
- Pendaftaran akun Pelanggan (validasi password, username dan email tidak boleh kembar)
- Login Admin dan Pelanggan dengan **sesi**: server membuat token acak, menyimpannya di tabel `Sesi`, dan mengirimnya lewat cookie `httpOnly` yang berlaku 7 hari

### Dashboard Pelanggan (`/user`)
- Riwayat pesanan milik akun yang sedang login
- Filter status pesanan dan tombol **Pesan Lagi**
- **Rating** (1 sampai 5 bintang) dan ulasan untuk pesanan yang sudah Selesai (satu kali per pesanan)

### Dashboard Admin (`/admin`)
- Statistik ringkas: total pesanan, total loyang, pesanan selesai, dan pendapatan
- Tabel seluruh pesanan, status berwarna (Diproses / Dikirim / Selesai / Dibatalkan), ubah status, dan hapus pesanan
- Rating dan ulasan pelanggan ikut tampil
- **Kelola Website**: mengubah isi sembilan bagian (navbar, hero, cerita, keunikan, galeri, proses, lokasi, pesan, footer), termasuk harga per loyang dan varian rasa
- Kelola galeri: tambah, ganti gambar, urutkan, dan hapus foto. Gambar disimpan di database

### Keamanan
- Harga dan ongkir dihitung ulang di server, bukan dari angka yang dikirim browser
- API khusus Admin menolak permintaan tanpa login (401) atau bukan Admin (403)

## Teknologi

| | Konversi Next.js | SQLite | Versi akhir (Vercel) |
|---|---|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript | sama | sama |
| Tampilan | CSS (`globals.css`) | CSS dan Bootstrap 5 (react-bootstrap) | sama |
| Data | `localStorage` | SQLite (Prisma 7, adapter better-sqlite3) | PostgreSQL (Prisma 7, adapter pg) |
| Login | `localStorage` | tabel `User` lewat API | tabel `Sesi` dan cookie `httpOnly` |
| Server | tidak ada | API Route (`app/api`) | API Route (`app/api`) |

Teknik yang dipakai: component, props dan children, state (`useState`, `useEffect`) dan event handling, serta routing di folder `app`. Ikon memakai [Boxicons](https://boxicons.com/) dan peta memakai Leaflet.

## Skema database (versi akhir)

Tujuh tabel: `User`, `Sesi`, `Pesanan`, `ItemPesanan`, `Konten`, `ItemGaleri`, dan `Gambar`.

- Satu `User` punya banyak `Sesi`
- Satu `Pesanan` punya banyak `ItemPesanan` (satu baris per rasa)
- `Pesanan` menyimpan `rating`, `ulasan`, dan `ratedAt`
- `Konten` menyimpan teks tiap bagian website, `ItemGaleri` menyimpan foto galeri dan urutannya, dan `Gambar` menyimpan file gambar unggahan Admin
- Menghapus `User` atau `Pesanan` ikut menghapus `Sesi` atau `ItemPesanan` terkait

## Akun

- **Admin**: sudah tersedia lewat seed, username `admin` dan password `admin123`. Di `project-konversi-nextjs` akun ini ada di kode (`lib/auth.ts`).
- **Pelanggan**: daftar sendiri lewat halaman **Sign Up** (`/signup`).