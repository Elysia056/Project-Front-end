import DashHeader from "@/components/dashheader";
import GaleriSection from "@/components/galerisection";
import { ambilGaleri, ambilSemuaKonten } from "@/lib/kontenserver";

export const dynamic = "force-dynamic";

export default async function HalamanGaleri() {
  const [konten, galeri] = await Promise.all([ambilSemuaKonten(), ambilGaleri()]);
  return (
    <div className="min-vh-100 d-flex flex-column">
      <DashHeader>
        <a href="/" className="btn btn-outline-light btn-sm">
          &larr; Kembali ke Beranda
        </a>
      </DashHeader>
      <main className="flex-grow-1">
        <GaleriSection data={konten.galeri} items={galeri} />
      </main>
    </div>
  );
}