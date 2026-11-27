"use client";
import Container from "react-bootstrap/Container";
import { Row, Col } from "react-bootstrap";

const daftarSosial = [
  { href: "https://instagram.com/", label: "Instagram", ikon: "bx bxl-instagram" },
  { href: "https://wa.me/6281234567890", label: "WhatsApp", ikon: "bx bxl-whatsapp" },
  { href: "https://tiktok.com/", label: "TikTok", ikon: "bx bxl-tiktok" },
  { href: "https://facebook.com/", label: "Facebook", ikon: "bx bxl-facebook-square" },
];

function LokasiSection() {
  return (
    <section id="lokasi" className="section lokasi-section">
      <Container>
        <div className="section-kicker">{"// lokasi & kontak"}</div>
        <h2 className="section-title">Datang atau Sapa Kami</h2>

        <Row className="g-4">
          <Col lg={7}>
          <div className="map-frame">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d67854.63374613885!2d98.70956846910109!3d3.604385660983691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x303131d386574799%3A0x68a1c8e19428ac71!2sBika%20Ambon%20Zulaikha!5e0!3m2!1sen!2sid!4v1790502930653!5m2!1sen!2sid"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>
          </Col>

          <Col lg={5}>
          <div className="kontak-info">
            <div className="kontak-item">
              <i className="bx bxs-map"></i>
              <div>
                <span className="kontak-label">Alamat Toko</span>
                <p>
                  Jl. Mojopahit No.70 A-C, Petisah Tengah, Kec. Medan Petisah,
                  Kota Medan, Sumatera Utara 20112
                </p>
              </div>
            </div>

            <div className="kontak-item">
              <i className="bx bxs-time-five"></i>
              <div>
                <span className="kontak-label">Jam Buka</span>
                <p>Setiap Hari, 08.00 - 20.00 WIB</p>
              </div>
            </div>

            <div className="kontak-item">
              <i className="bx bxs-phone"></i>
              <div>
                <span className="kontak-label">WhatsApp</span>
                <p>+62 812-0000-0000</p>
              </div>
            </div>

            <div className="social-icons">
              {daftarSosial.map((sosial) => (
                <a
                  key={sosial.label}
                  href={sosial.href}
                  target="_blank"
                  rel="noopener"
                  className="social-icon-btn"
                  aria-label={sosial.label}
                >
                  <i className={sosial.ikon}></i>
                </a>
              ))}
            </div>
          </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default LokasiSection;