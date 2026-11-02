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

export default function Home() {
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
      <SectionIndicator aktif={aktif} />
      <Navbar aktif={aktif} />

      <main>
        <HeroSection />
        <CeritaSection />
        <KeunikanSection />
        <GaleriSection />
        <ProsesSection />
        <LokasiSection />
        <PesanSection />
      </main>

      <Footer />
    </div>
  );
}
