"use client";
import { useEffect, useState } from "react";
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

  return (
    <>
    <section id="pesan" className="section pesan-section">
      <div className="container">
        <div className="ticket-container">
          <div className="ticket-header">
            <span>TIKET PESANAN</span>
            <span id="displayTicketHeader">#BA-2026</span>
          </div>

          <div className="ticket-dashed-line"></div>

          {!struk ? (
            <form id="orderForm" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nama" className="form-label">
                  Nama
                </label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  className="form-input"
                  placeholder="Nama lengkap"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="nama@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="varian" className="form-label">
                  Varian
                </label>
                <select
                  id="varian"
                  name="varian"
                  className="form-select"
                  value={varian}
                  onChange={(e) => setVarian(e.target.value)}
                >
                  {VARIAN.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <small className="form-hint-mono">Harga: Rp 150.000 / loyang</small>
              </div>

              <div className="form-group">
                <label className="form-label">Jumlah</label>
                <div className="quantity-stepper">
                  <button
                    type="button"
                    className="stepper-btn"
                    id="btnMinus"
                    aria-label="Kurangi"
                    onClick={() => {
                      if (jumlah > 1) setJumlah(jumlah - 1);
                    }}
                  >
                    &minus;
                  </button>
                  <span className="stepper-val" id="stepperVal">
                    {jumlah}
                  </span>
                  <button
                    type="button"
                    className="stepper-btn"
                    id="btnPlus"
                    aria-label="Tambah"
                    onClick={() => setJumlah(jumlah + 1)}
                  >
                    &plus;
                  </button>
                  <span className="stepper-unit">Loyang</span>
                </div>
                <small className="form-hint-mono" id="subtotalHarga">
                  Subtotal: {formatRupiah(subtotal)}
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="catatan" className="form-label">
                  Catatan
                </label>
                <textarea
                  id="catatan"
                  name="catatan"
                  rows={3}
                  className="form-textarea"
                  placeholder="Contoh: tanpa keju, untuk ulang tahun"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="alamat" className="form-label">
                  Alamat Pengiriman
                </label>
                <textarea
                  id="alamat"
                  name="alamat"
                  rows={3}
                  className="form-textarea"
                  placeholder="Jalan, No. Rumah, Kelurahan, Kecamatan, Kota"
                  required
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                ></textarea>
                <small
                  className="form-hint-mono"
                  id="jarakStatus"
                  style={{ color: status.warna }}
                >
                  {status.teks}
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">Pilih Lokasi di Peta</label>
                <MapPicker
                  lokasi={lokasi}
                  tampilan={tampilan}
                  onPilih={(lat, lng) => setLokasiUser(lat, lng, false)}
                />
                <div className="map-controls">
                  <button
                    type="button"
                    className="btn-map-action"
                    id="btnCariAlamat"
                    onClick={handleCariAlamat}
                  >
                    <i className="bx bx-search-alt"></i>
                    <span>Cari dari Alamat</span>
                  </button>
                  <button
                    type="button"
                    className="btn-map-action"
                    id="btnLokasiSaya"
                    onClick={handleLokasiSaya}
                  >
                    <i className="bx bx-current-location"></i>
                    <span>Lokasi Saya</span>
                  </button>
                  <button
                    type="button"
                    className="btn-map-action btn-reset-map"
                    id="btnResetMap"
                    onClick={handleResetMap}
                  >
                    <i className="bx bx-reset"></i>
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="jarakAntar" className="form-label">
                  Jarak Antar (km) — otomatis
                </label>
                <input
                  type="number"
                  id="jarakAntar"
                  name="jarakAntar"
                  className="form-input"
                  placeholder="Terisi otomatis dari peta"
                  min="0"
                  step="0.1"
                  readOnly
                  required
                  value={jarak}
                />
                <small className="form-hint-mono" id="estimasiOngkir">
                  Estimasi ongkir: {formatRupiah(ongkir)}
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="metodeBayar" className="form-label">
                  Metode Pembayaran
                </label>
                <select
                  id="metodeBayar"
                  name="metodeBayar"
                  className="form-select"
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
                </select>
              </div>

              <div
                className="payment-info-box"
                id="paymentInfoBox"
                style={{ display: infoBayar ? "block" : "none" }}
              >
                {infoBayar && (
                  <>
                    <div className="payment-info-title">{infoBayar.judul}</div>
                    <div className="payment-info-detail">
                      {infoBayar.catatan}
                      {infoBayar.baris.map((baris, index) => (
                        <span key={index}>
                          {baris.label}
                          <strong>{baris.nilai}</strong>
                          {index < infoBayar.baris.length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {infoBayar && infoBayar.perluBukti && (
                <div className="form-group" id="buktiTransferGroup">
                  <label htmlFor="buktiTransfer" className="form-label">
                    Bukti Transfer / Pembayaran
                  </label>
                  <input
                    type="file"
                    id="buktiTransfer"
                    name="buktiTransfer"
                    className="form-input-file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleBukti}
                  />
                  <small className="form-hint-mono">
                    Format: JPG, PNG, WEBP. Maks 2MB.
                  </small>
                  <div className="bukti-preview" id="buktiPreview">
                    {buktiBase64 && (
                      <>
                        <button
                          type="button"
                          className="btn-lihat-bukti-small"
                          id="btnLihatBuktiSmall"
                          onClick={() => setBuktiTampil(true)}
                        >
                          <i className="bx bx-show"></i> Lihat Bukti
                        </button>
                        <button
                          type="button"
                          className="btn-hapus-bukti-small"
                          id="btnHapusBuktiSmall"
                          title="Hapus bukti"
                          onClick={() => setBuktiBase64(null)}
                        >
                          <i className="bx bx-trash"></i> Hapus
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="form-group">
                <div className="total-bayar-box" id="totalBayarBox">
                  Subtotal: <strong>{formatRupiah(subtotal)}</strong> + Ongkir:{" "}
                  <strong>{formatRupiah(ongkir)}</strong> ={" "}
                  <strong>{formatRupiah(total)}</strong>
                </div>
              </div>

              <button type="submit" className="btn-submit-ticket">
                Kirim Pesanan
              </button>
            </form>
          ) : (
            <div className="ticket-confirmation show" id="ticketConfirmation">
              <div className="confirmation-header">
                &#10004; Pesanan Berhasil Diterima!
              </div>
              <div className="receipt-row">
                <span>Nomor Tiket:</span>
                <strong id="recTicketId">{struk.id}</strong>
              </div>
              <div className="receipt-row">
                <span>Nama Pemesan:</span>
                <strong id="recNama">{struk.nama}</strong>
              </div>
              <div className="receipt-row">
                <span>Email:</span>
                <span id="recEmail">{struk.email}</span>
              </div>
              <div className="receipt-row">
                <span>Varian Pilihan:</span>
                <strong id="recVarian">{struk.varian}</strong>
              </div>
              <div className="receipt-row">
                <span>Jumlah:</span>
                <strong id="recJumlah">{struk.jumlah} Loyang</strong>
              </div>
              <div className="receipt-row">
                <span>Harga Satuan:</span>
                <span id="recHarga">{formatRupiah(struk.harga)} / loyang</span>
              </div>
              <div className="receipt-row">
                <span>Subtotal:</span>
                <span id="recSubtotal">{formatRupiah(struk.subtotal)}</span>
              </div>
              <div className="receipt-row">
                <span>Catatan:</span>
                <span id="recCatatan">{struk.catatan ? struk.catatan : "-"}</span>
              </div>
              <div className="receipt-row">
                <span>Alamat Antar:</span>
                <span id="recAlamat">{struk.alamat}</span>
              </div>
              <div className="receipt-row">
                <span>Jarak Antar:</span>
                <strong id="recJarak">{struk.jarak} km</strong>
              </div>
              <div className="receipt-row">
                <span>Ongkos Kirim:</span>
                <strong id="recOngkir">{formatRupiah(struk.ongkir)}</strong>
              </div>
              <div className="receipt-row">
                <span>Metode Pembayaran:</span>
                <strong id="recMetode">{struk.metodeBayar}</strong>
              </div>
              <div className="receipt-row">
                <span>Total Bayar:</span>
                <strong id="recTotal">{formatRupiah(struk.totalBayar)}</strong>
              </div>

              <button
                type="button"
                className="btn-submit-ticket"
                id="btnResetOrder"
                style={{ marginTop: "1.25rem" }}
                onClick={handleBuatBaru}
              >
                Buat Pesanan Baru
              </button>
            </div>
          )}
        </div>
      </div>
    </section>

    <BuktiModal
      src={buktiTampil ? buktiBase64 : null}
      onClose={() => setBuktiTampil(false)}
    />
    </>
  );
}

export default PesanSection;