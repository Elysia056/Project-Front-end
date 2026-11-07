// Route Handler: /api/galeri
// GET  -> daftar foto galeri
// POST -> menambah foto galeri baru (khusus admin)
import { prisma } from "@/lib/prisma";
import { wajibAdmin } from "@/lib/sesi";
import { ambilGaleri } from "@/lib/kontenserver";
import { srcGambarAman } from "@/lib/konten";

type GaleriBody = {
  kode?: string;
  judul?: string;
  deskripsi?: string;
  gambar?: string;
  lebar?: number;
  tinggi?: number;
};

export async function GET() {
  return Response.json(await ambilGaleri());
}

export async function POST(request: Request) {
  const admin = await wajibAdmin();
  if (admin.error) return admin.error;

  const body = (await request.json()) as GaleriBody;
  const judul = body.judul?.trim();
  const gambar = body.gambar?.trim();

  if (!judul || !gambar || !srcGambarAman(gambar)) {
    return Response.json({ message: "Judul dan gambar wajib diisi." }, { status: 400 });
  }
  const lebar = Number(body.lebar);
  const tinggi = Number(body.tinggi);
  if (!Number.isInteger(lebar) || !Number.isInteger(tinggi) || lebar < 1 || tinggi < 1 || lebar > 10000 || tinggi > 10000) {
    return Response.json({ message: "Ukuran gambar tidak valid." }, { status: 400 });
  }

  // Pastikan foto bawaan sudah tertanam sebelum menambah foto baru
  const daftar = await ambilGaleri();
  const urutan = daftar.reduce((maks, item) => Math.max(maks, item.urutan), -1) + 1;
  const nomor = String(daftar.length + 1).padStart(3, "0");

  const item = await prisma.itemGaleri.create({
    data: {
      kode: body.kode?.trim() || `${nomor} - ${judul.toLowerCase()}`,
      judul,
      deskripsi: body.deskripsi?.trim() ?? "",
      gambar,
      lebar,
      tinggi,
      urutan,
    },
  });
  return Response.json(item, { status: 201 });
}
