"use client";
import Container from "react-bootstrap/Container";
import { Row, Col } from "react-bootstrap";

interface Keunikan {
  nomor: string;
  judul: string;
  deskripsi: string;
}

const daftarKeunikan: Keunikan[] = [
  {
    nomor: "01",
    judul: "Rongga Terukur",
    deskripsi:
      "Fermentasi diawasi tiap jam agar pola sarang lebah terbentuk merata di setiap loyang.",
  },
  {
    nomor: "02",
    judul: "Pandan-Kunyit Segar",
    deskripsi:
      "Diperas langsung dari daun dan rimpang asli, bukan sirup instan atau pewarna buatan.",
  },
  {
    nomor: "03",
    judul: "Api Kecil, Sabar Besar",
    deskripsi:
      "Dipanggang lambat agar luar renyah, dalam tetap lembap, proses yang tak bisa dipercepat.",
  },
];

function KeunikanSection() {
  return (
    <section id="keunikan" className="section keunikan-section">
      <Container>
        <div className="section-kicker">{"// kenapa berbeda"}</div>
        <h2 className="section-title">
          Tiga hal yang tak bisa ditiru sembarangan
        </h2>

        <Row className="g-4">
          {daftarKeunikan.map((item) => (
            <Col md={6} lg={4} key={item.nomor}>
            <div className="keunikan-card h-100">
              <div>
                <div className="card-icon-badge"></div>
                <span className="card-num">{item.nomor}</span>
                <h3 className="card-title">{item.judul}</h3>
                <p className="card-desc">{item.deskripsi}</p>
              </div>
              <div className="card-line"></div>
            </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default KeunikanSection;