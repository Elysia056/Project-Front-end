"use client";
import Container from "react-bootstrap/Container";
import { scrollKeSection } from "@/lib/scroll";
import type { KontenFooter } from "@/lib/konten";

export default function Footer({ data }: { data: KontenFooter }) {
  return (
    <footer className="main-footer">
      <Container>
        <h2 className="footer-giant-title">{data.judulBesar}</h2>
        <p className="footer-copyright">{data.hakCipta}</p>
        <a
          href="#beranda"
          className="back-to-top"
          onClick={(e) => scrollKeSection(e, "#beranda")}
        >
          <span>{data.tombolKembali}</span>
          <span>&uarr;</span>
        </a>
      </Container>
    </footer>
  );
}