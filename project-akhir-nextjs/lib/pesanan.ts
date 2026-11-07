// Satu baris rasa dalam pesanan
export interface ItemPesanan {
  varian: string;
  jumlah: number;
  harga: number;
  subtotal: number;
}

export interface Pesanan {
  id: string;
  nama: string;
  email: string;
  varian: string;
  jumlah: number;
  harga: number;
  subtotal: number;
  catatan: string;
  alamat: string;
  jarak: number;
  ongkir: number;
  metodeBayar: string;
  buktiTransfer: string | null;
  totalBayar: number;
  tanggal: string;
  status: string;
  items?: ItemPesanan[]; // pesanan lama (sebelum fitur banyak rasa) tidak punya items
}

// Bentuk data yang dikirim form pemesanan ke API.
// Id, tanggal, status, harga, ongkir, dan total dibuat/dihitung oleh server.
export interface PesananInput {
  nama: string;
  email: string;
  items: { varian: string; jumlah: number }[];
  catatan: string;
  alamat: string;
  jarak: number;
  metodeBayar: string;
  buktiTransfer: string | null;
}

// Daftar rasa dalam pesanan. Pesanan lama tanpa items dianggap satu rasa.
export function daftarItem(pesanan: Pesanan): ItemPesanan[] {
  if (pesanan.items && pesanan.items.length > 0) return pesanan.items;
  return [
    {
      varian: pesanan.varian,
      jumlah: pesanan.jumlah,
      harga: pesanan.harga,
      subtotal: pesanan.subtotal,
    },
  ];
}

export function formatRupiah(angka: number): string {
  return "Rp " + angka.toLocaleString("id-ID");
}

// Harga per loyang, tarif per km, dan lokasi toko sekarang diatur admin (tabel Konten, kunci "pesan")
export function hitungOngkir(jarak: number, tarifPerKm: number): number {
  const jarakBulat = Math.max(1, Math.ceil(jarak));
  return jarakBulat * tarifPerKm;
}

export function hitungJarakHaversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Tanggal dari database berupa teks ISO, diubah menjadi format Indonesia saat ditampilkan
export function formatTanggal(tanggal: string): string {
  return new Date(tanggal).toLocaleString("id-ID");
}
