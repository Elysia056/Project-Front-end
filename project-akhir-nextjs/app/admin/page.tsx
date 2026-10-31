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
import BuktiModal from "@/components/buktimodal";
import DashHeader from "@/components/dashheader";
import { logout, useCekAkses } from "@/lib/auth";
import { Pesanan, ambilPesanan, formatRupiah, simpanPesanan } from "@/lib/pesanan";

export default function AdminPage() {
  const admin = useCekAkses("admin");
  const [daftarPesanan, setDaftarPesanan] = useState<Pesanan[]>([]);
  const [buktiSrc, setBuktiSrc] = useState<string | null>(null);

  useEffect(() => {
    if (admin) {
      setDaftarPesanan(ambilPesanan());
    }
  }, [admin]);

  if (!admin) {
    return null;
  }

  const ubahStatus = (index: number, statusBaru: string) => {
    const daftar = ambilPesanan();
    daftar[index].status = statusBaru;
    simpanPesanan(daftar);
    setDaftarPesanan(daftar);
  };

  const hapusPesanan = (index: number) => {
    const konfirmasi = confirm("Yakin ingin menghapus pesanan ini?");
    if (konfirmasi) {
      const daftar = ambilPesanan();
      daftar.splice(index, 1);
      simpanPesanan(daftar);
      setDaftarPesanan(daftar);
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
          <p className="form-hint-mono mb-4">
            {"// kelola seluruh pesanan yang masuk dari pelanggan"}
          </p>

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
                    <th>Varian</th>
                    <th>Jumlah</th>
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
                  {daftarPesanan.map((pesanan, index) => (
                    <tr key={index}>
                      <td>{pesanan.id}</td>
                      <td>{pesanan.nama}</td>
                      <td>{pesanan.email}</td>
                      <td>{pesanan.varian}</td>
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
                      <td>{pesanan.tanggal}</td>
                      <td>
                        <Form.Select
                          size="sm"
                          className="status-select"
                          value={pesanan.status}
                          onChange={(e) => ubahStatus(index, e.target.value)}
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
                          onClick={() => hapusPesanan(index)}
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
        </Container>
      </main>

      <BuktiModal src={buktiSrc} onClose={() => setBuktiSrc(null)} />
    </div>
  );
}