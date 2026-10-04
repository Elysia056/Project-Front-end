document.addEventListener('DOMContentLoaded', function () {
  const admin = cekAkses('admin');
  if (!admin) {
    return;
  }

  const adminNameLabel = document.getElementById('adminNameLabel');
  if (adminNameLabel) {
    adminNameLabel.textContent = admin.nama;
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  const tabelBody = document.getElementById('tabelPesananBody');
  const emptyState = document.getElementById('emptyState');
  const statTotalPesanan = document.getElementById('statTotalPesanan');
  const statTotalLoyang = document.getElementById('statTotalLoyang');
  const statSelesai = document.getElementById('statSelesai');
  const statPendapatan = document.getElementById('statPendapatan');

  function formatRupiah(angka) {
    return 'Rp ' + angka.toLocaleString('id-ID');
  }

  function ambilPesanan() {
    const data = localStorage.getItem('bikaAmbonOrders');
    return data ? JSON.parse(data) : [];
  }

  function simpanPesanan(daftarPesanan) {
    localStorage.setItem('bikaAmbonOrders', JSON.stringify(daftarPesanan));
  }

  function tampilkanPesanan() {
    const daftarPesanan = ambilPesanan();

    tabelBody.innerHTML = '';

    if (daftarPesanan.length === 0) {
      if (emptyState) emptyState.classList.add('show');
    } else {
      if (emptyState) emptyState.classList.remove('show');
    }

    let totalLoyang = 0;
    let totalSelesai = 0;
    let totalPendapatan = 0;

    daftarPesanan.forEach(function (pesanan, index) {
      totalLoyang += pesanan.jumlah;
      if (pesanan.status === 'Selesai') {
        totalSelesai++;
      }
      if (pesanan.status !== 'Dibatalkan') {
        totalPendapatan += pesanan.totalBayar || 0;
      }

      const baris = document.createElement('tr');

      baris.innerHTML =
        '<td>' + pesanan.id + '</td>' +
        '<td>' + pesanan.nama + '</td>' +
        '<td>' + pesanan.email + '</td>' +
        '<td>' + pesanan.varian + '</td>' +
        '<td>' + pesanan.jumlah + ' Loyang</td>' +
        '<td>' + (pesanan.subtotal ? formatRupiah(pesanan.subtotal) : '-') + '</td>' +
        '<td>' + (pesanan.alamat || '-') + '</td>' +
        '<td>' + (pesanan.jarak ? pesanan.jarak + ' km' : '-') + '</td>' +
        '<td>' + (pesanan.ongkir ? formatRupiah(pesanan.ongkir) : '-') + '</td>' +
        '<td>' + (pesanan.metodeBayar || '-') + '</td>' +
        '<td>' +
          (pesanan.buktiTransfer
            ? '<button type="button" class="btn-lihat-bukti" data-bukti-index="' + index + '">Lihat Bukti</button>'
            : '-') +
        '</td>' +
        '<td><strong style="color: var(--accent-amber-dark);">' +
          (pesanan.totalBayar ? formatRupiah(pesanan.totalBayar) : '-') +
        '</strong></td>' +
        '<td>' + (pesanan.catatan ? pesanan.catatan : '-') + '</td>' +
        '<td>' + pesanan.tanggal + '</td>' +
        '<td>' +
        '<select class="status-select" data-index="' + index + '">' +
        '<option value="Diproses">Diproses</option>' +
        '<option value="Dikirim">Dikirim</option>' +
        '<option value="Selesai">Selesai</option>' +
        '<option value="Dibatalkan">Dibatalkan</option>' +
        '</select>' +
        '</td>' +
        '<td><button type="button" class="btn-hapus" data-index="' + index + '">Hapus</button></td>';

      const statusSelect = baris.querySelector('.status-select');
      if (statusSelect) {
        statusSelect.value = pesanan.status;
      }

      tabelBody.appendChild(baris);
    });

    if (statTotalPesanan) statTotalPesanan.textContent = daftarPesanan.length;
    if (statTotalLoyang) statTotalLoyang.textContent = totalLoyang;
    if (statSelesai) statSelesai.textContent = totalSelesai;
    if (statPendapatan) statPendapatan.textContent = formatRupiah(totalPendapatan);

    pasangEventBaris();
  }

  function pasangEventBaris() {
    const semuaSelectStatus = document.querySelectorAll('.status-select');
    semuaSelectStatus.forEach(function (select) {
      select.addEventListener('change', function () {
        const idx = parseInt(this.getAttribute('data-index'));
        const daftar = ambilPesanan();
        daftar[idx].status = this.value;
        simpanPesanan(daftar);
        tampilkanPesanan();
      });
    });

    const semuaTombolHapus = document.querySelectorAll('.btn-hapus');
    semuaTombolHapus.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const idx = parseInt(this.getAttribute('data-index'));
        const konfirmasi = confirm('Yakin ingin menghapus pesanan ini?');
        if (konfirmasi) {
          const daftar = ambilPesanan();
          daftar.splice(idx, 1);
          simpanPesanan(daftar);
          tampilkanPesanan();
        }
      });
    });

    const semuaTombolBukti = document.querySelectorAll('.btn-lihat-bukti');
    const buktiModal = document.getElementById('buktiModal');
    const buktiModalImg = document.getElementById('buktiModalImg');
    const buktiModalClose = document.getElementById('buktiModalClose');

    semuaTombolBukti.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const idx = parseInt(this.getAttribute('data-bukti-index'));
        const daftar = ambilPesanan();
        const pesanan = daftar[idx];
        if (pesanan && pesanan.buktiTransfer && buktiModal && buktiModalImg) {
          buktiModalImg.src = pesanan.buktiTransfer;
          buktiModal.classList.add('show');
        }
      });
    });

    if (buktiModalClose && buktiModal) {
      buktiModalClose.addEventListener('click', function () {
        buktiModal.classList.remove('show');
      });

      buktiModal.addEventListener('click', function (e) {
        if (e.target === buktiModal) {
          buktiModal.classList.remove('show');
        }
      });
    }
  }

  tampilkanPesanan();
});