// Route Handler: GET /api/konten -> seluruh isi teks website (dipakai editor di halaman admin)
import { ambilSemuaKonten } from "@/lib/kontenserver";

export async function GET() {
  return Response.json(await ambilSemuaKonten());
}
