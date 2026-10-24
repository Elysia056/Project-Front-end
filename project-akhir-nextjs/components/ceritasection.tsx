"use client";
import { useState } from "react";

const statistik = [
  { angka: "100%", label: "Bahan Alami, Tanpa Pengawet" },
  { angka: "6-8 jam", label: "Fermentasi Sebelum Dipanggang" },
  { angka: "1958", label: "Diperkenalkan Pedagang Asal Ambon" },
];

function CeritaSection() {
  const [riwayatTerbuka, setRiwayatTerbuka] = useState(false);

  return (
    <section id="cerita" className="section cerita-section">
      <div className="container">
        <div className="section-kicker">{"// cerita & filosofi"}</div>

        <div className="cerita-grid">
          <div className="cerita-content">
            <div className="cerita-lead">
              <span className="drop-cap">B</span>
              <p className="lead-text">
                ika Ambon bukan kue biasa, namanya menipu, asalnya dari Medan,
                dan teksturnya sengaja dibuat berlubang.
              </p>
            </div>

            <p className="cerita-body">
              Rongga-rongga kecil itu bukan cacat, tapi tujuan. Terbentuk dari
              fermentasi alami air nira dan telur selama berjam-jam, lalu
              dipanggang perlahan di suhu rendah hingga bagian luar kecokelatan
              namun bagian dalam tetap kenyal berserat, seperti sarang lebah
              yang dipotong melintang.
            </p>

            <div className="quote-block">
              <p>
                &ldquo;Namanya Ambon, rumahnya Medan, dan ia tak pernah malu
                soal itu.&rdquo;
              </p>
            </div>

            <button
              type="button"
              className="history-toggle-btn"
              id="historyToggleBtn"
              onClick={() => setRiwayatTerbuka(!riwayatTerbuka)}
            >
              {riwayatTerbuka
                ? "Tutup catatan sejarah \u2191"
                : "Baca asal-usul Jalan Ambon \u2192"}
            </button>
            <div
              className={riwayatTerbuka ? "history-box show" : "history-box"}
              id="historyBox"
            >
              <strong>Fakta Sejarah:</strong> Bika Ambon pertama kali
              diproduksi dan dijual di persimpangan{" "}
              <em>Jalan Ambon Sei Kera, Kota Medan</em> pada dekade 1950-an.
              Para pedagang mengombinasikan resep kue bika Melayu dengan
              fermentasi air nira segar, menciptakan tekstur sarang lebah unik
              yang harum dan kenyal.
            </div>
          </div>

          <div className="cerita-stats">
            {statistik.map((item, index) => (
              <div className="stat-item" key={index}>
                <div className="stat-number">{item.angka}</div>
                <div className="stat-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CeritaSection;