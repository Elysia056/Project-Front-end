"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import SectionIndicator from "@/components/sectionindicator";
import HeroSection from "@/components/herosection";
import CeritaSection from "@/components/ceritasection";
import KeunikanSection from "@/components/keunikansection";
import GaleriSection from "@/components/galerisection";
import ProsesSection from "@/components/prosessection";
import LokasiSection from "@/components/lokasisection";
import PesanSection from "@/components/pesansection";
import Footer from "@/components/footer";
import type { ItemGaleri, SemuaKonten } from "@/lib/konten";

interface HomeClientProps {
  konten: SemuaKonten;
  galeri: ItemGaleri[];
}

export default function HomeClient({ konten, galeri }: HomeClientProps) {
  const [aktif, setAktif] = useState("beranda");

  // Scrollspy: tandai nav & indicator sesuai section yang sedang dilihat
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[id]");

    function updateActiveSection() {
      const scrollPos = window.scrollY + 140;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          setAktif(section.id);
        }
      });
    }

    window.addEventListener("scroll", updateActiveSection);
    updateActiveSection();

    return () => window.removeEventListener("scroll", updateActiveSection);
  }, []);

  return (
    <div className="home-page">
      <SectionIndicator aktif={aktif} menu={konten.navbar.menu} />
      <Navbar aktif={aktif} data={konten.navbar} />

      <main>
        <HeroSection data={konten.hero} />
        <CeritaSection data={konten.cerita} />
        <KeunikanSection data={konten.keunikan} />
        <GaleriSection data={konten.galeri} items={galeri} />
        <ProsesSection data={konten.proses} />
        <LokasiSection data={konten.lokasi} />
        <PesanSection data={konten.pesan} />
      </main>

      <Footer data={konten.footer} />
    </div>
  );
}
