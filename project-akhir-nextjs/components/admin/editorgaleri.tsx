"use client";
// Editor galeri: tambah, ganti gambar, ubah keterangan, urutkan, dan hapus foto.
import { useCallback, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
import { panggil } from "@/components/admin/api";
import { PilihGambar, Teks } from "@/components/admin/kontrol";
import type { ItemGaleri } from "@/lib/konten";

function KartuFoto({
  item,
  index,
  total,
  muatUlang,
  pindah,
}: {
  item: ItemGaleri;
  index: number;
  total: number;
  muatUlang: () => Promise<void>;
  pindah: (arah: -1 | 1) => Promise<void>;
}) {
  const [judul, setJudul] = useState(item.judul);
  const [kode, setKode] = useState(item.kode);
  const [deskripsi, setDeskripsi] = useState(item.deskripsi);
  const [pesan, setPesan] = useState<{ jenis: "success" | "danger"; teks: string } | null>(null);
  const [sibuk, setSibuk] = useState(false);

  const jalankan = async (aksi: () => Promise<void>, sukses?: string) => {
    setSibuk(true);
    setPesan(null);
    try {
      await aksi();
      if (sukses) setPesan({ jenis: "success", teks: sukses });
    } catch (err) {
      setPesan({ jenis: "danger", teks: err instanceof Error ? err.message : "Gagal." });
    } finally {
      setSibuk(false);
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Row className="g-3">
          <Col md={4}>
            <PilihGambar
              label={`Foto ${index + 1} (ganti gambar)`}
              value={item.gambar}
              onChange={(src, lebar, tinggi) =>
                jalankan(async () => {
                  await panggil(`/api/galeri/${item.id}`, "PATCH", { gambar: src, lebar, tinggi });
                  await muatUlang();
                })
              }
            />
          </Col>
          <Col md={8}>
            <Teks label="Judul" value={judul} onChange={setJudul} />
            <Teks label="Label di bawah foto" value={kode} onChange={setKode} />
            <Teks label="Keterangan (tampil saat foto diklik)" value={deskripsi} onChange={setDeskripsi} baris={3} />
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <Button
                size="sm"
                variant="dark"
                disabled={sibuk}
                onClick={() =>
                  jalankan(async () => {
                    await panggil(`/api/galeri/${item.id}`, "PATCH", { judul, kode, deskripsi });
                    await muatUlang();
                  }, "Tersimpan.")
                }
              >
                Simpan teks
              </Button>
              <div className="btn-group btn-group-sm">
                <Button variant="outline-secondary" disabled={sibuk || index === 0} onClick={() => jalankan(() => pindah(-1))}>
                  &uarr; Naik
                </Button>
                <Button variant="outline-secondary" disabled={sibuk || index === total - 1} onClick={() => jalankan(() => pindah(1))}>
                  &darr; Turun
                </Button>
              </div>
              <Button
                size="sm"
                variant="outline-danger"
                disabled={sibuk}
                onClick={() => {
                  if (!confirm(`Hapus foto "${item.judul}"?`)) return;
                  jalankan(async () => {
                    await panggil(`/api/galeri/${item.id}`, "DELETE");
                    await muatUlang();
                  });
                }}
              >
                Hapus foto
              </Button>
            </div>
            {pesan && (
              <Alert variant={pesan.jenis} className="mt-2 mb-0 py-1 small">
                {pesan.teks}
              </Alert>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default function EditorGaleri() {
  const [items, setItems] = useState<ItemGaleri[] | null>(null);
  const [galat, setGalat] = useState("");

  // Form foto baru
  const [judulBaru, setJudulBaru] = useState("");
  const [deskripsiBaru, setDeskripsiBaru] = useState("");
  const [gambarBaru, setGambarBaru] = useState<{ src: string; lebar: number; tinggi: number } | null>(null);
  const [pesanBaru, setPesanBaru] = useState<{ jenis: "success" | "danger"; teks: string } | null>(null);
  const [sibukBaru, setSibukBaru] = useState(false);

  const muatUlang = useCallback(async () => {
    try {
      setItems(await panggil<ItemGaleri[]>("/api/galeri"));
    } catch (err) {
      setGalat(err instanceof Error ? err.message : "Gagal memuat galeri.");
    }
  }, []);

  useEffect(() => {
    muatUlang();
  }, [muatUlang]);

  const pindah = async (index: number, arah: -1 | 1) => {
    if (!items) return;
    const tujuan = index + arah;
    if (tujuan < 0 || tujuan >= items.length) return;
    const urutanBaru = [...items];
    [urutanBaru[index], urutanBaru[tujuan]] = [urutanBaru[tujuan], urutanBaru[index]];
    await panggil("/api/galeri/urut", "POST", { ids: urutanBaru.map((x) => x.id) });
    await muatUlang();
  };

  const tambah = async () => {
    if (!judulBaru.trim() || !gambarBaru) {
      setPesanBaru({ jenis: "danger", teks: "Isi judul dan pilih gambar dulu." });
      return;
    }
    setSibukBaru(true);
    setPesanBaru(null);
    try {
      await panggil("/api/galeri", "POST", {
        judul: judulBaru,
        deskripsi: deskripsiBaru,
        gambar: gambarBaru.src,
        lebar: gambarBaru.lebar,
        tinggi: gambarBaru.tinggi,
      });
      setJudulBaru("");
      setDeskripsiBaru("");
      setGambarBaru(null);
      setPesanBaru({ jenis: "success", teks: "Foto ditambahkan ke galeri." });
      await muatUlang();
    } catch (err) {
      setPesanBaru({ jenis: "danger", teks: err instanceof Error ? err.message : "Gagal menambah foto." });
    } finally {
      setSibukBaru(false);
    }
  };

  return (
    <Card className="shadow-sm mt-4">
      <Card.Body>
        <h2 className="h5 font-serif fw-bold mb-3">Foto Galeri</h2>

        <Card className="mb-4 border-warning-subtle">
          <Card.Body>
            <div className="fw-semibold mb-2">Tambah foto baru</div>
            <Teks label="Judul foto" value={judulBaru} onChange={setJudulBaru} />
            <Teks label="Keterangan" value={deskripsiBaru} onChange={setDeskripsiBaru} baris={2} />
            <PilihGambar
              label="Gambar (JPG, PNG, atau WebP)"
              value={gambarBaru?.src ?? ""}
              onChange={(src, lebar, tinggi) => setGambarBaru({ src, lebar, tinggi })}
            />
            <Form.Text muted className="d-block mb-2">
              Gambar otomatis diperkecil (maks. 1600 px) sebelum diunggah.
            </Form.Text>
            <Button variant="dark" disabled={sibukBaru} onClick={tambah}>
              {sibukBaru ? "Menyimpan..." : "Tambah ke galeri"}
            </Button>
            {pesanBaru && (
              <Alert variant={pesanBaru.jenis} className="mt-3 mb-0 py-2">
                {pesanBaru.teks}
              </Alert>
            )}
          </Card.Body>
        </Card>

        {galat && <Alert variant="danger">{galat}</Alert>}
        {!items && !galat && <p className="text-muted">Memuat galeri...</p>}
        {items && items.length === 0 && (
          <Alert variant="warning">Galeri masih kosong. Tambahkan foto di atas.</Alert>
        )}
        {items?.map((item, index) => (
          <KartuFoto
            key={`${item.id}-${item.gambar}`}
            item={item}
            index={index}
            total={items.length}
            muatUlang={muatUlang}
            pindah={(arah) => pindah(index, arah)}
          />
        ))}
      </Card.Body>
    </Card>
  );
}
