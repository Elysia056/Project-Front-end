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
import type { KontenPesan } from "@/lib/konten";
import {
  Pesanan,
  PesananInput,
  daftarItem,
  formatRupiah,
  hitungJarakHaversine,
  hitungOngkir,
} from "@/lib/pesanan";

interface InfoBayar {
  judul: string;
  perluBukti: boolean;
  baris: { label: string; nilai: string }[];
  catatan?: string;
}

// Info rekening & upload bukti transfer (nomor dan nama diatur admin)
function buatRekeningInfo(data: KontenPesan): Record<string, InfoBayar> {
  return {
    "Transfer BCA": {
      judul: "Transfer ke Rekening BCA",
      perluBukti: true,
      baris: [
        { label: "", nilai: "Bank BCA" },
        { label: "No. Rek: ", nilai: data.bca.noRek },
        { label: "Atas Nama: ", nilai: data.bca.atasNama },
      ],
    },
    GoPay: {
      judul: "Transfer ke GoPay",
      perluBukti: true,
      baris: [
        { label: "", nilai: "GoPay / E-Wallet" },
        { label: "No. HP: ", nilai: data.gopay.noHp },
        { label: "Atas Nama: ", nilai: data.gopay.atasNama },
      ],
    },
    Cash: {
      judul: "Bayar di Tempat (COD)",
      perluBukti: false,
      baris: [],
      catatan: "Pembayaran dilakukan saat pesanan diantar ke alamat kamu.",
    },
  };
}

const STATUS_AWAL = "Ketik alamat atau klik peta di bawah untuk pilih lokasi antar";

function PesanSection({ data }: { data: KontenPesan }) {
  // Pengaturan dari admin: harga, tarif ongkir, varian, lokasi toko, dan rekening
  const HARGA_PER_LOYANG = data.hargaPerLoyang;
  const LOKASI_TOKO = data.toko;
  const VARIAN = data.varian;
  const REKENING_INFO = buatRekeningInfo(data);
  const TAMPILAN_AWAL: TampilanPeta = {
    lat: LOKASI_TOKO.lat,
    lng: LOKASI_TOKO.lng,
    zoom: 12,
    id: 0,
  };

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  // Jumlah loyang per rasa: satu pesanan boleh berisi beberapa rasa
  const [jumlahRasa, setJumlahRasa] = useState<Record<string, number>>({ [VARIAN[0]]: 1 });
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
  const [menyimpan, setMenyimpan] = useState(false);

  // Auto-isi form pesan kalau user sudah login
  useEffect(() => {
    const userAktif = ambilUserLogin();
    if (userAktif && userAktif.role === "user") {
      setNama((lama) => lama || userAktif.nama || "");
      setEmail((lama) => lama || userAktif.email || "");
    }
  }, []);

  // Rasa yang dipilih (jumlah > 0) dan hitungan harga
  const pilihan = VARIAN.map((rasa) => ({ varian: rasa, jumlah: jumlahRasa[rasa] ?? 0 })).filter(
    (item) => item.jumlah > 0
  );
  const totalLoyang = pilihan.reduce((total, item) => total + item.jumlah, 0);
  const ubahJumlahRasa = (rasa: string, selisih: number) =>
    setJumlahRasa((lama) => ({ ...lama, [rasa]: Math.max(0, (lama[rasa] ?? 0) + selisih) }));
  const subtotal = HARGA_PER_LOYANG * totalLoyang;
  const jarakAngka = parseFloat(jarak) || 0;
  const ongkir = hitungOngkir(jarakAngka, data.tarifPerKm);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    if (totalLoyang < 1) {
      alert("Pilih minimal satu rasa (jumlah minimal 1 loyang).");
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

    // Nomor tiket, tanggal, dan status dibuat oleh server/database
    const pesananBaru: PesananInput = {
      nama: namaBersih,
      email: emailBersih,
      items: pilihan,
      catatan: catatan.trim(),
      alamat: alamatBersih,
      jarak: jarakAngka,
      metodeBayar: metodeBayar,
      buktiTransfer: buktiBase64 || null,
    };

    setMenyimpan(true);
    try {
      // Simpan pesanan ke database lewat API
      const res = await fetch("/api/pesanan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pesananBaru),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStruk(data as Pesanan);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan pesanan.");
    } finally {
      setMenyimpan(false);
    }
  };

  const handleBuatBaru = () => {
    setNama("");
    setEmail("");
    setJumlahRasa({ [VARIAN[0]]: 1 });
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
        ...daftarItem(struk).map((item, i): [string, string, string] => [
          item.varian + ":",
          item.jumlah + " Loyang \u00d7 " + formatRupiah(item.harga),
          "recItem" + i,
        ]),
        ["Total Loyang:", struk.jumlah + " Loyang", "recJumlah"],
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

                  <Form.Group className="mb-3">
                    <Form.Label>Pilih Rasa &amp; Jumlah</Form.Label>
                    <Form.Text className="form-hint-mono d-block mb-2">
                      Harga: {formatRupiah(HARGA_PER_LOYANG)} / loyang. Kamu bisa
                      memesan beberapa rasa sekaligus dalam satu pesanan.
                    </Form.Text>
                    {VARIAN.map((item) => {
                      const n = jumlahRasa[item] ?? 0;
                      return (
                        <div
                          key={item}
                          className="d-flex align-items-center justify-content-between gap-3 py-2 border-bottom"
                        >
                          <span className={n > 0 ? "fw-bold" : ""}>{item}</span>
                          <InputGroup size="sm" style={{ maxWidth: 170 }}>
                            <Button
                              variant="outline-dark"
                              aria-label={"Kurangi " + item}
                              disabled={n === 0}
                              onClick={() => ubahJumlahRasa(item, -1)}
                            >
                              -
                            </Button>
                            <InputGroup.Text className="flex-grow-1 justify-content-center fw-bold bg-white">
                              {n}
                            </InputGroup.Text>
                            <Button
                              variant="outline-dark"
                              aria-label={"Tambah " + item}
                              onClick={() => ubahJumlahRasa(item, 1)}
                            >
                              +
                            </Button>
                          </InputGroup>
                        </div>
                      );
                    })}
                    <Form.Text className="form-hint-mono d-block mt-2" id="subtotalHarga">
                      Total: {totalLoyang} loyang &middot; Subtotal: {formatRupiah(subtotal)}
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
                      toko={LOKASI_TOKO}
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

                  <Button
                    type="submit"
                    variant="dark"
                    className="w-100 py-3"
                    disabled={menyimpan}
                  >
                    {menyimpan ? "Menyimpan..." : "Kirim Pesanan"}
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