// Route Handler: GET /api/gambar/:id -> menampilkan gambar yang diunggah admin
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  const gambar = await prisma.gambar.findUnique({ where: { id } });
  if (!gambar) {
    return new Response("Gambar tidak ditemukan", { status: 404 });
  }
  // Setiap gambar punya id unik (ganti gambar = id baru), jadi aman di-cache lama
  return new Response(gambar.data, {
    headers: {
      "Content-Type": gambar.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
