"use client";
import { scrollKeSection } from "@/lib/scroll";

interface SectionIndicatorProps {
  aktif: string;
}

const daftarSection = [
  { id: "beranda", label: "01. Beranda" },
  { id: "cerita", label: "02. Cerita" },
  { id: "keunikan", label: "03. Keunikan" },
  { id: "galeri", label: "04. Galeri" },
  { id: "proses", label: "05. Proses" },
  { id: "lokasi", label: "06. Lokasi" },
  { id: "pesan", label: "07. Pesan" },
];

function SectionIndicator({ aktif }: SectionIndicatorProps) {
  return (
    <aside className="section-indicator" aria-label="Navigasi Halaman">
      {daftarSection.map((item) => (
        <a
          key={item.id}
          href={"#" + item.id}
          className={
            aktif === item.id ? "indicator-dot active" : "indicator-dot"
          }
          title={item.label}
          onClick={(e) => scrollKeSection(e, "#" + item.id)}
        >
          <span className="indicator-hex"></span>
          <span className="indicator-tooltip">{item.label}</span>
        </a>
      ))}
    </aside>
  );
}

export default SectionIndicator;