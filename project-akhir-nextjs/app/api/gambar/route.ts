// Route Handler: POST /api/gambar -> mengunggah gambar (khusus admin)
// Gambar disimpan di database (tabel Gambar) karena Vercel tidak bisa menyimpan file baru.
import { prisma } from "@/lib/prisma";
import { wajibAdmin } from "@/lib/sesi";

const MIME_BOLEH = ["image/jpeg", "image/png", "image/webp"];
const UKURAN_MAKS = 4_000_000; // 4 MB (batas body request di Vercel sekitar 4,5 MB)

export async function POST(request: Request) {
  const admin = await wajibAdmin();
  if (admin.error) return admin.error;

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ message: "File gambar tidak ditemukan." }, { status: 400 });
  }
  if (!MIME_BOLEH.includes(file.type)) {
    return Response.json({ message: "Format harus JPG, PNG, atau WebP." }, { status: 400 });
  }
  if (file.size > UKURAN_MAKS) {
    return Response.json({ message: "Ukuran gambar maksimal 4 MB." }, { status: 400 });
  }

  const data = new Uint8Array(await file.arrayBuffer());
  const gambar = await prisma.gambar.create({
    data: { mime: file.type, data },
  });
  return Response.json({ url: `/api/gambar/${gambar.id}` }, { status: 201 });
}
