// Route Handler dinamis: /api/pesanan/:id
// PATCH  -> mengubah status pesanan
// DELETE -> menghapus pesanan
import { prisma } from "@/lib/prisma";

// params di Next.js 15+ berupa Promise
type Context = { params: Promise<{ id: string }> };

type PatchBody = { status?: string };

const STATUS_VALID = ["Diproses", "Dikirim", "Selesai", "Dibatalkan"];

// id pesanan berbentuk "#BA-2026-1234", sehingga dikirim lewat encodeURIComponent
async function ambilId(context: Context) {
  return decodeURIComponent((await context.params).id);
}

export async function PATCH(request: Request, context: Context) {
  const id = await ambilId(context);
  const body = (await request.json()) as PatchBody;

  if (!body.status || !STATUS_VALID.includes(body.status)) {
    return Response.json({ message: "Status tidak valid." }, { status: 400 });
  }

  try {
    const pesanan = await prisma.pesanan.update({
      where: { id },
      data: { status: body.status },
    });
    return Response.json(pesanan);
  } catch {
    return Response.json({ message: "Pesanan tidak ditemukan." }, { status: 404 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  const id = await ambilId(context);
  try {
    await prisma.pesanan.delete({ where: { id } });
    return Response.json({ message: "Pesanan dihapus." });
  } catch {
    return Response.json({ message: "Pesanan tidak ditemukan." }, { status: 404 });
  }
}
