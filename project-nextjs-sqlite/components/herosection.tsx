"use client";
import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

function HeroSection() {
  const [persen, setPersen] = useState(40);
  const sliceRef = useRef<HTMLDivElement>(null);
  const sedangGeser = useRef(false);

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
        <div className="section-kicker">{"// kue sarang lebah khas medan"}</div>

        <h2 className="hero-title-main">Belah</h2>
        <h2 className="hero-title-outline">Rongganya.</h2>

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
            <div className="slice-sponge" id="sliceSponge">
              <div className="sponge-badge">Rongga Dalam</div>
            </div>

            <div
              className="slice-crust"
              id="sliceCrust"
              style={{ width: 100 - persen + "%" }}
            >
              <div className="crust-badge">Kulit Luar</div>
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
            <span>geser garis untuk membelah &rarr;</span>
            <div>
              <span>
                Rongga: <strong id="slicePercentText">{Math.round(persen)}%</strong>
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
      </Container>
    </section>
  );
}

export default HeroSection;