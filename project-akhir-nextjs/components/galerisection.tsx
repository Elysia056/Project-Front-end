"use client";
import { useState } from "react";
import Image from "next/image";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";

import type { ItemGaleri, KontenGaleri } from "@/lib/konten";

// Gambar dari folder public dioptimasi Next.js; gambar unggahan admin (dari database) apa adanya
const tanpaOptimasi = (src: string) => !src.startsWith("/images/");

function GaleriSection({ data, items }: { data: KontenGaleri; items: ItemGaleri[] }) {
  const [modalTampil, setModalTampil] = useState(false);
  const [terpilih, setTerpilih] = useState<ItemGaleri | null>(null);

  const bukaModal = (item: ItemGaleri) => {
    setTerpilih(item);
    setModalTampil(true);
  };

  return (
    <>
      <section id="galeri" className="section galeri-section">
        <Container>
          <div className="galeri-header-flex">
            <div className="section-kicker">{data.kicker}</div>
          </div>
          <h2 className="section-title">{data.judul}</h2>

          <div className="galeri-layout">
            <div className="gallery-scroller" id="galleryScroller">
              {items.map((item) => (
                <div
                  className="gallery-card"
                  key={item.id}
                  onClick={() => bukaModal(item)}
                >
                  <div className="gallery-art-frame">
                    <Image
                      src={item.gambar}
                      alt={item.judul}
                      width={item.lebar}
                      height={item.tinggi}
                      unoptimized={tanpaOptimasi(item.gambar)}
                    />
                  </div>
                  <div className="gallery-label">{item.kode}</div>
                </div>
              ))}
            </div>

            <div className="gallery-track-accent"></div>
          </div>
        </Container>
      </section>

      {/* Galeri: modal preview saat card diklik */}
      <Modal
        show={modalTampil && terpilih !== null}
        onHide={() => setModalTampil(false)}
        centered
        size="lg"
        id="galleryModal"
      >
        {terpilih && (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="font-serif" id="modalTitle">
                {terpilih.judul}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Image
                id="modalImg"
                src={terpilih.gambar}
                alt={terpilih.judul}
                width={terpilih.lebar}
                height={terpilih.tinggi}
                unoptimized={tanpaOptimasi(terpilih.gambar)}
                className="img-fluid rounded mb-3 d-block mx-auto"
                style={{ maxHeight: "55vh", width: "auto" }}
              />
              <small className="text-muted d-block mb-1" id="modalCode">
                {terpilih.kode}
              </small>
              <p className="mb-0" id="modalDesc">
                {terpilih.deskripsi}
              </p>
            </Modal.Body>
          </>
        )}
      </Modal>
    </>
  );
}

export default GaleriSection;
