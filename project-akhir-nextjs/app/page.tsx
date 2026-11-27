import HomeClient from "@/components/homeclient";
import { ambilGaleri, ambilSemuaKonten } from "@/lib/kontenserver";

// Isi website dibaca dari database setiap kali halaman dibuka,
// sehingga perubahan dari halaman admin langsung terlihat.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [konten, galeri] = await Promise.all([ambilSemuaKonten(), ambilGaleri()]);
  return <HomeClient konten={konten} galeri={galeri} />;
}
