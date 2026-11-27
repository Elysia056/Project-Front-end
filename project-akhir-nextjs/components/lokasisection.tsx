"use client";
import Container from "react-bootstrap/Container";
import { Row, Col } from "react-bootstrap";

import type { KontenLokasi } from "@/lib/konten";

function LokasiSection({ data }: { data: KontenLokasi }) {
  return (
    <section id="lokasi" className="section lokasi-section">
      <Container>
        <div className="section-kicker">{data.kicker}</div>
        <h2 className="section-title">{data.judul}</h2>

        <Row className="g-4">
          <Col lg={7}>
          <div className="map-frame">
            <iframe
              src={data.mapSrc}
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
                <p>{data.alamat}</p>
              </div>
            </div>

            <div className="kontak-item">
              <i className="bx bxs-time-five"></i>
              <div>
                <span className="kontak-label">Jam Buka</span>
                <p>{data.jamBuka}</p>
              </div>
            </div>

            <div className="kontak-item">
              <i className="bx bxs-phone"></i>
              <div>
                <span className="kontak-label">WhatsApp</span>
                <p>{data.whatsapp}</p>
              </div>
            </div>

            <div className="social-icons">
              {data.sosial.map((sosial) => (
                <a
                  key={sosial.label + sosial.href}
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