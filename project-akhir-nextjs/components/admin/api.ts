// Fungsi bantu untuk memanggil API dari halaman admin.
// Kalau sesi login di server sudah berakhir (401), admin otomatis dikeluarkan ke halaman login.
import { logout } from "@/lib/auth";

export async function panggil<T>(
  url: string,
  metode: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  body?: unknown
): Promise<T> {
  const res = await fetch(url, {
    method: metode,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    await logout();
    throw new Error("Sesi login berakhir. Silakan login ulang.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message ?? "Terjadi kesalahan.");
  }
  return data as T;
}

const FORMAT_BOLEH = ["image/jpeg", "image/png", "image/webp"];
const SISI_MAKS = 1600; // gambar diperkecil di browser supaya ringan dan muat di batas Vercel
const UKURAN_MAKS = 3_800_000;

// Memperkecil gambar di browser lalu mengunggahnya. Mengembalikan alamat dan ukuran gambar.
export async function unggahGambar(
  file: File
): Promise<{ url: string; lebar: number; tinggi: number }> {
  if (!FORMAT_BOLEH.includes(file.type)) {
    throw new Error("Format gambar harus JPG, PNG, atau WebP.");
  }
  const bitmap = await createImageBitmap(file);
  const skala = Math.min(1, SISI_MAKS / Math.max(bitmap.width, bitmap.height));
  const lebar = Math.max(1, Math.round(bitmap.width * skala));
  const tinggi = Math.max(1, Math.round(bitmap.height * skala));

  const canvas = document.createElement("canvas");
  canvas.width = lebar;
  canvas.height = tinggi;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Browser tidak mendukung pengolahan gambar.");
  ctx.drawImage(bitmap, 0, 0, lebar, tinggi);

  const blob = await new Promise<Blob | null>((selesai) =>
    canvas.toBlob(selesai, "image/webp", 0.85)
  );
  if (!blob) throw new Error("Gagal memproses gambar.");
  if (blob.size > UKURAN_MAKS) {
    throw new Error("Gambar masih terlalu besar. Pilih gambar yang lebih kecil.");
  }

  const form = new FormData();
  form.append("file", new File([blob], "gambar.webp", { type: blob.type }));
  const res = await fetch("/api/gambar", { method: "POST", body: form });
  if (res.status === 401) {
    await logout();
    throw new Error("Sesi login berakhir. Silakan login ulang.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message ?? "Gagal mengunggah gambar.");
  }
  return { url: (data as { url: string }).url, lebar, tinggi };
}
