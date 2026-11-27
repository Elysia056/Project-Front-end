"use client";
import { scrollKeSection } from "@/lib/scroll";

interface SectionIndicatorProps {
  aktif: string;
  menu: { id: string; label: string }[];
}

// Label titik navigasi diambil dari menu navbar (diatur admin); "Pesan" selalu terakhir
function rapikan(label: string) {
  const kecil = label.toLowerCase();
  return kecil.charAt(0).toUpperCase() + kecil.slice(1);
}

function SectionIndicator({ aktif, menu }: SectionIndicatorProps) {
  const daftarSection = [...menu, { id: "pesan", label: "Pesan" }].map((item, i) => ({
    id: item.id,
    label: String(i + 1).padStart(2, "0") + ". " + rapikan(item.label),
  }));
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