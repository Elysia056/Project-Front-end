// Route Handler dinamis: /api/galeri/:id
// PATCH  -> mengubah foto galeri: judul, keterangan, atau mengganti gambar (khusus admin)
// DELETE -> menghapus foto galeri (khusus admin)
import { prisma } from "@/lib/prisma";
import { wajibAdmin } from "@/lib/sesi";
import { hapusGambarLama } from "@/lib/kontenserver";
import { srcGambarAman } from "@/lib/konten";

type Context = { params: Promise<{ id: string }> };

type PatchBody = {
  kode?: string;
  judul?: string;
  deskripsi?: string;
  gambar?: string;
  lebar?: number;
  tinggi?: number;
};

async function ambilId(context: Context) {
  return Number((await context.params).id);
}

export async function PATCH(request: Request, context: Context) {
  const admin = await wajibAdmin();
  if (admin.error) return admin.error;

  const id = await ambilId(context);
  if (!Number.isInteger(id)) {
    return Response.json({ message: "Id tidak valid." }, { status: 400 });
  }
  const lama = await prisma.itemGaleri.findUnique({ where: { id } });
  if (!lama) {
    return Response.json({ message: "Foto tidak ditemukan." }, { status: 404 });
  }

  const body = (await request.json()) as PatchBody;
  const data: Record<string, string | number> = {};

  if (body.judul !== undefined) {
    if (!body.judul.trim()) {
      return Response.json({ message: "Judul tidak boleh kosong." }, { status: 400 });
    }
    data.judul = body.judul.trim();
  }
  if (body.kode !== undefined) data.kode = body.kode.trim();
  if (body.deskripsi !== undefined) data.deskripsi = body.deskripsi.trim();
  if (body.gambar !== undefined) {
    const lebar = Number(body.lebar);
    const tinggi = Number(body.tinggi);
    if (!srcGambarAman(body.gambar) || !body.gambar || !Number.isInteger(lebar) || !Number.isInteger(tinggi) || lebar < 1 || tinggi < 1) {
      return Response.json({ message: "Gambar tidak valid." }, { status: 400 });
    }
    data.gambar = body.gambar;
    data.lebar = lebar;
    data.tinggi = tinggi;
  }

  const item = await prisma.itemGaleri.update({ where: { id }, data });
  if (body.gambar !== undefined) {
    await hapusGambarLama(lama.gambar, body.gambar);
  }
  return Response.json(item);
}

export async function DELETE(_request: Request, context: Context) {
  const admin = await wajibAdmin();
  if (admin.error) return admin.error;

  const id = await ambilId(context);
  try {
    const item = await prisma.itemGaleri.delete({ where: { id } });
    await hapusGambarLama(item.gambar, "");
    return Response.json({ message: "Foto dihapus." });
  } catch {
    return Response.json({ message: "Foto tidak ditemukan." }, { status: 404 });
  }
}
