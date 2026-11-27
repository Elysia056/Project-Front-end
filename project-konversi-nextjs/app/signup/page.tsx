"use client";
import { useState } from "react";
import DashHeader from "@/components/dashheader";
import { Akun, ambilSemuaAkun } from "@/lib/auth";

export default function SignupPage() {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [tampilPassword, setTampilPassword] = useState(false);
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const namaBersih = namaLengkap.trim();
    const emailBersih = email.trim();
    const usernameBersih = username.trim();
    const passwordBersih = password.trim();
    const confirmBersih = passwordConfirm.trim();

    // Reset pesan
    setError("");
    setSukses("");

    // Validasi: password cocok
    if (passwordBersih !== confirmBersih) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    // Validasi: password minimal 6 karakter
    if (passwordBersih.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    // Ambil daftar user dari localStorage (user yang sudah sign up sebelumnya)
    const daftarUser: Akun[] = JSON.parse(
      localStorage.getItem("bikaAmbonUsers") || "[]"
    );

    // Cek apakah username sudah dipakai (termasuk cek admin)
    const semuaAkun = ambilSemuaAkun();
    const usernameDipakai = semuaAkun.some(
      (u) => u.username.toLowerCase() === usernameBersih.toLowerCase()
    );
    const emailDipakai = daftarUser.some(
      (u) => (u.email || "").toLowerCase() === emailBersih.toLowerCase()
    );

    if (usernameDipakai) {
      setError("Username sudah dipakai. Coba yang lain.");
      return;
    }

    if (emailDipakai) {
      setError("Email sudah terdaftar. Silakan login.");
      return;
    }

    // Buat user baru
    const userBaru: Akun = {
      username: usernameBersih,
      password: passwordBersih,
      role: "user",
      nama: namaBersih,
      email: emailBersih,
    };

    daftarUser.push(userBaru);
    localStorage.setItem("bikaAmbonUsers", JSON.stringify(daftarUser));

    // Tampilkan sukses
    setSukses("Pendaftaran berhasil! Mengalihkan ke halaman login...");
    setNamaLengkap("");
    setEmail("");
    setUsername("");
    setPassword("");
    setPasswordConfirm("");

    // Redirect ke login setelah 1.5 detik
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  };

  return (
    <div className="login-page-body">
      <DashHeader />

      <main className="login-main">
        <div className="login-card">
          <h2>Daftar Akun</h2>
          <p className="login-subtitle">{"// buat akun pelanggan baru"}</p>

          <div
            className={error ? "login-error show" : "login-error"}
            id="signupError"
          >
            {error}
          </div>
          <div
            className={sukses ? "login-success show" : "login-success"}
            id="signupSuccess"
          >
            {sukses}
          </div>

          <form id="signupForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="namaLengkap" className="form-label">
                Nama Lengkap
              </label>
              <input
                type="text"
                id="namaLengkap"
                name="namaLengkap"
                className="form-input"
                placeholder="Nama Anda"
                required
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="emailSignup" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="emailSignup"
                name="emailSignup"
                className="form-input"
                placeholder="nama@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="usernameSignup" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="usernameSignup"
                name="usernameSignup"
                className="form-input"
                placeholder="username unik"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="passwordSignup" className="form-label">
                Password
              </label>
              <div className="password-field-wrapper">
                <input
                  type={tampilPassword ? "text" : "password"}
                  id="passwordSignup"
                  name="passwordSignup"
                  className="form-input"
                  placeholder="Min. 6 karakter"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-toggle-password"
                  id="togglePasswordSignupBtn"
                  onClick={() => setTampilPassword(!tampilPassword)}
                >
                  {tampilPassword ? "Sembunyikan" : "Tampilkan"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="passwordConfirm" className="form-label">
                Konfirmasi Password
              </label>
              <input
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                className="form-input"
                placeholder="Ulangi password"
                required
                minLength={6}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-submit-ticket">
              Daftar Sekarang
            </button>
          </form>

          <p
            className="login-hint"
            style={{ textAlign: "center", marginTop: "1.5rem" }}
          >
            Sudah punya akun?{" "}
            <a
              href="/login"
              style={{ color: "var(--accent-amber-dark)", fontWeight: 700 }}
            >
              Masuk di sini
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