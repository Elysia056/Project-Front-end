"use client";
import Container from "react-bootstrap/Container";
import { scrollKeSection } from "@/lib/scroll";

export default function Footer() {
  return (
    <footer className="main-footer">
      <Container>
        <h2 className="footer-giant-title">BIKA AMBON</h2>
        <p className="footer-copyright">&copy; 2026 Kelompok 1</p>
        <a
          href="#beranda"
          className="back-to-top"
          onClick={(e) => scrollKeSection(e, "#beranda")}
        >
          <span>KEMBALI KE ATAS</span>
          <span>&uarr;</span>
        </a>
      </Container>
    </footer>
  );
}