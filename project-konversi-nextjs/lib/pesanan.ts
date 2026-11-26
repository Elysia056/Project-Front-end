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
}

// Konfigurasi harga, tarif ongkir, dan lokasi toko
export const HARGA_PER_LOYANG = 150000;
export const TARIF_PER_KM = 3000;
export const LOKASI_TOKO = {
  nama: "Bika Ambon Zulaikha - Jl. Mojopahit No.70 A-C, Medan",
  lat: 3.5952,
  lng: 98.6577,
};

export function formatRupiah(angka: number): string {
  return "Rp " + angka.toLocaleString("id-ID");
}

export function hitungOngkir(jarak: number): number {
  const jarakBulat = Math.max(1, Math.ceil(jarak));
  return jarakBulat * TARIF_PER_KM;
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

export function ambilPesanan(): Pesanan[] {
  const data = localStorage.getItem("bikaAmbonOrders");
  return data ? JSON.parse(data) : [];
}

export function simpanPesanan(daftarPesanan: Pesanan[]) {
  localStorage.setItem("bikaAmbonOrders", JSON.stringify(daftarPesanan));
}