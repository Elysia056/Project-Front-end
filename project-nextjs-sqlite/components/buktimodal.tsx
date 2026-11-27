"use client";
import Modal from "react-bootstrap/Modal";

interface BuktiModalProps {
  src: string | null;
  onClose: () => void;
}

function BuktiModal({ src, onClose }: BuktiModalProps) {
  return (
    <Modal show={src !== null} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="font-serif">Bukti Transfer</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        {src && (
          // Gambar bukti berupa base64 dari upload, jadi pakai <img> biasa
          // eslint-disable-next-line @next/next/no-img-element
          <img
            id="buktiModalImg"
            src={src}
            alt="Bukti Transfer"
            className="img-fluid rounded"
            style={{ maxHeight: "70vh" }}
          />
        )}
      </Modal.Body>
    </Modal>
  );
}

export default BuktiModal;