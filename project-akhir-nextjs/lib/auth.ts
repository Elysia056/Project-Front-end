import { useEffect, useRef, useState } from "react";

export interface Akun {
  username: string;
  role: "admin" | "user";
  nama: string;
  email?: string | null;
}

// Menyimpan data user yang berhasil login (tanpa password).
// Data akun sendiri sekarang ada di database PostgreSQL (tabel User),
// localStorage hanya dipakai untuk mengingat siapa yang sedang login.
export function simpanUserLogin(akun: Akun) {
  localStorage.setItem("currentUser", JSON.stringify(akun));
}

// Mengambil data user yang sedang login dari localStorage
export function ambilUserLogin(): Akun | null {
  const data = localStorage.getItem("currentUser");
  if (!data) {
    return null;
  }
  return JSON.parse(data);
}

// Logout: hapus sesi di server, hapus data login di browser, lalu kembali ke halaman login
export async function logout() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {
    // tetap lanjut keluar di browser
  }
  localStorage.removeItem("currentUser");
  window.location.href = "/login";
}

// Mengecek apakah halaman boleh diakses sesuai role yang dibutuhkan
// Mengembalikan user kalau boleh, null kalau belum / tidak boleh
export function useCekAkses(roleDibutuhkan: "admin" | "user"): Akun | null {
  const [user, setUser] = useState<Akun | null>(null);
  const sudahCek = useRef(false);

  useEffect(() => {
    if (sudahCek.current) return;
    sudahCek.current = true;

    const userLogin = ambilUserLogin();

    if (!userLogin) {
      alert("Anda harus login terlebih dahulu.");
      window.location.href = "/login";
      return;
    }

    if (userLogin.role !== roleDibutuhkan) {
      alert("Anda tidak memiliki akses ke halaman ini.");
      window.location.href = "/login";
      return;
    }

    setUser(userLogin);
  }, [roleDibutuhkan]);

  return user;
}