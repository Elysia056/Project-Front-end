"use client";
import Container from "react-bootstrap/Container";

import type { KontenProses } from "@/lib/konten";

function ProsesSection({ data }: { data: KontenProses }) {
  return (
    <section id="proses" className="section proses-section">
      <Container>
        <div className="section-kicker" style={{ textAlign: "center" }}>
          {data.kicker}
        </div>
        <h2 className="section-title">{data.judul}</h2>

        <div className="timeline-wrapper">
          <div className="timeline-line"></div>

          {data.langkah.map((langkah, index) => (
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