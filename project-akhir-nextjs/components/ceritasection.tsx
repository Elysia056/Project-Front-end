"use client";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Row, Col } from "react-bootstrap";
import type { KontenCerita } from "@/lib/konten";

function CeritaSection({ data }: { data: KontenCerita }) {
  const [riwayatTerbuka, setRiwayatTerbuka] = useState(false);

  return (
    <section id="cerita" className="section cerita-section">
      <Container>
        <div className="section-kicker">{data.kicker}</div>

        <Row className="g-5 align-items-center">
          <Col lg={8}>
            <div className="cerita-lead">
              <span className="drop-cap">{data.pembuka.charAt(0)}</span>
              <p className="lead-text">{data.pembuka.slice(1)}</p>
            </div>

            <p className="cerita-body">{data.isi}</p>

            <div className="quote-block">
              <p>&ldquo;{data.kutipan}&rdquo;</p>
            </div>

            <Button
              variant="link"
              className="history-toggle-btn p-0"
              id="historyToggleBtn"
              onClick={() => setRiwayatTerbuka(!riwayatTerbuka)}
            >
              {riwayatTerbuka ? data.tombolTutup : data.tombolBuka}
            </Button>
            <div
              className={riwayatTerbuka ? "history-box show" : "history-box"}
              id="historyBox"
            >
              <strong>{data.judulFakta}</strong> {data.fakta}
            </div>
          </Col>

          <Col lg={4}>
            {data.statistik.map((item, index) => (
              <div className="stat-item mb-4" key={index}>
                <div className="stat-number">{item.angka}</div>
                <div className="stat-label">{item.label}</div>
              </div>
            ))}
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default CeritaSection;