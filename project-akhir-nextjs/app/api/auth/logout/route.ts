// Route Handler: POST /api/auth/logout -> menghapus sesi login
import { hapusSesi } from "@/lib/sesi";

export async function POST() {
  await hapusSesi();
  return Response.json({ message: "Berhasil keluar." });
}
