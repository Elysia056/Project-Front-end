"use client";
import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Row, Col } from "react-bootstrap";
import { Akun, ambilUserLogin } from "@/lib/auth";
import { scrollKeSection } from "@/lib/scroll";
import type { KontenHero } from "@/lib/konten";

function HeroSection({ data }: { data: KontenHero }) {
  const [persen, setPersen] = useState(40);
  const sliceRef = useRef<HTMLDivElement>(null);
  const sedangGeser = useRef(false);

  // Tombol di sisi kanan berubah sesuai status login
  const [user, setUser] = useState<Akun | null>(null);
  useEffect(() => {
    setUser(ambilUserLogin());
  }, []);

  // Interaktif "Belah Rongganya" (slider geser)
  const geserKe = (clientX: number) => {
    if (!sliceRef.current) return;
    const rect = sliceRef.current.getBoundingClientRect();
    const percentage = ((clientX - rect.left) / rect.width) * 100;
    setPersen(Math.max(5, Math.min(95, percentage)));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sedangGeser.current) return;
      geserKe(e.clientX);
    };
    const handleMouseUp = () => {
      sedangGeser.current = false;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!sedangGeser.current) return;
      if (e.touches.length > 0) {
        geserKe(e.touches[0].clientX);
      }
    };
    const handleTouchEnd = () => {
      sedangGeser.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <section id="beranda" className="section hero-section">
      <Container>
        <Row className="g-5 align-items-center">
          <Col xl={7}>
            <div className="section-kicker">{data.kicker}</div>

            <h2 className="hero-title-main">{data.judulUtama}</h2>
            <h2 className="hero-title-outline">{data.judulOutline}</h2>

            <div className="slice-wrapper">
              <div
                className="slice-container"
                id="sliceContainer"
                ref={sliceRef}
                onMouseDown={(e) => {
                  sedangGeser.current = true;
                  geserKe(e.clientX);
                }}
                onTouchStart={(e) => {
                  sedangGeser.current = true;
                  if (e.touches.length > 0) {
                    geserKe(e.touches[0].clientX);
                  }
                }}
              >
                <div
                  className="slice-sponge"
                  id="sliceSponge"
                  style={
                    data.gambarRongga
                      ? { backgroundImage: `url('${data.gambarRongga}')` }
                      : undefined
                  }
                >
                  <div className="sponge-badge">{data.labelRongga}</div>
                </div>

                <div
                  className="slice-crust"
                  id="sliceCrust"
                  style={{
                    width: 100 - persen + "%",
                    ...(data.gambarKulit
                      ? { backgroundImage: `url('${data.gambarKulit}')` }
                      : {}),
                  }}
                >
                  <div className="crust-badge">{data.labelKulit}</div>
                </div>

                <div
                  className="slice-divider"
                  id="sliceDivider"
                  style={{ left: persen + "%" }}
                >
                  <div className="slice-handle" title="Geser ke kiri / kanan">
                    &#9986;
                  </div>
                </div>
              </div>

              <div className="slice-meta">
                <span>{data.petunjuk}</span>
                <div>
                  <span>
                    Rongga:{" "}
                    <strong id="slicePercentText">{Math.round(persen)}%</strong>
                  </span>
                  <Button
                    variant="link"
                    size="sm"
                    className="reset-btn"
                    id="resetSliceBtn"
                    onClick={() => setPersen(40)}
                  >
                    (Tengah)
                  </Button>
                </div>
              </div>
            </div>
          </Col>

          {/* Sisi kanan: deskripsi singkat dan tombol login */}
          <Col xl={5}>
            <div className="hero-side">
              <p className="hero-desc">{data.deskripsi}</p>
              {user ? (
                <a
                  href="#pesan"
                  className="btn btn-amber btn-lg"
                  onClick={(e) => scrollKeSection(e, "#pesan")}
                >
                  {data.tombolPesan}
                </a>
              ) : (
                <>
                  <Button href="/login" variant="amber" size="lg">
                    {data.tombolLogin}
                  </Button>
                  <span className="hero-login-note">{data.catatanLogin}</span>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default HeroSection;
