// Route Handler: /api/konten/:kunci   (kunci: navbar, hero, cerita, keunikan, galeri, proses, lokasi, pesan, footer)
// PUT    -> menyimpan isi satu bagian website (khusus admin)
// DELETE -> mengembalikan satu bagian ke isi bawaan (khusus admin)
import { prisma } from "@/lib/prisma";
import { wajibAdmin } from "@/lib/sesi";
import { ambilSemuaKonten, hapusGambarLama } from "@/lib/kontenserver";
import {
  DAFTAR_KUNCI,
  KONTEN_DEFAULT,
  KunciKonten,
  SemuaKonten,
  gabungDenganDefault,
  srcGambarAman,
  urlAman,
} from "@/lib/konten";

type Context = { params: Promise<{ kunci: string }> };

function kunciValid(kunci: string): kunci is KunciKonten {
  return (DAFTAR_KUNCI as string[]).includes(kunci);
}

// Merapikan dan memeriksa isi sebelum disimpan. Mengembalikan teks error kalau tidak valid.
function periksa(kunci: KunciKonten, nilai: SemuaKonten[KunciKonten]): string | null {
  if (kunci === "hero") {
    const hero = nilai as SemuaKonten["hero"];
    if (!srcGambarAman(hero.gambarRongga) || !srcGambarAman(hero.gambarKulit)) {
      return "Alamat gambar hero tidak valid.";
    }
  }
  if (kunci === "lokasi") {
    const lokasi = nilai as SemuaKonten["lokasi"];
    if (!lokasi.mapSrc.startsWith("https://")) {
      return "Link peta harus diawali https://";
    }
    for (const s of lokasi.sosial) {
      if (!urlAman(s.href)) return "Link media sosial harus diawali https://";
      if (!s.ikon.startsWith("bx ")) return "Ikon media sosial tidak valid.";
    }
  }
  if (kunci === "pesan") {
    const pesan = nilai as SemuaKonten["pesan"];
    if (!Number.isFinite(pesan.hargaPerLoyang) || pesan.hargaPerLoyang < 1000 || pesan.hargaPerLoyang > 100_000_000) {
      return "Harga per loyang tidak valid.";
    }
    if (!Number.isFinite(pesan.tarifPerKm) || pesan.tarifPerKm < 0 || pesan.tarifPerKm > 1_000_000) {
      return "Tarif per km tidak valid.";
    }
    if (pesan.varian.length === 0 || pesan.varian.some((v) => typeof v !== "string" || !v.trim())) {
      return "Minimal satu varian, dan nama varian tidak boleh kosong.";
    }
    const { lat, lng } = pesan.toko;
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      return "Koordinat toko tidak valid.";
    }
  }
  return null;
}

export async function PUT(request: Request, context: Context) {
  const admin = await wajibAdmin();
  if (admin.error) return admin.error;

  const { kunci } = await context.params;
  if (!kunciValid(kunci)) {
    return Response.json({ message: "Bagian website tidak dikenal." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Data tidak valid." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ message: "Data tidak valid." }, { status: 400 });
  }

  let bersih = gabungDenganDefault(KONTEN_DEFAULT[kunci], body) as SemuaKonten[KunciKonten];

  // Menu navbar: id tetap (dipakai untuk scroll ke bagian), admin hanya mengubah label
  if (kunci === "navbar") {
    const navbar = bersih as SemuaKonten["navbar"];
    const labelBaru = new Map(
      (((body as Record<string, unknown>).menu as { id?: string; label?: string }[]) ?? []).map(
        (m) => [m?.id, m?.label]
      )
    );
    navbar.menu = KONTEN_DEFAULT.navbar.menu.map((m) => ({
      id: m.id,
      label: String(labelBaru.get(m.id) ?? "").trim() || m.label,
    }));
    bersih = navbar;
  }

  const salah = periksa(kunci, bersih);
  if (salah) {
    return Response.json({ message: salah }, { status: 400 });
  }

  const teks = JSON.stringify(bersih);
  if (teks.length > 100_000) {
    return Response.json({ message: "Isi terlalu panjang." }, { status: 400 });
  }

  // Simpan gambar hero lama untuk dibersihkan setelah disimpan
  const lama = kunci === "hero" ? (await ambilSemuaKonten()).hero : null;

  await prisma.konten.upsert({
    where: { kunci },
    update: { nilai: teks },
    create: { kunci, nilai: teks },
  });

  if (lama) {
    const baru = bersih as SemuaKonten["hero"];
    await hapusGambarLama(lama.gambarRongga, baru.gambarRongga);
    await hapusGambarLama(lama.gambarKulit, baru.gambarKulit);
  }

  return Response.json(bersih);
}

export async function DELETE(_request: Request, context: Context) {
  const admin = await wajibAdmin();
  if (admin.error) return admin.error;

  const { kunci } = await context.params;
  if (!kunciValid(kunci)) {
    return Response.json({ message: "Bagian website tidak dikenal." }, { status: 404 });
  }

  const lama = kunci === "hero" ? (await ambilSemuaKonten()).hero : null;
  await prisma.konten.deleteMany({ where: { kunci } });

  if (lama) {
    await hapusGambarLama(lama.gambarRongga, KONTEN_DEFAULT.hero.gambarRongga);
    await hapusGambarLama(lama.gambarKulit, KONTEN_DEFAULT.hero.gambarKulit);
  }

  return Response.json(KONTEN_DEFAULT[kunci]);
}
