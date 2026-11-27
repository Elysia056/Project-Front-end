"use client";
import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { Row, Col } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import EditorWebsite from "@/components/admin/editorwebsite";
import BuktiModal from "@/components/buktimodal";
import DashHeader from "@/components/dashheader";
import { logout, useCekAkses } from "@/lib/auth";
import { Pesanan, daftarItem, formatRupiah, formatTanggal } from "@/lib/pesanan";

export default function AdminPage() {
  const admin = useCekAkses("admin");
  const [daftarPesanan, setDaftarPesanan] = useState<Pesanan[]>([]);
  const [buktiSrc, setBuktiSrc] = useState<string | null>(null);
  const [tab, setTab] = useState<"pesanan" | "website">("pesanan");

  useEffect(() => {
    if (!admin) return;

    // Ambil semua pesanan dari database lewat API
    async function muatPesanan() {
      const res = await fetch("/api/pesanan");
      if (res.status === 401) {
        logout(); // sesi di server sudah berakhir
        return;
      }
      if (res.ok) {
        setDaftarPesanan((await res.json()) as Pesanan[]);
      }
    }
    muatPesanan();
  }, [admin]);

  if (!admin) {
    return null;
  }

  // id pesanan berbentuk "#BA-2026-1234", jadi harus di-encode saat masuk ke URL
  const ubahStatus = async (id: string, statusBaru: string) => {
    const res = await fetch(`/api/pesanan/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: statusBaru }),
    });
    if (res.status === 401) {
      logout();
      return;
    }
    if (res.ok) {
      const diubah: Pesanan = await res.json();
      setDaftarPesanan((prev) => prev.map((p) => (p.id === diubah.id ? diubah : p)));
    }
  };

  const hapusPesanan = async (id: string) => {
    if (!confirm("Yakin ingin menghapus pesanan ini?")) return;
    const res = await fetch(`/api/pesanan/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.status === 401) {
      logout();
      return;
    }
    if (res.ok) {
      setDaftarPesanan((prev) => prev.filter((p) => p.id !== id));
    }
  };

  let totalLoyang = 0;
  let totalSelesai = 0;
  let totalPendapatan = 0;

  daftarPesanan.forEach((pesanan) => {
    totalLoyang += pesanan.jumlah;
    if (pesanan.status === "Selesai") {
      totalSelesai++;
    }
    if (pesanan.status !== "Dibatalkan") {
      totalPendapatan += pesanan.totalBayar || 0;
    }
  });

  return (
    <div className="min-vh-100">
      <DashHeader>
        <Nav className="ms-auto flex-row align-items-center gap-2">
          <Button href="/" variant="outline-light" size="sm">
            &larr; Beranda
          </Button>
          <Badge bg="warning" text="dark" className="text-uppercase">
            Admin
          </Badge>
          <span className="text-light" id="adminNameLabel">
            {admin.nama}
          </span>
          <Button
            variant="outline-warning"
            size="sm"
            id="logoutBtn"
            onClick={logout}
          >
            Keluar
          </Button>
        </Nav>
      </DashHeader>

      <main className="py-5">
        <Container>
          <h1 className="font-serif fw-bold">Dashboard Admin</h1>
          <p className="form-hint-mono mb-3">
            {"// kelola pesanan dan ubah isi website dari satu tempat"}
          </p>

          <Nav
            variant="tabs"
            className="mb-4"
            activeKey={tab}
            onSelect={(k) => k && setTab(k as "pesanan" | "website")}
          >
            <Nav.Item>
              <Nav.Link eventKey="pesanan">Pesanan</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="website">Kelola Website</Nav.Link>
            </Nav.Item>
          </Nav>

          {tab === "website" && <EditorWebsite />}

          {tab === "pesanan" && (
          <>
          <Row className="g-3 mb-4">
            {[
              ["statTotalPesanan", String(daftarPesanan.length), "Total Pesanan"],
              ["statTotalLoyang", String(totalLoyang), "Total Loyang Dipesan"],
              ["statSelesai", String(totalSelesai), "Pesanan Selesai"],
              ["statPendapatan", formatRupiah(totalPendapatan), "Total Pendapatan"],
            ].map(([id, nilai, label]) => (
              <Col xs={6} lg={3} key={id}>
                <Card className="stat-card h-100 text-center shadow-sm">
                  <Card.Body>
                    <div className="stat-value" id={id}>
                      {nilai}
                    </div>
                    <div className="stat-tag">{label}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Card className="shadow-sm">
            <Card.Body>
              <Table responsive hover className="align-middle mb-0">
                <thead>
                  <tr>
                    <th>Tiket</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Rasa</th>
                    <th>Total</th>
                    <th>Subtotal</th>
                    <th>Alamat</th>
                    <th>Jarak</th>
                    <th>Ongkir</th>
                    <th>Metode Bayar</th>
                    <th>Bukti</th>
                    <th>Total Bayar</th>
                    <th>Catatan</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody id="tabelPesananBody">
                  {daftarPesanan.map((pesanan) => (
                    <tr key={pesanan.id}>
                      <td>{pesanan.id}</td>
                      <td>{pesanan.nama}</td>
                      <td>{pesanan.email}</td>
                      <td>
                        {daftarItem(pesanan).map((item, i) => (
                          <div key={i}>
                            {item.varian} &times;{item.jumlah}
                          </div>
                        ))}
                      </td>
                      <td>{pesanan.jumlah} Loyang</td>
                      <td>{pesanan.subtotal ? formatRupiah(pesanan.subtotal) : "-"}</td>
                      <td>{pesanan.alamat || "-"}</td>
                      <td>{pesanan.jarak ? pesanan.jarak + " km" : "-"}</td>
                      <td>{pesanan.ongkir ? formatRupiah(pesanan.ongkir) : "-"}</td>
                      <td>{pesanan.metodeBayar || "-"}</td>
                      <td>
                        {pesanan.buktiTransfer ? (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="btn-lihat-bukti"
                            onClick={() => setBuktiSrc(pesanan.buktiTransfer)}
                          >
                            Lihat Bukti
                          </Button>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        <strong className="text-warning-emphasis">
                          {pesanan.totalBayar ? formatRupiah(pesanan.totalBayar) : "-"}
                        </strong>
                      </td>
                      <td>{pesanan.catatan ? pesanan.catatan : "-"}</td>
                      <td>{formatTanggal(pesanan.tanggal)}</td>
                      <td>
                        <Form.Select
                          size="sm"
                          className="status-select"
                          value={pesanan.status}
                          onChange={(e) => ubahStatus(pesanan.id, e.target.value)}
                        >
                          <option value="Diproses">Diproses</option>
                          <option value="Dikirim">Dikirim</option>
                          <option value="Selesai">Selesai</option>
                          <option value="Dibatalkan">Dibatalkan</option>
                        </Form.Select>
                      </td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="btn-hapus"
                          onClick={() => hapusPesanan(pesanan.id)}
                        >
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Alert
                variant="warning"
                className="mt-3 mb-0"
                show={daftarPesanan.length === 0}
                id="emptyState"
              >
                Belum ada pesanan yang masuk. Pesanan baru dari form{" "}
                <Alert.Link href="/#pesan">Pesan</Alert.Link> akan otomatis
                muncul di sini.
              </Alert>
            </Card.Body>
          </Card>
          </>
          )}
        </Container>
      </main>

      <BuktiModal src={buktiSrc} onClose={() => setBuktiSrc(null)} />
    </div>
  );
}