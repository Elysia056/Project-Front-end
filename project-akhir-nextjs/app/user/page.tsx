"use client";
import { useEffect, useState } from "react";
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

  return (
    <div className="dash-body">
      <DashHeader>
        <div className="dash-user-info">
          <a href="/" className="btn-back-home">
            &larr; Beranda
          </a>
          <span className="dash-role-badge">Pelanggan</span>
          <span id="userNameLabel">{user.nama}</span>
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
          <h1 className="dash-page-title">Dashboard Saya</h1>
          <p className="dash-page-subtitle">
            {"// pesanan atas nama akun "}
            <span id="userEmailLabel">{user.email}</span>
          </p>

          <div className="dash-panel">
            <table className="dash-table">
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
                    <td>{pesanan.tanggal}</td>
                    <td>
                      <span
                        className={
                          "status-badge status-" + pesanan.status.toLowerCase()
                        }
                      >
                        {pesanan.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              className={
                pesananSaya.length === 0
                  ? "dash-empty-state show"
                  : "dash-empty-state"
              }
              id="emptyStateUser"
            >
              Anda belum memiliki pesanan. Gunakan email yang sama pada form
              pemesanan agar pesanan Anda muncul di sini.
            </div>
          </div>

          <a href="/#pesan" className="dash-cta-link">
            Pesan Bika Ambon &rarr;
          </a>
        </div>
      </main>

      <BuktiModal src={buktiSrc} onClose={() => setBuktiSrc(null)} />
    </div>
  );
}