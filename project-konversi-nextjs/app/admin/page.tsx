"use client";
import { useEffect, useState } from "react";
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
    <div className="dash-body">
      <DashHeader>
        <div className="dash-user-info">
          <a href="/" className="btn-back-home">
            &larr; Beranda
          </a>
          <span className="dash-role-badge">Admin</span>
          <span id="adminNameLabel">{admin.nama}</span>
          <button
            type="button"
            className="btn-logout"
            id="logoutBtn"
            onClick={logout}
          >
            Keluar
          </button>
        </div>
      </DashHeader>

      <main className="dash-main">
        <div className="container">
          <h1 className="dash-page-title">Dashboard Admin</h1>
          <p className="dash-page-subtitle">
            {"// kelola seluruh pesanan yang masuk dari pelanggan"}
          </p>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-value" id="statTotalPesanan">
                {daftarPesanan.length}
              </div>
              <div className="stat-tag">Total Pesanan</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" id="statTotalLoyang">
                {totalLoyang}
              </div>
              <div className="stat-tag">Total Loyang Dipesan</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" id="statSelesai">
                {totalSelesai}
              </div>
              <div className="stat-tag">Pesanan Selesai</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" id="statPendapatan">
                {formatRupiah(totalPendapatan)}
              </div>
              <div className="stat-tag">Total Pendapatan</div>
            </div>
          </div>

          <div className="dash-panel">
            <table className="dash-table">
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
                        <button
                          type="button"
                          className="btn-lihat-bukti"
                          onClick={() => setBuktiSrc(pesanan.buktiTransfer)}
                        >
                          Lihat Bukti
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <strong style={{ color: "var(--accent-amber-dark)" }}>
                        {pesanan.totalBayar ? formatRupiah(pesanan.totalBayar) : "-"}
                      </strong>
                    </td>
                    <td>{pesanan.catatan ? pesanan.catatan : "-"}</td>
                    <td>{pesanan.tanggal}</td>
                    <td>
                      <select
                        className="status-select"
                        value={pesanan.status}
                        onChange={(e) => ubahStatus(index, e.target.value)}
                      >
                        <option value="Diproses">Diproses</option>
                        <option value="Dikirim">Dikirim</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Dibatalkan">Dibatalkan</option>
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-hapus"
                        onClick={() => hapusPesanan(index)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              className={
                daftarPesanan.length === 0
                  ? "dash-empty-state show"
                  : "dash-empty-state"
              }
              id="emptyState"
            >
              Belum ada pesanan yang masuk. Pesanan baru dari form{" "}
              <a href="/#pesan">Pesan</a> akan otomatis muncul di sini.
            </div>
          </div>
        </div>
      </main>

      <BuktiModal src={buktiSrc} onClose={() => setBuktiSrc(null)} />
    </div>
  );
}