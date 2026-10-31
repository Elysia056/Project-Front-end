import { useEffect, useRef, useState } from "react";

export interface Akun {
  username: string;
  password: string;
  role: "admin" | "user";
  nama: string;
  email?: string;
}

// Daftar akun default untuk admin
const AKUN_DEFAULT: Akun[] = [
  {
    username: "admin",
    password: "admin123",
    role: "admin",
    nama: "Admin Bika Ambon",
  },
];

// Ambil semua akun: default (admin) + hasil sign up user
export function ambilSemuaAkun(): Akun[] {
  const dariSignup: Akun[] = JSON.parse(
    localStorage.getItem("bikaAmbonUsers") || "[]"
  );
  return AKUN_DEFAULT.concat(dariSignup);
}

// Mengambil data user yang sedang login dari localStorage
export function ambilUserLogin(): Akun | null {
  const data = localStorage.getItem("currentUser");
  if (!data) {
    return null;
  }
  return JSON.parse(data);
}

// Logout: hapus data login lalu kembali ke halaman login
export function logout() {
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