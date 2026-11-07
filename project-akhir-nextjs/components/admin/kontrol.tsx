"use client";
// Komponen kecil yang dipakai berulang oleh editor website di halaman admin.
import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { unggahGambar } from "@/components/admin/api";

export function Teks({
  label,
  value,
  onChange,
  baris = 1,
  petunjuk,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  baris?: number;
  petunjuk?: string;
}) {
  return (
    <Form.Group className="mb-3">
      <Form.Label className="fw-semibold small mb-1">{label}</Form.Label>
      {baris > 1 ? (
        <Form.Control
          as="textarea"
          rows={baris}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Form.Control value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      {petunjuk && <Form.Text muted>{petunjuk}</Form.Text>}
    </Form.Group>
  );
}

export function Angka({
  label,
  value,
  onChange,
  petunjuk,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  petunjuk?: string;
  step?: string;
}) {
  return (
    <Form.Group className="mb-3">
      <Form.Label className="fw-semibold small mb-1">{label}</Form.Label>
      <Form.Control
        type="number"
        step={step}
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(e.target.value === "" ? NaN : Number(e.target.value))}
      />
      {petunjuk && <Form.Text muted>{petunjuk}</Form.Text>}
    </Form.Group>
  );
}

// Daftar yang bisa ditambah, dihapus, dan diurutkan ulang
export function DaftarEditor<T>({
  judul,
  items,
  onChange,
  itemBaru,
  renderItem,
  minItem = 0,
  labelTambah = "Tambah",
}: {
  judul: string;
  items: T[];
  onChange: (items: T[]) => void;
  itemBaru: () => T;
  renderItem: (item: T, ubah: (baru: T) => void, index: number) => React.ReactNode;
  minItem?: number;
  labelTambah?: string;
}) {
  const ubah = (i: number, item: T) => onChange(items.map((x, j) => (j === i ? item : x)));
  const hapus = (i: number) => onChange(items.filter((_, j) => j !== i));
  const pindah = (i: number, arah: -1 | 1) => {
    const tujuan = i + arah;
    if (tujuan < 0 || tujuan >= items.length) return;
    const salinan = [...items];
    [salinan[i], salinan[tujuan]] = [salinan[tujuan], salinan[i]];
    onChange(salinan);
  };

  return (
    <div className="mb-3">
      <div className="fw-semibold small mb-2">{judul}</div>
      {items.map((item, i) => (
        <Card className="mb-2" key={i}>
          <Card.Body className="py-2">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="badge text-bg-secondary">{i + 1}</span>
              <div className="btn-group btn-group-sm">
                <Button variant="outline-secondary" disabled={i === 0} onClick={() => pindah(i, -1)}>
                  &uarr;
                </Button>
                <Button
                  variant="outline-secondary"
                  disabled={i === items.length - 1}
                  onClick={() => pindah(i, 1)}
                >
                  &darr;
                </Button>
                <Button
                  variant="outline-danger"
                  disabled={items.length <= minItem}
                  onClick={() => hapus(i)}
                >
                  Hapus
                </Button>
              </div>
            </div>
            {renderItem(item, (baru) => ubah(i, baru), i)}
          </Card.Body>
        </Card>
      ))}
      <Button variant="outline-dark" size="sm" onClick={() => onChange([...items, itemBaru()])}>
        + {labelTambah}
      </Button>
    </div>
  );
}

// Pratinjau gambar + tombol unggah (gambar diperkecil di browser sebelum dikirim)
export function PilihGambar({
  label,
  value,
  onChange,
  bolehKosong = false,
}: {
  label: string;
  value: string;
  onChange: (src: string, lebar: number, tinggi: number) => void;
  bolehKosong?: boolean;
}) {
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState("");

  const pilih = async (file: File | undefined) => {
    if (!file) return;
    setSibuk(true);
    setGalat("");
    try {
      const hasil = await unggahGambar(file);
      onChange(hasil.url, hasil.lebar, hasil.tinggi);
    } catch (err) {
      setGalat(err instanceof Error ? err.message : "Gagal mengunggah gambar.");
    } finally {
      setSibuk(false);
    }
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label className="fw-semibold small mb-1">{label}</Form.Label>
      <div className="d-flex align-items-center gap-3 flex-wrap">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Pratinjau"
            style={{ maxHeight: 110, maxWidth: 180, objectFit: "cover", borderRadius: 4, border: "1px solid #ddd" }}
          />
        ) : (
          <div className="text-muted small border rounded px-3 py-4">Warna bawaan (tanpa gambar)</div>
        )}
        <div>
          <Form.Control
            type="file"
            size="sm"
            accept="image/png,image/jpeg,image/webp"
            disabled={sibuk}
            onChange={(e) => {
              const input = e.target as HTMLInputElement;
              pilih(input.files?.[0]);
              input.value = "";
            }}
          />
          {sibuk && <div className="small text-muted mt-1">Mengunggah...</div>}
          {bolehKosong && value && (
            <Button variant="link" size="sm" className="p-0 mt-1" onClick={() => onChange("", 0, 0)}>
              Hapus gambar
            </Button>
          )}
        </div>
      </div>
      {galat && (
        <Alert variant="danger" className="mt-2 mb-0 py-1 small">
          {galat}
        </Alert>
      )}
    </Form.Group>
  );
}

// Kartu pembungkus satu bagian: judul, isi form, tombol simpan, dan kembalikan ke bawaan
export function KartuBagian({
  judul,
  onSimpan,
  onReset,
  children,
}: {
  judul: string;
  onSimpan: () => Promise<void>;
  onReset?: () => Promise<void>;
  children: React.ReactNode;
}) {
  const [pesan, setPesan] = useState<{ jenis: "success" | "danger"; teks: string } | null>(null);
  const [sibuk, setSibuk] = useState(false);

  const jalankan = async (aksi: () => Promise<void>, sukses: string) => {
    setSibuk(true);
    setPesan(null);
    try {
      await aksi();
      setPesan({ jenis: "success", teks: sukses });
    } catch (err) {
      setPesan({ jenis: "danger", teks: err instanceof Error ? err.message : "Gagal menyimpan." });
    } finally {
      setSibuk(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h2 className="h5 font-serif fw-bold mb-3">{judul}</h2>
        {children}
        <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
          <Button
            variant="dark"
            disabled={sibuk}
            onClick={() => jalankan(onSimpan, "Tersimpan. Perubahan sudah tampil di website.")}
          >
            {sibuk ? "Menyimpan..." : "Simpan perubahan"}
          </Button>
          {onReset && (
            <Button
              variant="outline-secondary"
              disabled={sibuk}
              onClick={() => {
                if (confirm("Kembalikan bagian ini ke isi bawaan? Perubahanmu akan hilang.")) {
                  jalankan(onReset, "Dikembalikan ke isi bawaan.");
                }
              }}
            >
              Kembalikan ke bawaan
            </Button>
          )}
          <Button variant="link" href="/" target="_blank" rel="noopener">
            Lihat website &nearr;
          </Button>
        </div>
        {pesan && (
          <Alert variant={pesan.jenis} className="mt-3 mb-0 py-2">
            {pesan.teks}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}
