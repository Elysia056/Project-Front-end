"use client";
import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import DashHeader from "@/components/dashheader";
import { Akun, ambilUserLogin, simpanUserLogin } from "@/lib/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tampilPassword, setTampilPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Cek username dan password ke database lewat API
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const akun = data as Akun;
      simpanUserLogin(akun);

      if (akun.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/user";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal login. Coba lagi.");
      setLoading(false);
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

              <Button
                type="submit"
                variant="dark"
                className="w-100 py-2"
                disabled={loading}
              >
                {loading ? "Memeriksa..." : "Masuk"}
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