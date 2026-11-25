import DashHeader from "@/components/dashheader";
import LokasiSection from "@/components/lokasisection";
import { ambilSemuaKonten } from "@/lib/kontenserver";

export const dynamic = "force-dynamic";

export default async function HalamanKontak() {
  const konten = await ambilSemuaKonten();
  return (
    <div className="min-vh-100">
      <DashHeader>
        <a href="/" className="btn btn-outline-light btn-sm">&larr; Beranda</a>
      </DashHeader>
      <LokasiSection data={konten.lokasi} />
    </div>
  );
}