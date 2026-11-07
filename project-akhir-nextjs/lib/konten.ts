export interface KontenNavbar {
  brand: string;
  tagline: string;
  menu: { id: string; label: string }[];
  labelMasuk: string;
  tombolPesan: string;
}

export interface KontenHero {
  kicker: string;
  judulUtama: string;
  judulOutline: string;
  labelRongga: string;
  labelKulit: string;
  petunjuk: string;
  gambarRongga: string;
  gambarKulit: string; // kosong = pakai warna bawaan
}

export interface KontenCerita {
  kicker: string;
  pembuka: string; // huruf pertama ditampilkan besar (drop cap)
  isi: string;
  kutipan: string;
  tombolBuka: string;
  tombolTutup: string;
  judulFakta: string;
  fakta: string;
  statistik: { angka: string; label: string }[];
}

export interface KontenKeunikan {
  kicker: string;
  judul: string;
  items: { judul: string; deskripsi: string }[];
}

export interface KontenGaleri {
  kicker: string;
  judul: string;
}

export interface KontenProses {
  kicker: string;
  judul: string;
  langkah: { judul: string; deskripsi: string }[];
}

export interface KontenLokasi {
  kicker: string;
  judul: string;
  mapSrc: string;
  alamat: string;
  jamBuka: string;
  whatsapp: string;
  sosial: { label: string; href: string; ikon: string }[];
}

export interface KontenPesan {
  hargaPerLoyang: number;
  tarifPerKm: number;
  varian: string[];
  toko: { nama: string; lat: number; lng: number };
  bca: { noRek: string; atasNama: string };
  gopay: { noHp: string; atasNama: string };
}

export interface KontenFooter {
  judulBesar: string;
  hakCipta: string;
  tombolKembali: string;
}

export interface SemuaKonten {
  navbar: KontenNavbar;
  hero: KontenHero;
  cerita: KontenCerita;
  keunikan: KontenKeunikan;
  galeri: KontenGaleri;
  proses: KontenProses;
  lokasi: KontenLokasi;
  pesan: KontenPesan;
  footer: KontenFooter;
}

export type KunciKonten = keyof SemuaKonten;

export const DAFTAR_KUNCI: KunciKonten[] = [
  "navbar", "hero", "cerita", "keunikan", "galeri", "proses", "lokasi", "pesan", "footer",
];

export interface ItemGaleri {
  id: number;
  kode: string;
  judul: string;
  deskripsi: string;
  gambar: string;
  lebar: number;
  tinggi: number;
  urutan: number;
}

export const KONTEN_DEFAULT: SemuaKonten = {
  navbar: {
    brand: "Bika Ambon",
    tagline: "Kelompok 1",
    menu: [
      { id: "beranda", label: "BERANDA" },
      { id: "cerita", label: "CERITA" },
      { id: "keunikan", label: "KEUNIKAN" },
      { id: "galeri", label: "GALERI" },
      { id: "proses", label: "PROSES" },
      { id: "lokasi", label: "LOKASI" },
    ],
    labelMasuk: "MASUK",
    tombolPesan: "PESAN \u2192",
  },
  hero: {
    kicker: "// kue sarang lebah khas medan",
    judulUtama: "Belah",
    judulOutline: "Rongganya.",
    labelRongga: "Rongga Dalam",
    labelKulit: "Kulit Luar",
    petunjuk: "geser garis untuk membelah \u2192",
    gambarRongga: "/images/galeri-002-rongga.png",
    gambarKulit: "",
  },
  cerita: {
    kicker: "// cerita & filosofi",
    pembuka:
      "Bika Ambon bukan kue biasa, namanya menipu, asalnya dari Medan, dan teksturnya sengaja dibuat berlubang.",
    isi: "Rongga-rongga kecil itu bukan cacat, tapi tujuan. Terbentuk dari fermentasi alami air nira dan telur selama berjam-jam, lalu dipanggang perlahan di suhu rendah hingga bagian luar kecokelatan namun bagian dalam tetap kenyal berserat, seperti sarang lebah yang dipotong melintang.",
    kutipan: "Namanya Ambon, rumahnya Medan, dan ia tak pernah malu soal itu.",
    tombolBuka: "Baca asal-usul Jalan Ambon \u2192",
    tombolTutup: "Tutup catatan sejarah \u2191",
    judulFakta: "Fakta Sejarah:",
    fakta:
      "Bika Ambon pertama kali diproduksi dan dijual di persimpangan Jalan Ambon Sei Kera, Kota Medan pada dekade 1950-an. Para pedagang mengombinasikan resep kue bika Melayu dengan fermentasi air nira segar, menciptakan tekstur sarang lebah unik yang harum dan kenyal.",
    statistik: [
      { angka: "100%", label: "Bahan Alami, Tanpa Pengawet" },
      { angka: "6-8 jam", label: "Fermentasi Sebelum Dipanggang" },
      { angka: "1958", label: "Diperkenalkan Pedagang Asal Ambon" },
    ],
  },
  keunikan: {
    kicker: "// kenapa berbeda",
    judul: "Tiga hal yang tak bisa ditiru sembarangan",
    items: [
      {
        judul: "Rongga Terukur",
        deskripsi:
          "Fermentasi diawasi tiap jam agar pola sarang lebah terbentuk merata di setiap loyang.",
      },
      {
        judul: "Pandan-Kunyit Segar",
        deskripsi:
          "Diperas langsung dari daun dan rimpang asli, bukan sirup instan atau pewarna buatan.",
      },
      {
        judul: "Api Kecil, Sabar Besar",
        deskripsi:
          "Dipanggang lambat agar luar renyah, dalam tetap lembap, proses yang tak bisa dipercepat.",
      },
    ],
  },
  galeri: {
    kicker: "// galeri",
    judul: "Sudut-sudut Rongganya",
  },
  proses: {
    kicker: "// proses",
    judul: "Dari Adonan ke Rongga",
    langkah: [
      {
        judul: "Fermentasi Alami",
        deskripsi:
          "Air nira dan telur dibiarkan bereaksi hingga menghasilkan gelembung udara halus.",
      },
      {
        judul: "Campur Pandan & Kunyit",
        deskripsi:
          "Warna dan aroma khas ditambahkan dari bahan segar yang diperas langsung.",
      },
      {
        judul: "Panggang Suhu Rendah",
        deskripsi: "Rongga terbentuk perlahan tanpa merusak tekstur kenyalnya.",
      },
      {
        judul: "Potong & Sajikan",
        deskripsi:
          "Dipotong hangat agar aroma pandannya masih terasa saat sampai ke kamu.",
      },
    ],
  },
  lokasi: {
    kicker: "// lokasi & kontak",
    judul: "Datang atau Sapa Kami",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d67854.63374613885!2d98.70956846910109!3d3.604385660983691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x303131d386574799%3A0x68a1c8e19428ac71!2sBika%20Ambon%20Zulaikha!5e0!3m2!1sen!2sid!4v1790502930653!5m2!1sen!2sid",
    alamat:
      "Jl. Mojopahit No.70 A-C, Petisah Tengah, Kec. Medan Petisah, Kota Medan, Sumatera Utara 20112",
    jamBuka: "Setiap Hari, 08.00 - 20.00 WIB",
    whatsapp: "+62 812-0000-0000",
    sosial: [
      { label: "Instagram", href: "https://instagram.com/", ikon: "bx bxl-instagram" },
      { label: "WhatsApp", href: "https://wa.me/6281234567890", ikon: "bx bxl-whatsapp" },
      { label: "TikTok", href: "https://tiktok.com/", ikon: "bx bxl-tiktok" },
      { label: "Facebook", href: "https://facebook.com/", ikon: "bx bxl-facebook-square" },
    ],
  },
  pesan: {
    hargaPerLoyang: 150000,
    tarifPerKm: 3000,
    varian: [
      "Original Pandan",
      "Pandan Kunyit Spesial",
      "Gula Merah Klasik",
      "Keju Lembut",
      "Cokelat Rongga",
    ],
    toko: {
      nama: "Bika Ambon Zulaikha - Jl. Mojopahit No.70 A-C, Medan",
      lat: 3.5952,
      lng: 98.6577,
    },
    bca: { noRek: "1234567890", atasNama: "Bika Ambon Kelompok 1" },
    gopay: { noHp: "0812-3456-7890", atasNama: "Bika Ambon Kelompok 1" },
  },
  footer: {
    judulBesar: "BIKA AMBON",
    hakCipta: "\u00a9 2026 Kelompok 1",
    tombolKembali: "KEMBALI KE ATAS",
  },
};

// Foto galeri bawaan (dimasukkan ke database otomatis saat pertama kali dibuka)
export const GALERI_DEFAULT: Omit<ItemGaleri, "id" | "urutan">[] = [
  {
    kode: "001 - potongan klasik",
    judul: "Potongan Klasik",
    deskripsi:
      "Dua potong bika ambon berserat vertikal sempurna disajikan di atas piring saji tradisi bersama helai daun pandan wangi.",
    gambar: "/images/PotonganKlasik.jpeg",
    lebar: 975,
    tinggi: 669,
  },
  {
    kode: "002 - rongga tebal, close-up",
    judul: "Rongga Tebal, Close-Up",
    deskripsi:
      "Tampilan makro lubang sarang lebah yang terbentuk sempurna akibat pelepasan karbondioksida alami ragi nira kelapa.",
    gambar: "/images/RonggaCloseUp.png",
    lebar: 700,
    tinggi: 700,
  },
  {
    kode: "003 - dipanggang perlahan",
    judul: "Dipanggang Perlahan",
    deskripsi:
      "Loyang tembaga kuno bersuhu stabil dengan tutup arang panas membakar adonan perlahan dari bawah ke atas.",
    gambar: "/images/Dipanggang.png",
    lebar: 1080,
    tinggi: 1080,
  },
  {
    kode: "004 - siap disajikan",
    judul: "Siap Disajikan",
    deskripsi:
      "Bika ambon beraroma harum pandan daun suji yang dipotong rapi siap dinikmati bersama secangkir kopi Sidikalang.",
    gambar: "/images/Disajikan.jpg",
    lebar: 1200,
    tinggi: 900,
  },
  {
    kode: "005 - potong hangat, uap masih naik",
    judul: "Potong Hangat, Uap Masih Naik",
    deskripsi:
      "Kue yang baru saja keluar dari tungku, dipotong saat masih hangat mengepul dengan keharuman daun jeruk dan serai.",
    gambar: "/images/BikaAmbonPlate.png",
    lebar: 735,
    tinggi: 670,
  },
];

// Menggabungkan isi dari database dengan isi bawaan: kolom yang hilang atau salah tipe
// diganti isi bawaan, sehingga website tidak error kalau data di database tidak lengkap.
export function gabungDenganDefault<T>(bawaan: T, dariDb: unknown): T {
  if (Array.isArray(bawaan)) {
    return (Array.isArray(dariDb) ? dariDb : bawaan) as T;
  }
  if (bawaan && typeof bawaan === "object") {
    const hasil: Record<string, unknown> = {};
    const sumber =
      dariDb && typeof dariDb === "object" && !Array.isArray(dariDb)
        ? (dariDb as Record<string, unknown>)
        : {};
    for (const key of Object.keys(bawaan as Record<string, unknown>)) {
      hasil[key] = gabungDenganDefault(
        (bawaan as Record<string, unknown>)[key],
        sumber[key]
      );
    }
    return hasil as T;
  }
  return (typeof dariDb === typeof bawaan ? dariDb : bawaan) as T;
}

// Alamat gambar yang boleh dipakai: file di folder public, gambar unggahan, atau https
export function srcGambarAman(src: string): boolean {
  return (
    src === "" ||
    src.startsWith("/images/") ||
    src.startsWith("/api/gambar/") ||
    src.startsWith("https://")
  );
}

export function urlAman(url: string): boolean {
  return url.startsWith("https://") || url.startsWith("http://");
}
