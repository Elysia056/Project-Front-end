"use client";
import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Nav from "react-bootstrap/Nav";
import BuktiModal from "@/components/buktimodal";
import DashHeader from "@/components/dashheader";
import { logout, useCekAkses } from "@/lib/auth";
import { Pesanan, ambilPesanan, formatRupiah } from "@/lib/pesanan";

export default function UserPage() {
  const user = useCekAkses("user");
  const [pesananSaya, setPesananSaya] = useState<Pesanan[]>([]);
  const [buktiSrc, setBuktiSrc] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setPesananSaya(
        ambilPesanan().filter((pesanan) => pesanan.email === user.email)
      );
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const warnaStatus: Record<string, string> = {
    Diproses: "warning",
    Dikirim: "info",
    Selesai: "success",
    Dibatalkan: "danger",
  };

  return (
    <div className="min-vh-100">
      <DashHeader>
        <Nav className="ms-auto flex-row align-items-center gap-2">
          <Button href="/" variant="outline-light" size="sm">
            &larr; Beranda
          </Button>
          <Badge bg="warning" text="dark" className="text-uppercase">
            Pelanggan
          </Badge>
          <span className="text-light" id="userNameLabel">
            {user.nama}
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
          <h1 className="font-serif fw-bold">Dashboard Saya</h1>
          <p className="form-hint-mono mb-4">
            {"// pesanan atas nama akun "}
            <span id="userEmailLabel">{user.email}</span>
          </p>

          <Card className="shadow-sm">
            <Card.Body>
              <Table responsive hover className="align-middle mb-0">
                <thead>
                  <tr>
                    <th>Tiket</th>
                    <th>Varian</th>
                    <th>Jumlah</th>
                    <th>Subtotal</th>
                    <th>Alamat</th>
                    <th>Jarak</th>
                    <th>Ongkir</th>
                    <th>Metode Bayar</th>
                    <th>Bukti</th>
                    <th>Total Bayar</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="tabelPesananSayaBody">
                  {pesananSaya.map((pesanan, index) => (
                    <tr key={index}>
                      <td>{pesanan.id}</td>
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
                      <td>{pesanan.tanggal}</td>
                      <td>
                        <Badge
                          bg={warnaStatus[pesanan.status] || "secondary"}
                          text={pesanan.status === "Diproses" ? "dark" : undefined}
                        >
                          {pesanan.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Alert
                variant="warning"
                className="mt-3 mb-0"
                show={pesananSaya.length === 0}
                id="emptyStateUser"
              >
                Anda belum memiliki pesanan. Gunakan email yang sama pada form
                pemesanan agar pesanan Anda muncul di sini.
              </Alert>
            </Card.Body>
          </Card>

          <Button href="/#pesan" variant="amber" className="mt-4">
            Pesan Bika Ambon &rarr;
          </Button>
        </Container>
      </main>

      <BuktiModal src={buktiSrc} onClose={() => setBuktiSrc(null)} />
    </div>
  );
}