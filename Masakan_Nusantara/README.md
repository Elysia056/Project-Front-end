# Bika Ambon, Kelompok 1

535250056 - Elysia Nyoman
535250058 - Richard Harris Yuwono
535250066 - Meisa Putri Nadira
535250074 - Stesa Aurel Titania
535250100 - Surya Banyutama Suprapto

Website landing page sekaligus sistem pemesanan **Bika Ambon** (kue sarang lebah khas Medan), lengkap dengan sistem login/registrasi dan dashboard terpisah untuk Admin dan Pelanggan.

## Fitur

### Halaman Utama (`index.html`)
- **Beranda**, hero section dengan ilustrasi interaktif "belah rongga" (bisa digeser dengan mouse/touch)
- **Cerita**, sejarah Bika Ambon dengan toggle baca selengkapnya
- **Keunikan**, kartu-kartu keunggulan produk
- **Galeri**, preview gambar dengan modal lightbox
- **Proses**, tahapan pembuatan, dengan layout responsif (mobile-first + media query)
- **Lokasi & Kontak**, peta lokasi toko (Google Maps embed) dan ikon media sosial
- **Pesan**, form pemesanan dengan:
  - Stepper jumlah loyang (+/-)
  - Kalkulasi ongkos kirim otomatis berdasarkan jarak (km)
  - Resi konfirmasi setelah pesanan dikirim
  - Scrollspy & smooth scroll antar section, termasuk indikator navigasi di sisi kiri layar

### Autentikasi
- `signup.html`, pendaftaran akun Pelanggan baru (validasi password, cek username/email duplikat)
- `login.html`, login untuk Admin maupun Pelanggan, dengan toggle show/hide password
- Status login disimpan di `localStorage` (`currentUser`), navbar otomatis menampilkan tombol **MASUK** atau badge nama user yang sedang login

### Dashboard Admin (`admin.html`)
- Statistik ringkas: total pesanan, total loyang, pesanan selesai
- Tabel seluruh pesanan yang masuk (nama, email, alamat, varian, jumlah, ongkir, dll)
- Ubah status pesanan (Diproses / Selesai / Dibatalkan)
- Hapus pesanan

### Dashboard Pelanggan (`user.html`)
- Menampilkan riwayat pesanan milik akun yang sedang login (dicocokkan lewat email)

## Teknologi

- **HTML5**, struktur semantik per section
- **CSS3**, custom properties (CSS variables), Flexbox & Grid, mobile-first responsive design dengan media query
- **Javascript (Vanilla)**, tanpa library/framework, menggunakan:
  - DOM manipulation: `getElementById`, `querySelector(All)`, `createElement`, `classList`
  - Event handling: `addEventListener` (`click`, `submit`, `change`, `input`, scroll, drag mouse/touch)
  - Array methods: `forEach`, `filter`, `splice`, `some`
  - `localStorage` untuk menyimpan data akun & pesanan (simulasi database, karena belum menggunakan backend)
- **[Boxicons](https://boxicons.com/)**, ikon media sosial (CDN)
- **Google Maps Embed**, peta lokasi toko (iframe, tanpa API key)

## 🔑 Akun

Admin = Sudah tersedia default, username `admin`, password `admin123` |
Pelanggan = Daftar sendiri lewat halaman **Sign Up** (`signup.html`) |