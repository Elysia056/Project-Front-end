"use client";
import { useState } from "react";
import Image from "next/image";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";

interface ItemGaleri {
  code: string;
  title: string;
  desc: string;
  img: string;
  lebar: number;
  tinggi: number;
}

const daftarGaleri: ItemGaleri[] = [
  {
    code: "001 - potongan klasik",
    title: "Potongan Klasik",
    desc: "Dua potong bika ambon berserat vertikal sempurna disajikan di atas piring saji tradisi bersama helai daun pandan wangi.",
    img: "/images/PotonganKlasik.jpeg",
    lebar: 975,
    tinggi: 669,
  },
  {
    code: "002 - rongga tebal, close-up",
    title: "Rongga Tebal, Close-Up",
    desc: "Tampilan makro lubang sarang lebah yang terbentuk sempurna akibat pelepasan karbondioksida alami ragi nira kelapa.",
    img: "/images/RonggaCloseUp.png",
    lebar: 700,
    tinggi: 700,
  },
  {
    code: "003 - dipanggang perlahan",
    title: "Dipanggang Perlahan",
    desc: "Loyang tembaga kuno bersuhu stabil dengan tutup arang panas membakar adonan perlahan dari bawah ke atas.",
    img: "/images/Dipanggang.png",
    lebar: 1080,
    tinggi: 1080,
  },
  {
    code: "004 - siap disajikan",
    title: "Siap Disajikan",
    desc: "Bika ambon beraroma harum pandan daun suji yang dipotong rapi siap dinikmati bersama secangkir kopi Sidikalang.",
    img: "/images/Disajikan.jpg",
    lebar: 1200,
    tinggi: 900,
  },
  {
    code: "005 - potong hangat, uap masih naik",
    title: "Potong Hangat, Uap Masih Naik",
    desc: "Kue yang baru saja keluar dari tungku, dipotong saat masih hangat mengepul dengan keharuman daun jeruk dan serai.",
    img: "/images/BikaAmbonPlate.png",
    lebar: 735,
    tinggi: 670,
  },
];

function GaleriSection() {
  const [modalTampil, setModalTampil] = useState(false);
  const [terpilih, setTerpilih] = useState<ItemGaleri>(daftarGaleri[0]);

  const bukaModal = (item: ItemGaleri) => {
    setTerpilih(item);
    setModalTampil(true);
  };

  return (
    <>
      <section id="galeri" className="section galeri-section">
        <Container>
          <div className="galeri-header-flex">
            <div className="section-kicker">{"// galeri"}</div>
          </div>
          <h2 className="section-title">Sudut-sudut Rongganya</h2>

          <div className="galeri-layout">
            <div className="gallery-scroller" id="galleryScroller">
              {daftarGaleri.map((item) => (
                <div
                  className="gallery-card"
                  key={item.code}
                  onClick={() => bukaModal(item)}
                >
                  <div className="gallery-art-frame">
                    <Image
                      src={item.img}
                      alt={item.title}
                      width={item.lebar}
                      height={item.tinggi}
                    />
                  </div>
                  <div className="gallery-label">{item.code}</div>
                </div>
              ))}
            </div>

            <div className="gallery-track-accent"></div>
          </div>
        </Container>
      </section>

      {/* Galeri: modal preview saat card diklik */}
      <Modal
        show={modalTampil}
        onHide={() => setModalTampil(false)}
        centered
        size="lg"
        id="galleryModal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="font-serif" id="modalTitle">
            {terpilih.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image
            id="modalImg"
            src={terpilih.img}
            alt={terpilih.title}
            width={terpilih.lebar}
            height={terpilih.tinggi}
            className="img-fluid rounded mb-3 d-block mx-auto"
            style={{ maxHeight: "55vh", width: "auto" }}
          />
          <small className="text-muted d-block mb-1" id="modalCode">
            {terpilih.code}
          </small>
          <p className="mb-0" id="modalDesc">
            {terpilih.desc}
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default GaleriSection;