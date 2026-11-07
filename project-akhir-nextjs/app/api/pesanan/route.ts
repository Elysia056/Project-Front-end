// Route Handler: /api/pesanan
// GET  -> admin: semua pesanan; pelanggan: hanya pesanan dengan email akunnya
// POST -> menambah pesanan baru berisi satu atau beberapa rasa (harga dan ongkir dihitung di server)
import { prisma } from "@/lib/prisma";
import { ambilSemuaKonten } from "@/lib/kontenserver";
import { ambilUserSesi } from "@/lib/sesi";
import { hitungOngkir } from "@/lib/pesanan";
import type { PesananInput } from "@/lib/pesanan";

export async function GET() {
  const user = await ambilUserSesi();
  if (!user) {
    return Response.json({ message: "Silakan login dulu." }, { status: 401 });
  }

  // Admin melihat semua pesanan, pelanggan hanya miliknya sendiri
  let where: { email: string } | undefined;
  if (user.role !== "admin") {
    if (!user.email) return Response.json([]);
    where = { email: user.email.toLowerCase() };
  }

  const daftar = await prisma.pesanan.findMany({
    where,
    include: { items: { orderBy: { id: "asc" } } },
    orderBy: { tanggal: "asc" },
  });
  return Response.json(daftar);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<PesananInput>;
  const { nama, email, items, catatan, alamat, jarak, metodeBayar, buktiTransfer } = body;

  // Validasi sederhana di sisi server
  if (
    !nama?.trim() || !email?.trim() || !alamat?.trim() ||
    !metodeBayar || !jarak || !Array.isArray(items) || items.length === 0
  ) {
    return Response.json({ message: "Data pesanan belum lengkap." }, { status: 400 });
  }
  if (!(jarak > 0)) {
    return Response.json({ message: "Jarak tidak valid." }, { status: 400 });
  }

  // Harga dan ongkir dihitung di server dari pengaturan admin
  const { pesan } = await ambilSemuaKonten();
  const harga = pesan.hargaPerLoyang;

  // Gabungkan rasa yang sama, dan pastikan rasa serta jumlahnya valid
  const jumlahPerRasa = new Map<string, number>();
  for (const item of items) {
    const varian = typeof item?.varian === "string" ? item.varian : "";
    const jumlah = Number(item?.jumlah);
    if (!pesan.varian.includes(varian)) {
      return Response.json(
        { message: `Rasa "${varian}" tidak tersedia. Muat ulang halaman lalu pilih lagi.` },
        { status: 400 }
      );
    }
    if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 1000) {
      return Response.json({ message: "Jumlah tiap rasa harus 1 sampai 1000." }, { status: 400 });
    }
    jumlahPerRasa.set(varian, (jumlahPerRasa.get(varian) ?? 0) + jumlah);
  }
  const rincian = [...jumlahPerRasa].map(([varian, jumlah]) => ({
    varian,
    jumlah,
    harga,
    subtotal: harga * jumlah,
  }));
  const totalLoyang = rincian.reduce((total, r) => total + r.jumlah, 0);
  if (totalLoyang > 1000) {
    return Response.json({ message: "Total pesanan maksimal 1000 loyang." }, { status: 400 });
  }
  const subtotal = harga * totalLoyang;
  const ongkir = hitungOngkir(jarak, pesan.tarifPerKm);
  const totalBayar = subtotal + ongkir;
  // Ringkasan rasa untuk kolom varian, contoh: "Original Pandan x2, Keju Lembut x1"
  const ringkasan = rincian.map((r) => `${r.varian} \u00d7${r.jumlah}`).join(", ");

  // Nomor tiket dibuat di server. Kalau kebetulan kembar (primary key bentrok), coba lagi.
  for (let percobaan = 0; percobaan < 5; percobaan++) {
    const id = "#BA-2026-" + Math.floor(1000 + Math.random() * 9000);
    try {
      const pesanan = await prisma.pesanan.create({
        data: {
          id,
          nama: nama.trim(),
          email: email.trim().toLowerCase(),
          varian: ringkasan,
          jumlah: totalLoyang,
          harga,
          subtotal,
          catatan: catatan?.trim() ?? "",
          alamat: alamat.trim(),
          jarak,
          ongkir,
          metodeBayar,
          buktiTransfer: buktiTransfer || null,
          totalBayar,
          items: { create: rincian },
        },
        include: { items: { orderBy: { id: "asc" } } },
      });
      return Response.json(pesanan, { status: 201 });
    } catch (err) {
      if ((err as { code?: string }).code === "P2002") continue;
      return Response.json({ message: "Gagal menyimpan pesanan." }, { status: 500 });
    }
  }
  return Response.json({ message: "Gagal membuat nomor tiket. Coba lagi." }, { status: 500 });
}
