// Route Handler: /api/pesanan/[id]/rating
// POST -> pelanggan memberi rating 1-5 (dan ulasan opsional) pada pesanannya yang sudah Selesai
import { prisma } from "@/lib/prisma";
import { ambilUserSesi } from "@/lib/sesi";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await ambilUserSesi();
  if (!user) {
    return Response.json({ message: "Silakan login dulu." }, { status: 401 });
  }

  const { id: idMentah } = await params;
  const id = decodeURIComponent(idMentah);

  let body: { rating?: unknown; ulasan?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Data tidak valid." }, { status: 400 });
  }
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return Response.json({ message: "Rating harus 1 sampai 5." }, { status: 400 });
  }
  const ulasan =
    typeof body.ulasan === "string" && body.ulasan.trim()
      ? body.ulasan.trim().slice(0, 500)
      : null;

  const pesanan = await prisma.pesanan.findUnique({ where: { id } });

  // Hanya pemilik pesanan (cocok lewat email akun) yang boleh memberi rating
  if (
    !pesanan ||
    !user.email ||
    pesanan.email !== user.email.toLowerCase()
  ) {
    return Response.json({ message: "Pesanan tidak ditemukan." }, { status: 404 });
  }
  if (pesanan.status !== "Selesai") {
    return Response.json(
      { message: "Rating hanya bisa diberikan setelah pesanan selesai." },
      { status: 400 }
    );
  }
  if (pesanan.rating != null) {
    return Response.json({ message: "Pesanan ini sudah diberi rating." }, { status: 400 });
  }

  try {
    const diperbarui = await prisma.pesanan.update({
      where: { id },
      data: { rating, ulasan, ratedAt: new Date() },
      include: { items: { orderBy: { id: "asc" } } },
    });
    return Response.json(diperbarui);
  } catch (err) {
    console.error("Gagal menyimpan rating:", err);
    return Response.json(
      { message: "Gagal menyimpan rating. Coba lagi nanti." },
      { status: 500 }
    );
  }
}