"use client";
import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import DashHeader from "@/components/dashheader";

export default function SignupPage() {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [tampilPassword, setTampilPassword] = useState(false);
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    setLoading(true);
    try {
      // Simpan akun baru ke database lewat API
      // (pengecekan username dan email kembar dilakukan di server)
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: namaLengkap,
          email,
          username,
          password: passwordBersih,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mendaftar. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <DashHeader />

      <Container className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <Card className="shadow w-100" style={{ maxWidth: 480 }}>
          <Card.Body className="p-4 p-md-5">
            <h2 className="font-serif fw-bold">Daftar Akun</h2>
            <p className="form-hint-mono mb-3">{"// buat akun pelanggan baru"}</p>

            <Alert variant="danger" show={error !== ""} id="signupError">
              {error}
            </Alert>
            <Alert variant="success" show={sukses !== ""} id="signupSuccess">
              {sukses}
            </Alert>

            <Form id="signupForm" onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="namaLengkap">
                <Form.Label>Nama Lengkap</Form.Label>
                <Form.Control
                  type="text"
                  name="namaLengkap"
                  placeholder="Nama Anda"
                  required
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="emailSignup">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="emailSignup"
                  placeholder="nama@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="usernameSignup">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="usernameSignup"
                  placeholder="username unik"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="passwordSignup">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={tampilPassword ? "text" : "password"}
                    name="passwordSignup"
                    placeholder="Min. 6 karakter"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    variant="outline-secondary"
                    id="togglePasswordSignupBtn"
                    onClick={() => setTampilPassword(!tampilPassword)}
                  >
                    {tampilPassword ? "Sembunyikan" : "Tampilkan"}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4" controlId="passwordConfirm">
                <Form.Label>Konfirmasi Password</Form.Label>
                <Form.Control
                  type="password"
                  name="passwordConfirm"
                  placeholder="Ulangi password"
                  required
                  minLength={6}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </Form.Group>

              <Button
                type="submit"
                variant="dark"
                className="w-100 py-2"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Daftar Sekarang"}
              </Button>
            </Form>

            <p className="text-center mt-4">
              Sudah punya akun? <a href="/login">Masuk di sini</a>
            </p>
            <p className="text-center mb-0">
              <a href="/">&larr; Kembali ke halaman utama</a>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}