"use client";
import Container from "react-bootstrap/Container";
import { Row, Col } from "react-bootstrap";

import type { KontenKeunikan } from "@/lib/konten";

function KeunikanSection({ data }: { data: KontenKeunikan }) {
  return (
    <section id="keunikan" className="section keunikan-section">
      <Container>
        <div className="section-kicker">{data.kicker}</div>
        <h2 className="section-title">{data.judul}</h2>

        <Row className="g-4">
          {data.items.map((item, index) => (
            <Col md={6} lg={4} key={index}>
            <div className="keunikan-card h-100">
              <div>
                <div className="card-icon-badge"></div>
                <span className="card-num">{String(index + 1).padStart(2, "0")}</span>
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