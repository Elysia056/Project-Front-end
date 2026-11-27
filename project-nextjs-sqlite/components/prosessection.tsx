"use client";
import Container from "react-bootstrap/Container";

interface Langkah {
  judul: string;
  deskripsi: string;
}

const daftarLangkah: Langkah[] = [
  {
    judul: "Fermentasi Alami",
    deskripsi:
      "Air nira dan telur dibiarkan bereaksi hingga menghasilkan gelembung udara halus.",
  },
  {
    judul: "Campur Pandan & Kunyit",
    deskripsi:
      "Warna dan aroma khas ditambahkan dari bahan segar yang diperas langsung.",
  },
  {
    judul: "Panggang Suhu Rendah",
    deskripsi: "Rongga terbentuk perlahan tanpa merusak tekstur kenyalnya.",
  },
  {
    judul: "Potong & Sajikan",
    deskripsi:
      "Dipotong hangat agar aroma pandannya masih terasa saat sampai ke kamu.",
  },
];

function ProsesSection() {
  return (
    <section id="proses" className="section proses-section">
      <Container>
        <div className="section-kicker" style={{ textAlign: "center" }}>
          {"// proses"}
        </div>
        <h2 className="section-title">Dari Adonan ke Rongga</h2>

        <div className="timeline-wrapper">
          <div className="timeline-line"></div>

          {daftarLangkah.map((langkah, index) => (
            <div
              className={
                index % 2 === 0 ? "timeline-item left" : "timeline-item right"
              }
              key={index}
            >
              <div className="timeline-badge">{index + 1}</div>
              <div className="timeline-box">
                <h3>{langkah.judul}</h3>
                <p>{langkah.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default ProsesSection;