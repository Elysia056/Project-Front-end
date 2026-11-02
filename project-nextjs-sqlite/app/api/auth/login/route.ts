// Route Handler: POST /api/auth/login -> memeriksa username dan password
import { prisma } from "@/lib/prisma";

type LoginBody = { username?: string; password?: string };

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;
  const username = body.username?.trim().toLowerCase();
  const password = body.password?.trim();

  if (!username || !password) {
    return Response.json({ message: "Username dan password wajib diisi." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || user.password !== password) {
    return Response.json(
      { message: "Username atau password salah. Silakan coba lagi atau daftar dulu." },
      { status: 401 }
    );
  }

  // Password tidak ikut dikirim ke browser
  return Response.json({
    username: user.username,
    role: user.role,
    nama: user.nama,
    email: user.email,
  });
}
