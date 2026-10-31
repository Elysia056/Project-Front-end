"use client";
import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import { Row, Col } from "react-bootstrap";
import BuktiModal from "@/components/buktimodal";
import MapPicker, { TampilanPeta, TitikPeta } from "@/components/mappicker";
import { ambilUserLogin } from "@/lib/auth";
import {
  HARGA_PER_LOYANG,
  LOKASI_TOKO,
  Pesanan,
  ambilPesanan,
  formatRupiah,
  hitungJarakHaversine,
  hitungOngkir,
  simpanPesanan,
} from "@/lib/pesanan";

interface InfoBayar {
  judul: string;
  perluBukti: boolean;
  baris: { label: string; nilai: string }[];
  catatan?: string;
}

// Info rekening & upload bukti transfer
const REKENING_INFO: Record<string, InfoBayar> = {
  "Transfer BCA": {
    judul: "Transfer ke Rekening BCA",
    perluBukti: true,
    baris: [
      { label: "", nilai: "Bank BCA" },
      { label: "No. Rek: ", nilai: "1234567890" },
      { label: "Atas Nama: ", nilai: "Bika Ambon Kelompok 1" },
    ],
  },
  GoPay: {
    judul: "Transfer ke GoPay",
    perluBukti: true,
    baris: [
      { label: "", nilai: "GoPay / E-Wallet" },
      { label: "No. HP: ", nilai: "0812-3456-7890" },
      { label: "Atas Nama: ", nilai: "Bika Ambon Kelompok 1" },
    ],
  },
  Cash: {
    judul: "Bayar di Tempat (COD)",
    perluBukti: false,
    baris: [],
    catatan: "Pembayaran dilakukan saat pesanan diantar ke alamat kamu.",
  },
};

const VARIAN = [
  "Original Pandan",
  "Pandan Kunyit Spesial",
  "Gula Merah Klasik",
  "Keju Lembut",
  "Cokelat Rongga",
];

const STATUS_AWAL = "Ketik alamat atau klik peta di bawah untuk pilih lokasi antar";

const TAMPILAN_AWAL: TampilanPeta = {
  lat: LOKASI_TOKO.lat,
  lng: LOKASI_TOKO.lng,
  zoom: 12,
  id: 0,
};

function PesanSection() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [varian, setVarian] = useState(VARIAN[0]);
  const [jumlah, setJumlah] = useState(1);
  const [catatan, setCatatan] = useState("");
  const [alamat, setAlamat] = useState("");
  const [jarak, setJarak] = useState("");
  const [status, setStatus] = useState({ teks: STATUS_AWAL, warna: "" });
  const [metodeBayar, setMetodeBayar] = useState("");
  const [buktiBase64, setBuktiBase64] = useState<string | null>(null);
  const [buktiTampil, setBuktiTampil] = useState(false);
  const [lokasi, setLokasi] = useState<TitikPeta | null>(null);
  const [tampilan, setTampilan] = useState<TampilanPeta>(TAMPILAN_AWAL);
  const [struk, setStruk] = useState<Pesanan | null>(null);

  // Auto-isi form pesan kalau user sudah login
  useEffect(() => {
    const userAktif = ambilUserLogin();
    if (userAktif && userAktif.role === "user") {
      setNama((lama) => lama || userAktif.nama || "");
      setEmail((lama) => lama || userAktif.email || "");
    }
  }, []);

  // Hitungan harga
  const subtotal = HARGA_PER_LOYANG * jumlah;
  const jarakAngka = parseFloat(jarak) || 0;
  const ongkir = hitungOngkir(jarakAngka);
  const total = subtotal + ongkir;

  const infoBayar = REKENING_INFO[metodeBayar];

  const pindahTampilan = (lat: number, lng: number, zoom: number) => {
    setTampilan((lama) => ({ lat, lng, zoom, id: lama.id + 1 }));
  };

  const reverseGeocode = (lat: number, lng: number) => {
    const url =
      "https://nominatim.openstreetmap.org/reverse?format=json&lat=" +
      lat +
      "&lon=" +
      lng +
      "&zoom=18&addressdetails=1";

    fetch(url, { headers: { Accept: "application/json" } })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.display_name) {
          setAlamat(data.display_name);
        }
      })
      .catch(() => {});
  };

  const geocodeAlamat = (
    teksAlamat: string,
    callback: (lat: number | null, lng: number | null, nama: string | null) => void
  ) => {
    const url =
      "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" +
      encodeURIComponent(teksAlamat + ", Indonesia");

    fetch(url, { headers: { Accept: "application/json" } })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          callback(
            parseFloat(data[0].lat),
            parseFloat(data[0].lon),
            data[0].display_name
          );
        } else {
          callback(null, null, null);
        }
      })
      .catch(() => {
        callback(null, null, null);
      });
  };

  const setLokasiUser = (lat: number, lng: number, alamatManual: boolean) => {
    setLokasi({ lat, lng });

    const jarakHitung = hitungJarakHaversine(LOKASI_TOKO.lat, LOKASI_TOKO.lng, lat, lng);
    const jarakBulat = Math.round(jarakHitung * 10) / 10;
    setJarak(String(jarakBulat));
    setStatus({
      teks: "✓ Jarak dari toko: " + jarakBulat + " km (dari peta)",
      warna: "#2e7d32",
    });

    if (!alamatManual) {
      reverseGeocode(lat, lng);
    }
  };

  const handleCariAlamat = () => {
    const teksAlamat = alamat.trim();
    if (teksAlamat.length < 5) {
      alert("Mohon isi alamat dulu (minimal 5 karakter).");
      return;
    }

    setStatus({
      teks: "Mencari lokasi dari alamat...",
      warna: "var(--accent-amber-dark)",
    });

    geocodeAlamat(teksAlamat, (lat, lng, displayName) => {
      if (lat !== null && lng !== null) {
        pindahTampilan(lat, lng, 15);
        setLokasiUser(lat, lng, true);
        setStatus({
          teks: "✓ Lokasi ditemukan: " + displayName,
          warna: "#2e7d32",
        });
      } else {
        setStatus({
          teks: "✗ Alamat tidak ditemukan. Coba klik peta langsung.",
          warna: "#8a2f24",
        });
      }
    });
  };

  const handleLokasiSaya = () => {
    if (!navigator.geolocation) {
      alert("Browser kamu tidak mendukung geolokasi.");
      return;
    }

    setStatus({
      teks: "Mengambil lokasi kamu...",
      warna: "var(--accent-amber-dark)",
    });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        pindahTampilan(lat, lng, 15);
        setLokasiUser(lat, lng, false);
      },
      () => {
        setStatus({
          teks: "✗ Gagal ambil lokasi. Izinkan akses lokasi di browser.",
          warna: "#8a2f24",
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleResetMap = () => {
    pindahTampilan(LOKASI_TOKO.lat, LOKASI_TOKO.lng, 12);
    setLokasi(null);
    setJarak("");
    setAlamat("");
    setStatus({ teks: STATUS_AWAL, warna: "" });
  };

  const handleMetodeBayar = (nilai: string) => {
    setMetodeBayar(nilai);
    const info = REKENING_INFO[nilai];
    if (!info || !info.perluBukti) {
      setBuktiBase64(null);
    }
  };

  // Upload bukti transfer -> tampil tombol "Lihat Bukti"
  const handleBukti = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setBuktiBase64(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const namaBersih = nama.trim();
    const emailBersih = email.trim();
    const alamatBersih = alamat.trim();

    if (!namaBersih || !emailBersih) {
      alert("Mohon isi nama dan email dengan benar.");
      return;
    }

    if (!alamatBersih) {
      alert("Mohon isi alamat pengiriman atau pilih lokasi di peta.");
      return;
    }

    if (jarakAngka <= 0) {
      alert(
        'Jarak belum terhitung. Mohon pilih lokasi antar di peta atau klik "Cari dari Alamat".'
      );
      return;
    }

    if (!metodeBayar) {
      alert("Mohon pilih metode pembayaran.");
      return;
    }

    if (infoBayar && infoBayar.perluBukti && !buktiBase64) {
      alert("Mohon upload bukti transfer untuk metode " + metodeBayar + ".");
      return;
    }

    const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
    const ticketCode = "BA-2026-" + randomTicketNum;

    const pesananBaru: Pesanan = {
      id: "#" + ticketCode,
      nama: namaBersih,
      email: emailBersih,
      varian: varian,
      jumlah: jumlah,
      harga: HARGA_PER_LOYANG,
      subtotal: subtotal,
      catatan: catatan.trim(),
      alamat: alamatBersih,
      jarak: jarakAngka,
      ongkir: ongkir,
      metodeBayar: metodeBayar,
      buktiTransfer: buktiBase64 || null,
      totalBayar: total,
      tanggal: new Date().toLocaleString("id-ID"),
      status: "Diproses",
    };

    const daftarPesanan = ambilPesanan();
    daftarPesanan.push(pesananBaru);
    simpanPesanan(daftarPesanan);

    setStruk(pesananBaru);
  };

  const handleBuatBaru = () => {
    setNama("");
    setEmail("");
    setVarian(VARIAN[0]);
    setJumlah(1);
    setCatatan("");
    setAlamat("");
    setJarak("");
    setMetodeBayar("");
    setBuktiBase64(null);
    setLokasi(null);
    setTampilan(TAMPILAN_AWAL);
    setStatus({ teks: STATUS_AWAL, warna: "" });
    setStruk(null);
  };

  const barisStruk: [string, string, string][] = struk
    ? [
        ["Nomor Tiket:", struk.id, "recTicketId"],
        ["Nama Pemesan:", struk.nama, "recNama"],
        ["Email:", struk.email, "recEmail"],
        ["Varian Pilihan:", struk.varian, "recVarian"],
        ["Jumlah:", struk.jumlah + " Loyang", "recJumlah"],
        ["Harga Satuan:", formatRupiah(struk.harga) + " / loyang", "recHarga"],
        ["Subtotal:", formatRupiah(struk.subtotal), "recSubtotal"],
        ["Catatan:", struk.catatan ? struk.catatan : "-", "recCatatan"],
        ["Alamat Antar:", struk.alamat, "recAlamat"],
        ["Jarak Antar:", struk.jarak + " km", "recJarak"],
        ["Ongkos Kirim:", formatRupiah(struk.ongkir), "recOngkir"],
        ["Metode Pembayaran:", struk.metodeBayar, "recMetode"],
        ["Total Bayar:", formatRupiah(struk.totalBayar), "recTotal"],
      ]
    : [];

  return (
    <>
      <section id="pesan" className="section pesan-section">
        <Container>
          <Card className="ticket-container mx-auto">
            <Card.Body className="p-4 p-md-5">
              <div className="ticket-header">
                <span>TIKET PESANAN</span>
                <span id="displayTicketHeader">#BA-2026</span>
              </div>

              <div className="ticket-dashed-line"></div>

              {!struk ? (
                <Form id="orderForm" onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="nama">
                    <Form.Label>Nama</Form.Label>
                    <Form.Control
                      type="text"
                      name="nama"
                      placeholder="Nama lengkap"
                      required
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="nama@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="varian">
                    <Form.Label>Varian</Form.Label>
                    <Form.Select
                      name="varian"
                      value={varian}
                      onChange={(e) => setVarian(e.target.value)}
                    >
                      {VARIAN.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="form-hint-mono">
                      Harga: Rp 150.000 / loyang
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Jumlah</Form.Label>
                    <InputGroup style={{ maxWidth: 240 }}>
                      <Button
                        variant="outline-dark"
                        id="btnMinus"
                        aria-label="Kurangi"
                        onClick={() => {
                          if (jumlah > 1) setJumlah(jumlah - 1);
                        }}
                      >
                        -
                      </Button>
                      <InputGroup.Text
                        id="stepperVal"
                        className="flex-grow-1 justify-content-center fw-bold bg-white"
                      >
                        {jumlah}
                      </InputGroup.Text>
                      <Button
                        variant="outline-dark"
                        id="btnPlus"
                        aria-label="Tambah"
                        onClick={() => setJumlah(jumlah + 1)}
                      >
                        +
                      </Button>
                      <InputGroup.Text>Loyang</InputGroup.Text>
                    </InputGroup>
                    <Form.Text className="form-hint-mono" id="subtotalHarga">
                      Subtotal: {formatRupiah(subtotal)}
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="catatan">
                    <Form.Label>Catatan</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="catatan"
                      placeholder="Contoh: tanpa keju, untuk ulang tahun"
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="alamat">
                    <Form.Label>Alamat Pengiriman</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="alamat"
                      placeholder="Jalan, No. Rumah, Kelurahan, Kecamatan, Kota"
                      required
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                    />
                    <Form.Text
                      className="form-hint-mono"
                      id="jarakStatus"
                      style={{ color: status.warna }}
                    >
                      {status.teks}
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Pilih Lokasi di Peta</Form.Label>
                    <MapPicker
                      lokasi={lokasi}
                      tampilan={tampilan}
                      onPilih={(lat, lng) => setLokasiUser(lat, lng, false)}
                    />
                    <Row className="g-2 mt-1">
                      <Col xs={12} sm={4}>
                        <Button
                          variant="outline-amber"
                          size="sm"
                          className="w-100"
                          id="btnCariAlamat"
                          onClick={handleCariAlamat}
                        >
                          <i className="bx bx-search-alt"></i> Cari dari Alamat
                        </Button>
                      </Col>
                      <Col xs={12} sm={4}>
                        <Button
                          variant="outline-amber"
                          size="sm"
                          className="w-100"
                          id="btnLokasiSaya"
                          onClick={handleLokasiSaya}
                        >
                          <i className="bx bx-current-location"></i> Lokasi Saya
                        </Button>
                      </Col>
                      <Col xs={12} sm={4}>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="w-100"
                          id="btnResetMap"
                          onClick={handleResetMap}
                        >
                          <i className="bx bx-reset"></i> Reset
                        </Button>
                      </Col>
                    </Row>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="jarakAntar">
                    <Form.Label>Jarak Antar (km) - otomatis</Form.Label>
                    <Form.Control
                      type="number"
                      name="jarakAntar"
                      placeholder="Terisi otomatis dari peta"
                      min="0"
                      step="0.1"
                      readOnly
                      required
                      value={jarak}
                    />
                    <Form.Text className="form-hint-mono" id="estimasiOngkir">
                      Estimasi ongkir: {formatRupiah(ongkir)}
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="metodeBayar">
                    <Form.Label>Metode Pembayaran</Form.Label>
                    <Form.Select
                      name="metodeBayar"
                      required
                      value={metodeBayar}
                      onChange={(e) => handleMetodeBayar(e.target.value)}
                    >
                      <option value="" disabled>
                        Pilih metode pembayaran
                      </option>
                      <option value="Cash">Cash (Bayar di Tempat)</option>
                      <option value="Transfer BCA">Transfer BCA</option>
                      <option value="GoPay">GoPay</option>
                    </Form.Select>
                  </Form.Group>

                  {infoBayar && (
                    <Alert variant="warning" id="paymentInfoBox">
                      <Alert.Heading as="div" className="fs-6 fw-bold">
                        {infoBayar.judul}
                      </Alert.Heading>
                      <div className="small">
                        {infoBayar.catatan}
                        {infoBayar.baris.map((baris, index) => (
                          <span key={index}>
                            {baris.label}
                            <strong>{baris.nilai}</strong>
                            {index < infoBayar.baris.length - 1 && <br />}
                          </span>
                        ))}
                      </div>
                    </Alert>
                  )}

                  {infoBayar && infoBayar.perluBukti && (
                    <Form.Group className="mb-3" controlId="buktiTransfer">
                      <Form.Label>Bukti Transfer / Pembayaran</Form.Label>
                      <Form.Control
                        type="file"
                        name="buktiTransfer"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleBukti}
                      />
                      <Form.Text className="form-hint-mono">
                        Format: JPG, PNG, WEBP. Maks 2MB.
                      </Form.Text>
                      {buktiBase64 && (
                        <div className="d-flex gap-2 mt-2" id="buktiPreview">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            id="btnLihatBuktiSmall"
                            onClick={() => setBuktiTampil(true)}
                          >
                            <i className="bx bx-show"></i> Lihat Bukti
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            id="btnHapusBuktiSmall"
                            title="Hapus bukti"
                            onClick={() => setBuktiBase64(null)}
                          >
                            <i className="bx bx-trash"></i> Hapus
                          </Button>
                        </div>
                      )}
                    </Form.Group>
                  )}

                  <div className="total-bayar-box mb-3" id="totalBayarBox">
                    Subtotal: <strong>{formatRupiah(subtotal)}</strong> + Ongkir:{" "}
                    <strong>{formatRupiah(ongkir)}</strong> ={" "}
                    <strong>{formatRupiah(total)}</strong>
                  </div>

                  <Button type="submit" variant="dark" className="w-100 py-3">
                    Kirim Pesanan
                  </Button>
                </Form>
              ) : (
                <div id="ticketConfirmation">
                  <Alert variant="success" className="fw-bold text-center">
                    &#10004; Pesanan Berhasil Diterima!
                  </Alert>
                  <ListGroup variant="flush">
                    {barisStruk.map(([label, nilai, id]) => (
                      <ListGroup.Item
                        key={id}
                        className="d-flex justify-content-between gap-3 bg-transparent px-0"
                      >
                        <span>{label}</span>
                        <strong id={id} className="text-end">
                          {nilai}
                        </strong>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <Button
                    variant="dark"
                    className="w-100 py-3 mt-4"
                    id="btnResetOrder"
                    onClick={handleBuatBaru}
                  >
                    Buat Pesanan Baru
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Container>
      </section>

      <BuktiModal
        src={buktiTampil ? buktiBase64 : null}
        onClose={() => setBuktiTampil(false)}
      />
    </>
  );
}

export default PesanSection;