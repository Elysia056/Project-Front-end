"use client";
import { useEffect, useState } from "react";
import DashHeader from "@/components/dashheader";
import { ambilSemuaAkun, ambilUserLogin } from "@/lib/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tampilPassword, setTampilPassword] = useState(false);
  const [error, setError] = useState("");

  // Jika sudah login sebelumnya, langsung arahkan ke dashboard masing-masing
  useEffect(() => {
    const userSudahLogin = ambilUserLogin();
    if (userSudahLogin) {
      if (userSudahLogin.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/user";
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const usernameBersih = username.trim();
    const passwordBersih = password.trim();

    let akunDitemukan = null;

    // Ambil SEMUA akun (admin default + user hasil sign up)
    const semuaAkun = ambilSemuaAkun();

    // cari akun yang cocok menggunakan perulangan for
    for (let i = 0; i < semuaAkun.length; i++) {
      if (
        semuaAkun[i].username === usernameBersih &&
        semuaAkun[i].password === passwordBersih
      ) {
        akunDitemukan = semuaAkun[i];
        break;
      }
    }

    if (akunDitemukan) {
      // Simpan status login ke localStorage
      localStorage.setItem("currentUser", JSON.stringify(akunDitemukan));
      setError("");

      if (akunDitemukan.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/user";
      }
    } else {
      setError("Username atau password salah. Silakan coba lagi atau daftar dulu.");
    }
  };

  return (
    <div className="login-page-body">
      <DashHeader />

      <main className="login-main">
        <div className="login-card">
          <h2>Masuk</h2>
          <p className="login-subtitle">{"// login untuk Admin & Pelanggan"}</p>

          <div
            className={error ? "login-error show" : "login-error"}
            id="loginError"
          >
            {error}
          </div>

          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                placeholder="admin / user"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="password-field-wrapper">
                <input
                  type={tampilPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Masukkan password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-toggle-password"
                  id="togglePasswordBtn"
                  onClick={() => setTampilPassword(!tampilPassword)}
                >
                  {tampilPassword ? "Sembunyikan" : "Tampilkan"}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-submit-ticket">
              Masuk
            </button>
          </form>

          <p className="login-hint" style={{ textAlign: "center" }}>
            Belum punya akun?{" "}
            <a
              href="/signup"
              style={{ color: "var(--accent-amber-dark)", fontWeight: 700 }}
            >
              Daftar di sini
            </a>
          </p>

          <a href="/" className="login-back-link">
            &larr; Kembali ke halaman utama
          </a>
        </div>
      </main>
    </div>
  );
}