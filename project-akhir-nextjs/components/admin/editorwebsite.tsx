"use client";
// Editor website: admin mengubah teks dan gambar tiap bagian website dari halaman admin.
import { createContext, useContext, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import { Row, Col } from "react-bootstrap";
import { panggil } from "@/components/admin/api";
import { Angka, DaftarEditor, KartuBagian, PilihGambar, Teks } from "@/components/admin/kontrol";
import EditorGaleri from "@/components/admin/editorgaleri";
import type { KunciKonten, SemuaKonten } from "@/lib/konten";

const BAGIAN: { kunci: KunciKonten; label: string }[] = [
  { kunci: "navbar", label: "Navbar" },
  { kunci: "hero", label: "Hero (Beranda)" },
  { kunci: "cerita", label: "Cerita" },
  { kunci: "keunikan", label: "Keunikan" },
  { kunci: "galeri", label: "Galeri" },
  { kunci: "proses", label: "Proses" },
  { kunci: "lokasi", label: "Lokasi & Kontak" },
  { kunci: "pesan", label: "Pesan, Harga & Rekening" },
  { kunci: "footer", label: "Footer" },
];

const PILIHAN_IKON = [
  { nilai: "bx bxl-instagram", label: "Instagram" },
  { nilai: "bx bxl-whatsapp", label: "WhatsApp" },
  { nilai: "bx bxl-tiktok", label: "TikTok" },
  { nilai: "bx bxl-facebook-square", label: "Facebook" },
  { nilai: "bx bxl-youtube", label: "YouTube" },
  { nilai: "bx bxl-twitter", label: "X / Twitter" },
];

// Supaya isi yang sudah disimpan tetap terlihat saat admin pindah bagian lalu kembali
const PerbaruiKonten = createContext<(kunci: KunciKonten, nilai: unknown) => void>(() => {});

// Satu bagian website: menyimpan salinan kerja (draft), lalu PUT ke API saat disimpan
function EditorBagian<K extends KunciKonten>({
  kunci,
  judul,
  awal,
  form,
}: {
  kunci: K;
  judul: string;
  awal: SemuaKonten[K];
  form: (draft: SemuaKonten[K], set: (d: SemuaKonten[K]) => void) => React.ReactNode;
}) {
  const [draft, setDraft] = useState<SemuaKonten[K]>(awal);
  const perbarui = useContext(PerbaruiKonten);

  return (
    <KartuBagian
      judul={judul}
      onSimpan={async () => {
        const hasil = await panggil<SemuaKonten[K]>(`/api/konten/${kunci}`, "PUT", draft);
        setDraft(hasil);
        perbarui(kunci, hasil);
      }}
      onReset={async () => {
        const hasil = await panggil<SemuaKonten[K]>(`/api/konten/${kunci}`, "DELETE");
        setDraft(hasil);
        perbarui(kunci, hasil);
      }}
    >
      {form(draft, setDraft)}
    </KartuBagian>
  );
}

export default function EditorWebsite() {
  const [konten, setKonten] = useState<SemuaKonten | null>(null);
  const [galat, setGalat] = useState("");
  const [bagian, setBagian] = useState<KunciKonten>("navbar");

  useEffect(() => {
    panggil<SemuaKonten>("/api/konten")
      .then(setKonten)
      .catch((err) => setGalat(err instanceof Error ? err.message : "Gagal memuat isi website."));
  }, []);

  if (galat) return <Alert variant="danger">{galat}</Alert>;
  if (!konten) return <p className="text-muted">Memuat isi website...</p>;

  return (
    <PerbaruiKonten.Provider
      value={(kunci, nilai) => setKonten((lama) => (lama ? { ...lama, [kunci]: nilai } : lama))}
    >
    <Row className="g-4">
      <Col md={3}>
        <Nav variant="pills" className="flex-column editor-nav" activeKey={bagian} onSelect={(k) => k && setBagian(k as KunciKonten)}>
          {BAGIAN.map((b) => (
            <Nav.Item key={b.kunci}>
              <Nav.Link eventKey={b.kunci}>{b.label}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
        <p className="small text-muted mt-3">
          Pilih bagian website, ubah isinya, lalu klik <strong>Simpan perubahan</strong>. Hasilnya langsung tampil di
          halaman utama.
        </p>
      </Col>

      <Col md={9}>
        {bagian === "navbar" && (
          <EditorBagian
            key="navbar"
            kunci="navbar"
            judul="Navbar"
            awal={konten.navbar}
            form={(d, set) => (
              <>
                <Teks label="Nama brand" value={d.brand} onChange={(v) => set({ ...d, brand: v })} />
                <Teks label="Tagline di bawah nama" value={d.tagline} onChange={(v) => set({ ...d, tagline: v })} />
                <Teks label="Tombol masuk (saat belum login)" value={d.labelMasuk} onChange={(v) => set({ ...d, labelMasuk: v })} />
                <Teks label="Tombol pesan" value={d.tombolPesan} onChange={(v) => set({ ...d, tombolPesan: v })} />
                <div className="fw-semibold small mb-2">Label menu (urutan dan tujuan menu tetap)</div>
                {d.menu.map((m, i) => (
                  <Teks
                    key={m.id}
                    label={`Menu ke ${m.id}`}
                    value={m.label}
                    onChange={(v) => set({ ...d, menu: d.menu.map((x, j) => (j === i ? { ...x, label: v } : x)) })}
                  />
                ))}
              </>
            )}
          />
        )}

        {bagian === "hero" && (
          <EditorBagian
            key="hero"
            kunci="hero"
            judul="Hero (Beranda)"
            awal={konten.hero}
            form={(d, set) => (
              <>
                <Teks label="Teks kecil di atas judul" value={d.kicker} onChange={(v) => set({ ...d, kicker: v })} />
                <Teks label="Judul besar (baris 1)" value={d.judulUtama} onChange={(v) => set({ ...d, judulUtama: v })} />
                <Teks label="Judul garis tepi (baris 2)" value={d.judulOutline} onChange={(v) => set({ ...d, judulOutline: v })} />
                <Teks label="Label sisi rongga" value={d.labelRongga} onChange={(v) => set({ ...d, labelRongga: v })} />
                <Teks label="Label sisi kulit" value={d.labelKulit} onChange={(v) => set({ ...d, labelKulit: v })} />
                <Teks label="Petunjuk geser" value={d.petunjuk} onChange={(v) => set({ ...d, petunjuk: v })} />
                <PilihGambar
                  label="Gambar sisi rongga (kiri)"
                  value={d.gambarRongga}
                  onChange={(src) => set({ ...d, gambarRongga: src })}
                />
                <PilihGambar
                  label="Gambar sisi kulit (kanan, opsional)"
                  value={d.gambarKulit}
                  bolehKosong
                  onChange={(src) => set({ ...d, gambarKulit: src })}
                />
              </>
            )}
          />
        )}

        {bagian === "cerita" && (
          <EditorBagian
            key="cerita"
            kunci="cerita"
            judul="Cerita"
            awal={konten.cerita}
            form={(d, set) => (
              <>
                <Teks label="Teks kecil di atas" value={d.kicker} onChange={(v) => set({ ...d, kicker: v })} />
                <Teks label="Paragraf pembuka" petunjuk="Huruf pertama otomatis tampil besar." baris={3} value={d.pembuka} onChange={(v) => set({ ...d, pembuka: v })} />
                <Teks label="Isi cerita" baris={5} value={d.isi} onChange={(v) => set({ ...d, isi: v })} />
                <Teks label="Kutipan" baris={2} value={d.kutipan} onChange={(v) => set({ ...d, kutipan: v })} />
                <Teks label="Tombol buka sejarah" value={d.tombolBuka} onChange={(v) => set({ ...d, tombolBuka: v })} />
                <Teks label="Tombol tutup sejarah" value={d.tombolTutup} onChange={(v) => set({ ...d, tombolTutup: v })} />
                <Teks label="Judul kotak fakta" value={d.judulFakta} onChange={(v) => set({ ...d, judulFakta: v })} />
                <Teks label="Isi kotak fakta" baris={5} value={d.fakta} onChange={(v) => set({ ...d, fakta: v })} />
                <DaftarEditor
                  judul="Statistik"
                  items={d.statistik}
                  onChange={(items) => set({ ...d, statistik: items })}
                  itemBaru={() => ({ angka: "", label: "" })}
                  labelTambah="Tambah statistik"
                  renderItem={(item, ubah) => (
                    <>
                      <Teks label="Angka" value={item.angka} onChange={(v) => ubah({ ...item, angka: v })} />
                      <Teks label="Keterangan" value={item.label} onChange={(v) => ubah({ ...item, label: v })} />
                    </>
                  )}
                />
              </>
            )}
          />
        )}

        {bagian === "keunikan" && (
          <EditorBagian
            key="keunikan"
            kunci="keunikan"
            judul="Keunikan"
            awal={konten.keunikan}
            form={(d, set) => (
              <>
                <Teks label="Teks kecil di atas" value={d.kicker} onChange={(v) => set({ ...d, kicker: v })} />
                <Teks label="Judul bagian" value={d.judul} onChange={(v) => set({ ...d, judul: v })} />
                <DaftarEditor
                  judul="Kartu keunikan (nomor otomatis)"
                  items={d.items}
                  onChange={(items) => set({ ...d, items })}
                  itemBaru={() => ({ judul: "", deskripsi: "" })}
                  labelTambah="Tambah kartu"
                  renderItem={(item, ubah) => (
                    <>
                      <Teks label="Judul" value={item.judul} onChange={(v) => ubah({ ...item, judul: v })} />
                      <Teks label="Deskripsi" baris={3} value={item.deskripsi} onChange={(v) => ubah({ ...item, deskripsi: v })} />
                    </>
                  )}
                />
              </>
            )}
          />
        )}

        {bagian === "galeri" && (
          <>
            <EditorBagian
              key="galeri"
              kunci="galeri"
              judul="Galeri: judul bagian"
              awal={konten.galeri}
              form={(d, set) => (
                <>
                  <Teks label="Teks kecil di atas" value={d.kicker} onChange={(v) => set({ ...d, kicker: v })} />
                  <Teks label="Judul bagian" value={d.judul} onChange={(v) => set({ ...d, judul: v })} />
                </>
              )}
            />
            <EditorGaleri />
          </>
        )}

        {bagian === "proses" && (
          <EditorBagian
            key="proses"
            kunci="proses"
            judul="Proses"
            awal={konten.proses}
            form={(d, set) => (
              <>
                <Teks label="Teks kecil di atas" value={d.kicker} onChange={(v) => set({ ...d, kicker: v })} />
                <Teks label="Judul bagian" value={d.judul} onChange={(v) => set({ ...d, judul: v })} />
                <DaftarEditor
                  judul="Langkah proses (nomor otomatis)"
                  items={d.langkah}
                  onChange={(langkah) => set({ ...d, langkah })}
                  itemBaru={() => ({ judul: "", deskripsi: "" })}
                  labelTambah="Tambah langkah"
                  renderItem={(item, ubah) => (
                    <>
                      <Teks label="Judul langkah" value={item.judul} onChange={(v) => ubah({ ...item, judul: v })} />
                      <Teks label="Deskripsi" baris={2} value={item.deskripsi} onChange={(v) => ubah({ ...item, deskripsi: v })} />
                    </>
                  )}
                />
              </>
            )}
          />
        )}

        {bagian === "lokasi" && (
          <EditorBagian
            key="lokasi"
            kunci="lokasi"
            judul="Lokasi & Kontak"
            awal={konten.lokasi}
            form={(d, set) => (
              <>
                <Teks label="Teks kecil di atas" value={d.kicker} onChange={(v) => set({ ...d, kicker: v })} />
                <Teks label="Judul bagian" value={d.judul} onChange={(v) => set({ ...d, judul: v })} />
                <Teks
                  label="Link peta (embed Google Maps)"
                  baris={3}
                  petunjuk="Di Google Maps: Bagikan > Sematkan peta > salin isi src=&quot;...&quot; saja. Harus diawali https://"
                  value={d.mapSrc}
                  onChange={(v) => set({ ...d, mapSrc: v })}
                />
                <Teks label="Alamat toko" baris={2} value={d.alamat} onChange={(v) => set({ ...d, alamat: v })} />
                <Teks label="Jam buka" value={d.jamBuka} onChange={(v) => set({ ...d, jamBuka: v })} />
                <Teks label="Nomor WhatsApp (tampilan)" value={d.whatsapp} onChange={(v) => set({ ...d, whatsapp: v })} />
                <DaftarEditor
                  judul="Media sosial"
                  items={d.sosial}
                  onChange={(sosial) => set({ ...d, sosial })}
                  itemBaru={() => ({ label: "Instagram", href: "https://", ikon: "bx bxl-instagram" })}
                  labelTambah="Tambah media sosial"
                  renderItem={(item, ubah) => (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold small mb-1">Jenis</Form.Label>
                        <Form.Select
                          value={item.ikon}
                          onChange={(e) => {
                            const ikon = e.target.value;
                            const nama = PILIHAN_IKON.find((p) => p.nilai === ikon)?.label ?? item.label;
                            ubah({ ...item, ikon, label: nama });
                          }}
                        >
                          {PILIHAN_IKON.map((p) => (
                            <option key={p.nilai} value={p.nilai}>
                              {p.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Teks label="Link (https://...)" value={item.href} onChange={(v) => ubah({ ...item, href: v })} />
                    </>
                  )}
                />
              </>
            )}
          />
        )}

        {bagian === "pesan" && (
          <EditorBagian
            key="pesan"
            kunci="pesan"
            judul="Pesan, Harga & Rekening"
            awal={konten.pesan}
            form={(d, set) => (
              <>
                <Row>
                  <Col md={6}>
                    <Angka label="Harga per loyang (Rp)" value={d.hargaPerLoyang} onChange={(v) => set({ ...d, hargaPerLoyang: v })} />
                  </Col>
                  <Col md={6}>
                    <Angka label="Tarif ongkir per km (Rp)" value={d.tarifPerKm} onChange={(v) => set({ ...d, tarifPerKm: v })} />
                  </Col>
                </Row>
                <DaftarEditor<string>
                  judul="Pilihan varian"
                  items={d.varian}
                  minItem={1}
                  onChange={(varian) => set({ ...d, varian })}
                  itemBaru={() => ""}
                  labelTambah="Tambah varian"
                  renderItem={(item, ubah) => <Teks label="Nama varian" value={item} onChange={ubah} />}
                />
                <div className="fw-semibold small mb-2">Lokasi toko (titik awal hitung ongkir)</div>
                <Teks label="Nama lokasi" value={d.toko.nama} onChange={(v) => set({ ...d, toko: { ...d.toko, nama: v } })} />
                <Row>
                  <Col md={6}>
                    <Angka label="Latitude" step="any" value={d.toko.lat} onChange={(v) => set({ ...d, toko: { ...d.toko, lat: v } })} />
                  </Col>
                  <Col md={6}>
                    <Angka label="Longitude" step="any" value={d.toko.lng} onChange={(v) => set({ ...d, toko: { ...d.toko, lng: v } })} />
                  </Col>
                </Row>
                <div className="fw-semibold small mb-2">Rekening BCA</div>
                <Row>
                  <Col md={6}>
                    <Teks label="Nomor rekening" value={d.bca.noRek} onChange={(v) => set({ ...d, bca: { ...d.bca, noRek: v } })} />
                  </Col>
                  <Col md={6}>
                    <Teks label="Atas nama" value={d.bca.atasNama} onChange={(v) => set({ ...d, bca: { ...d.bca, atasNama: v } })} />
                  </Col>
                </Row>
                <div className="fw-semibold small mb-2">GoPay</div>
                <Row>
                  <Col md={6}>
                    <Teks label="Nomor HP" value={d.gopay.noHp} onChange={(v) => set({ ...d, gopay: { ...d.gopay, noHp: v } })} />
                  </Col>
                  <Col md={6}>
                    <Teks label="Atas nama" value={d.gopay.atasNama} onChange={(v) => set({ ...d, gopay: { ...d.gopay, atasNama: v } })} />
                  </Col>
                </Row>
              </>
            )}
          />
        )}

        {bagian === "footer" && (
          <EditorBagian
            key="footer"
            kunci="footer"
            judul="Footer"
            awal={konten.footer}
            form={(d, set) => (
              <>
                <Teks label="Judul besar" value={d.judulBesar} onChange={(v) => set({ ...d, judulBesar: v })} />
                <Teks label="Teks hak cipta" value={d.hakCipta} onChange={(v) => set({ ...d, hakCipta: v })} />
                <Teks label="Tombol kembali ke atas" value={d.tombolKembali} onChange={(v) => set({ ...d, tombolKembali: v })} />
              </>
            )}
          />
        )}
      </Col>
    </Row>
    </PerbaruiKonten.Provider>
  );
}
