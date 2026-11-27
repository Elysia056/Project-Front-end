import { prisma } from "@/lib/prisma";
import {
  DAFTAR_KUNCI,
  GALERI_DEFAULT,
  ItemGaleri,
  KONTEN_DEFAULT,
  KunciKonten,
  SemuaKonten,
  gabungDenganDefault,
} from "@/lib/konten";

// Mengambil seluruh isi website (isi database digabung dengan isi bawaan)
export async function ambilSemuaKonten(): Promise<SemuaKonten> {
  const hasil: SemuaKonten = structuredClone(KONTEN_DEFAULT);
  try {
    const baris = await prisma.konten.findMany({
      where: { kunci: { in: DAFTAR_KUNCI } },
    });
    for (const b of baris) {
      const kunci = b.kunci as KunciKonten;
      try {
        const nilai = JSON.parse(b.nilai);
        (hasil as unknown as Record<string, unknown>)[kunci] = gabungDenganDefault(
          KONTEN_DEFAULT[kunci],
          nilai
        );
      } catch {

      }
    }
  } catch {

  }
  return hasil;
}

export async function ambilGaleri(): Promise<ItemGaleri[]> {
  try {
    const sudahAwal = await prisma.konten.findUnique({ where: { kunci: "galeri_awal" } });
    if (!sudahAwal) {
      try {
        await prisma.konten.create({ data: { kunci: "galeri_awal", nilai: "1" } });
        await prisma.itemGaleri.createMany({
          data: GALERI_DEFAULT.map((item, i) => ({ ...item, urutan: i })),
        });
      } catch {

      }
    }
    return await prisma.itemGaleri.findMany({
      orderBy: [{ urutan: "asc" }, { id: "asc" }],
    });
  } catch {
    return GALERI_DEFAULT.map((item, i) => ({ ...item, id: -(i + 1), urutan: i }));
  }
}

// Menghapus gambar unggahan lama dari database kalau tidak dipakai lagi
export async function hapusGambarLama(srcLama: string, srcBaru: string) {
  const awalan = "/api/gambar/";
  if (!srcLama.startsWith(awalan) || srcLama === srcBaru) return;
  const id = srcLama.slice(awalan.length);
  try {
    await prisma.gambar.delete({ where: { id } });
  } catch {

  }
}
