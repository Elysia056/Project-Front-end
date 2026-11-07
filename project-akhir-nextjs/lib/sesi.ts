import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const NAMA_COOKIE = "sesi";
const UMUR_SESI_DETIK = 60 * 60 * 24 * 7; // 7 hari

export interface UserSesi {
  id: number;
  username: string;
  role: string;
  nama: string;
  email: string | null;
}

// Membuat sesi baru untuk user dan memasangnya di cookie
export async function buatSesi(userId: number) {
  const token = randomBytes(32).toString("hex");
  await prisma.sesi.create({ data: { token, userId } });
  const toko = await cookies();
  toko.set(NAMA_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: UMUR_SESI_DETIK,
  });
}

// Menghapus sesi saat logout
export async function hapusSesi() {
  const toko = await cookies();
  const token = toko.get(NAMA_COOKIE)?.value;
  if (token) {
    await prisma.sesi.deleteMany({ where: { token } });
  }
  toko.delete(NAMA_COOKIE);
}

// Mengambil user yang sedang login berdasarkan cookie (null kalau belum login / kedaluwarsa)
export async function ambilUserSesi(): Promise<UserSesi | null> {
  const toko = await cookies();
  const token = toko.get(NAMA_COOKIE)?.value;
  if (!token) return null;

  const sesi = await prisma.sesi.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!sesi) return null;

  const umurDetik = (Date.now() - sesi.createdAt.getTime()) / 1000;
  if (umurDetik > UMUR_SESI_DETIK) {
    await prisma.sesi.deleteMany({ where: { token } });
    return null;
  }

  const { id, username, role, nama, email } = sesi.user;
  return { id, username, role, nama, email };
}

// Dipakai di API khusus admin: mengembalikan user admin, atau response error yang siap dikirim
export async function wajibAdmin(): Promise<
  { user: UserSesi; error?: undefined } | { user?: undefined; error: Response }
> {
  const user = await ambilUserSesi();
  if (!user) {
    return {
      error: Response.json(
        { message: "Sesi login berakhir. Silakan login ulang." },
        { status: 401 }
      ),
    };
  }
  if (user.role !== "admin") {
    return {
      error: Response.json({ message: "Khusus admin." }, { status: 403 }),
    };
  }
  return { user };
}
