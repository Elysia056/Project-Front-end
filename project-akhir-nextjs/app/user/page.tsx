"use client";
import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Table from "react-bootstrap/Table";
import BuktiModal from "@/components/buktimodal";
import DashHeader from "@/components/dashheader";
import StarRating from "@/components/starrating";
import { logout, useCekAkses } from "@/lib/auth";
import { Pesanan, daftarItem, formatRupiah, formatTanggal } from "@/lib/pesanan";

export default function UserPage() {
  const user = useCekAkses("user");
  const [pesananSaya, setPesananSaya] = useState<Pesanan[]>([]);
  const [buktiSrc, setBuktiSrc] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("Semua");

  // State untuk Modal Pesan Lagi
  const [pesanUlangTarget, setPesanUlangTarget] = useState<Pesanan | null>(null);
  const [metodeUlang, setMetodeUlang] = useState<string>("Cash");
  const [buktiUlang, setBuktiUlang] = useState<string | null>(null);
  const [memesanUlang, setMemesanUlang] = useState<boolean>(false);

  // State untuk Modal Rating
  const [ratingTarget, setRatingTarget] = useState<Pesanan | null>(null);
  const [nilai, setNilai] = useState(0);
  const [ulasan, setUlasan] = useState("");
  const [mengirimRating, setMengirimRating] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function muatPesanan() {
      const res = await fetch("/api/pesanan");
      if (res.status === 401) {
        logout();
        return;
      }
      if (res.ok) {
        setPesananSaya((await res.json()) as Pesanan[]);
      }
    }
    muatPesanan();
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

  const daftarFilter = ["Semua", "Diproses", "Dikirim", "Selesai", "Dibatalkan"];

  const pesananTersaring =
    filterStatus === "Semua"
      ? pesananSaya
      : pesananSaya.filter((p) => p.status === filterStatus);

  const bukaModalPesanLagi = (pesanan: Pesanan) => {
    setPesanUlangTarget(pesanan);
    setMetodeUlang(pesanan.metodeBayar || "Cash");
    setBuktiUlang(pesanan.metodeBayar === "Cash" ? null : pesanan.buktiTransfer || null);
  };

  const handleUploadBuktiUlang = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setBuktiUlang(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const kirimPesanLagi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pesanUlangTarget) return;

    const perluBukti = metodeUlang === "Transfer BCA" || metodeUlang === "GoPay";
    if (perluBukti && !buktiUlang) {
      alert("Mohon upload bukti transfer untuk metode " + metodeUlang + ".");
      return;
    }

    setMemesanUlang(true);
    try {
      const res = await fetch("/api/pesanan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: pesanUlangTarget.nama,
          email: pesanUlangTarget.email,
          items: daftarItem(pesanUlangTarget).map((item) => ({
            varian: item.varian,
            jumlah: item.jumlah,
          })),
          catatan: pesanUlangTarget.catatan || "",
          alamat: pesanUlangTarget.alamat,
          jarak: pesanUlangTarget.jarak,
          metodeBayar: metodeUlang,
          buktiTransfer: perluBukti ? buktiUlang : null,
        }),
      });
      const hasil = await res.json();
      if (!res.ok) throw new Error(hasil.message);

      const pesananBaru = hasil as Pesanan;
      setPesananSaya((lama) => [...lama, pesananBaru]);
      setFilterStatus("Semua");
      setPesanUlangTarget(null);
      alert(`Pesanan ulang berhasil dibuat dengan nomor tiket ${pesananBaru.id}!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal membuat pesanan ulang.");
    } finally {
      setMemesanUlang(false);
    }
  };

  const kirimRating = async () => {
    if (!ratingTarget || nilai < 1) return;
    setMengirimRating(true);
    try {
      const res = await fetch(
        `/api/pesanan/${encodeURIComponent(ratingTarget.id)}/rating`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating: nilai, ulasan }),
        }
      );
      const hasil = await res.json().catch(() => null);
      if (!res.ok) throw new Error(hasil?.message ?? `Server error (${res.status})`);
      setPesananSaya((prev) => prev.map((p) => (p.id === hasil.id ? hasil : p)));
      setRatingTarget(null);
      setNilai(0);
      setUlasan("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal mengirim rating.");
    } finally {
      setMengirimRating(false);
    }
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

          {pesananSaya.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {daftarFilter.map((status) => {
                const jumlah =
                  status === "Semua"
                    ? pesananSaya.length
                    : pesananSaya.filter((p) => p.status === status).length;
                const aktif = filterStatus === status;

                return (
                  <Button
                    key={status}
                    size="sm"
                    variant={aktif ? "dark" : "outline-secondary"}
                    className="rounded-pill px-3"
                    onClick={() => setFilterStatus(status)}
                  >
                    {status}{" "}
                    <Badge
                      bg={aktif ? "warning" : "secondary"}
                      text={aktif ? "dark" : undefined}
                      className="ms-1 rounded-pill"
                    >
                      {jumlah}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          )}

          <Card className="shadow-sm">
            <Card.Body>
              <Table responsive hover className="align-middle mb-0">
                <thead>
                  <tr>
                    <th>Tiket</th>
                    <th>Rasa</th>
                    <th>Total</th>
                    <th>Subtotal</th>
                    <th>Alamat</th>
                    <th>Jarak</th>
                    <th>Ongkir</th>
                    <th>Metode Bayar</th>
                    <th>Bukti</th>
                    <th>Total Bayar</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Rating</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody id="tabelPesananSayaBody">
                  {pesananTersaring.map((pesanan) => (
                    <tr key={pesanan.id}>
                      <td>{pesanan.id}</td>
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
                      <td>{formatTanggal(pesanan.tanggal)}</td>
                      <td>
                        <Badge
                          bg={warnaStatus[pesanan.status] || "secondary"}
                          text={pesanan.status === "Diproses" ? "dark" : undefined}
                        >
                          {pesanan.status}
                        </Badge>
                      </td>
                      <td>
                        {pesanan.rating ? (
                          <StarRating value={pesanan.rating} readOnly size={18} />
                        ) : pesanan.status === "Selesai" ? (
                          <Button
                            variant="warning"
                            size="sm"
                            className="text-nowrap"
                            onClick={() => setRatingTarget(pesanan)}
                          >
                            Beri Rating
                          </Button>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        {(pesanan.status === "Selesai" ||
                          pesanan.status === "Dibatalkan") ? (
                          <Button
                            variant="outline-dark"
                            size="sm"
                            className="text-nowrap"
                            onClick={() => bukaModalPesanLagi(pesanan)}
                          >
                            Pesan Lagi
                          </Button>
                        ) : (
                          "-"
                        )}
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

              <Alert
                variant="secondary"
                className="mt-3 mb-0"
                show={pesananSaya.length > 0 && pesananTersaring.length === 0}
              >
                Tidak ada pesanan dengan status <strong>{filterStatus}</strong>.
              </Alert>
            </Card.Body>
          </Card>

          <Button href="/#pesan" variant="amber" className="mt-4">
            Pesan Bika Ambon &rarr;
          </Button>
        </Container>
      </main>

      <BuktiModal src={buktiSrc} onClose={() => setBuktiSrc(null)} />

      {/* Modal Beri Rating */}
      <Modal show={ratingTarget !== null} onHide={() => setRatingTarget(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Beri Rating {ratingTarget?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">Bagaimana pelayanan kami?</p>
          <StarRating value={nilai} onChange={setNilai} />
          <Form.Control
            as="textarea"
            rows={3}
            className="mt-3"
            placeholder="Ulasan (opsional)"
            value={ulasan}
            onChange={(e) => setUlasan(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" onClick={() => setRatingTarget(null)}>
            Batal
          </Button>
          <Button variant="dark" disabled={nilai < 1 || mengirimRating} onClick={kirimRating}>
            {mengirimRating ? "Mengirim..." : "Kirim"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Konfirmasi Pesan Lagi (Bisa Ubah Metode Pembayaran) */}
      <Modal
        show={pesanUlangTarget !== null}
        onHide={() => setPesanUlangTarget(null)}
        contentClassName="bg-transparent border-0 shadow-none"
        centered
      >
        <Modal.Body className="p-0 bg-transparent">
          {pesanUlangTarget && (
            <Card className="ticket-container border-0 m-0">
              <Card.Body className="p-4 p-md-5">
                <div className="ticket-header">
                  <span>PESAN ULANG</span>
                  <span>{pesanUlangTarget.id}</span>
                </div>

                <div className="ticket-dashed-line"></div>

                <Form onSubmit={kirimPesanLagi}>
                  <ListGroup variant="flush" className="small mb-3">
                    {daftarItem(pesanUlangTarget).map((item, i) => (
                      <ListGroup.Item
                        key={i}
                        className="d-flex justify-content-between gap-3 bg-transparent px-0"
                      >
                        <span>{item.varian}:</span>
                        <strong className="text-end">{item.jumlah} Loyang</strong>
                      </ListGroup.Item>
                    ))}
                    <ListGroup.Item className="d-flex justify-content-between gap-3 bg-transparent px-0">
                      <span>Alamat Antar:</span>
                      <strong className="text-end">{pesanUlangTarget.alamat}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between gap-3 bg-transparent px-0">
                      <span>Jarak Antar:</span>
                      <strong className="text-end">{pesanUlangTarget.jarak} km</strong>
                    </ListGroup.Item>
                  </ListGroup>

                  <Form.Group className="mb-3">
                    <Form.Label>Metode Pembayaran</Form.Label>
                    <Form.Select
                      value={metodeUlang}
                      onChange={(e) => {
                        setMetodeUlang(e.target.value);
                        if (e.target.value === "Cash") setBuktiUlang(null);
                      }}
                    >
                      <option value="Cash">Cash (Bayar di Tempat)</option>
                      <option value="Transfer BCA">Transfer BCA</option>
                      <option value="GoPay">GoPay</option>
                    </Form.Select>
                  </Form.Group>

                  {(metodeUlang === "Transfer BCA" || metodeUlang === "GoPay") && (
                    <Form.Group className="mb-3">
                      <Form.Label>Upload Bukti Pembayaran</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleUploadBuktiUlang}
                      />
                      <Form.Text className="form-hint-mono">
                        Format: JPG, PNG, WEBP. Maks 2MB.
                      </Form.Text>
                    </Form.Group>
                  )}

                  <div className="total-bayar-box mb-3">
                    Subtotal:{" "}
                    <strong>{formatRupiah(pesanUlangTarget.subtotal)}</strong> +
                    Ongkir:{" "}
                    <strong>{formatRupiah(pesanUlangTarget.ongkir)}</strong> ={" "}
                    <strong>{formatRupiah(pesanUlangTarget.totalBayar)}</strong>
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      type="button"
                      variant="outline-dark"
                      className="w-50 py-2"
                      onClick={() => setPesanUlangTarget(null)}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      variant="dark"
                      className="w-50 py-2"
                      disabled={memesanUlang}
                    >
                      {memesanUlang ? "Memproses..." : "Pesan Sekarang"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}