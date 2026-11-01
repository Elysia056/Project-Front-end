// Route Handler: POST /api/auth/signup -> mendaftarkan akun pelanggan baru
import { prisma } from "@/lib/prisma";

type SignupBody = {
  nama?: string;
  email?: string;
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as SignupBody;
  const nama = body.nama?.trim();
  const email = body.email?.trim();
  const username = body.username?.trim();
  const password = body.password?.trim();

  // Validasi sederhana di sisi server
  if (!nama || !email || !username || !password) {
    return Response.json({ message: "Semua kolom wajib diisi." }, { status: 400 });
  }
  if (password.length < 6) {
    return Response.json({ message: "Password minimal 6 karakter." }, { status: 400 });
  }

  // Username dan email tidak boleh kembar (huruf besar/kecil dianggap sama)
  const usernameDipakai = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
  });
  if (usernameDipakai) {
    return Response.json({ message: "Username sudah dipakai. Coba yang lain." }, { status: 409 });
  }

  const emailDipakai = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });
  if (emailDipakai) {
    return Response.json({ message: "Email sudah terdaftar. Silakan login." }, { status: 409 });
  }

  try {
    const user = await prisma.user.create({
      data: { username, password, role: "user", nama, email },
    });
    return Response.json(
      { username: user.username, role: user.role, nama: user.nama, email: user.email },
      { status: 201 }
    );
  } catch {
    return Response.json({ message: "Gagal mendaftar. Coba lagi." }, { status: 500 });
  }
}
