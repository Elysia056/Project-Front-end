// Route Handler: /api/pesanan
// GET  -> mengambil semua pesanan (atau hanya milik satu email: /api/pesanan?email=...)
// POST -> menambah pesanan baru
import { prisma } from "@/lib/prisma";
import type { PesananInput } from "@/lib/pesanan";

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email")?.toLowerCase();

  const daftar = await prisma.pesanan.findMany({
    where: email ? { email } : undefined,
    orderBy: { tanggal: "asc" },
  });
  return Response.json(daftar);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<PesananInput>;
  const {
    nama, email, varian, jumlah, harga, subtotal, catatan,
    alamat, jarak, ongkir, metodeBayar, buktiTransfer, totalBayar,
  } = body;

  // Validasi sederhana di sisi server
  if (
    !nama?.trim() || !email?.trim() || !varian || !alamat?.trim() ||
    !metodeBayar || !jumlah || !jarak
  ) {
    return Response.json(
      { message: "Data pesanan belum lengkap." },
      { status: 400 }
    );
  }

  // Nomor tiket dibuat di server. Kalau kebetulan kembar (primary key bentrok), coba lagi.
  for (let percobaan = 0; percobaan < 5; percobaan++) {
    const id = "#BA-2026-" + Math.floor(1000 + Math.random() * 9000);
    try {
      const pesanan = await prisma.pesanan.create({
        data: {
          id,
          nama: nama.trim(),
          email: email.trim().toLowerCase(),
          varian,
          jumlah,
          harga: harga ?? 0,
          subtotal: subtotal ?? 0,
          catatan: catatan?.trim() ?? "",
          alamat: alamat.trim(),
          jarak,
          ongkir: ongkir ?? 0,
          metodeBayar,
          buktiTransfer: buktiTransfer || null,
          totalBayar: totalBayar ?? 0,
        },
      });
      return Response.json(pesanan, { status: 201 });
    } catch (err) {
      if ((err as { code?: string }).code === "P2002") continue;
      return Response.json(
        { message: "Gagal menyimpan pesanan." },
        { status: 500 }
      );
    }
  }
  return Response.json(
    { message: "Gagal membuat nomor tiket. Coba lagi." },
    { status: 500 }
  );
}
