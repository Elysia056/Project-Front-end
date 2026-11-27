"use client";

interface BuktiModalProps {
  src: string | null;
  onClose: () => void;
}

function BuktiModal({ src, onClose }: BuktiModalProps) {
  return (
    <div
      className={src ? "bukti-modal show" : "bukti-modal"}
      id="buktiModal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bukti-modal-content">
        <button
          className="bukti-modal-close"
          id="buktiModalClose"
          type="button"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="bukti-modal-title">Bukti Transfer</h3>
        {src && (
          // Gambar bukti berupa base64 dari upload, jadi pakai <img> biasa
          // eslint-disable-next-line @next/next/no-img-element
          <img id="buktiModalImg" src={src} alt="Bukti Transfer" />
        )}
      </div>
    </div>
  );
}

export default BuktiModal;