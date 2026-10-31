"use client";
import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
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

    // Mencari akun yang cocok menggunakan perulangan for
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
    <div className="min-vh-100 d-flex flex-column">
      <DashHeader />

      <Container className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <Card className="shadow w-100" style={{ maxWidth: 440 }}>
          <Card.Body className="p-4 p-md-5">
            <h2 className="font-serif fw-bold">Masuk</h2>
            <p className="form-hint-mono mb-3">
              {"// login untuk Admin & Pelanggan"}
            </p>

            <Alert variant="danger" show={error !== ""} id="loginError">
              {error}
            </Alert>

            <Form id="loginForm" onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="admin / user"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={tampilPassword ? "text" : "password"}
                    name="password"
                    placeholder="Masukkan password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    variant="outline-secondary"
                    id="togglePasswordBtn"
                    onClick={() => setTampilPassword(!tampilPassword)}
                  >
                    {tampilPassword ? "Sembunyikan" : "Tampilkan"}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Button type="submit" variant="dark" className="w-100 py-2">
                Masuk
              </Button>
            </Form>

            <p className="text-center mt-4">
              Belum punya akun? <a href="/signup">Daftar di sini</a>
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