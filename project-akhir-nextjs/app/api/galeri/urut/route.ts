// Route Handler: POST /api/galeri/urut -> menyimpan urutan foto galeri (khusus admin)
// Body: { ids: [3, 1, 2] }  -> foto dengan id 3 jadi urutan pertama, dst.
import { prisma } from "@/lib/prisma";
import { wajibAdmin } from "@/lib/sesi";

export async function POST(request: Request) {
  const admin = await wajibAdmin();
  if (admin.error) return admin.error;

  const body = (await request.json()) as { ids?: unknown };
  if (!Array.isArray(body.ids) || body.ids.some((x) => !Number.isInteger(x))) {
    return Response.json({ message: "Urutan tidak valid." }, { status: 400 });
  }
  const ids = body.ids as number[];

  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.itemGaleri.updateMany({ where: { id }, data: { urutan: index } })
    )
  );
  return Response.json({ message: "Urutan disimpan." });
}
