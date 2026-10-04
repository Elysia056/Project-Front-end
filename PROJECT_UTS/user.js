document.addEventListener('DOMContentLoaded', function () {
  const user = cekAkses('user');
  if (!user) {
    return;
  }

  const userNameLabel = document.getElementById('userNameLabel');
  if (userNameLabel) {
    userNameLabel.textContent = user.nama;
  }

  const userEmailLabel = document.getElementById('userEmailLabel');
  if (userEmailLabel) {
    userEmailLabel.textContent = user.email;
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  const tabelBody = document.getElementById('tabelPesananSayaBody');
  const emptyState = document.getElementById('emptyStateUser');

  function formatRupiah(angka) {
    return 'Rp ' + angka.toLocaleString('id-ID');
  }

  const data = localStorage.getItem('bikaAmbonOrders');
  const semuaPesanan = data ? JSON.parse(data) : [];

  const pesananSaya = semuaPesanan.filter(function (pesanan) {
    return pesanan.email === user.email;
  });

  if (pesananSaya.length === 0) {
    if (emptyState) emptyState.classList.add('show');
  } else {
    if (emptyState) emptyState.classList.remove('show');

    pesananSaya.forEach(function (pesanan, index) {
      const baris = document.createElement('tr');
      baris.innerHTML =
        '<td>' + pesanan.id + '</td>' +
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
        '<td>' + pesanan.tanggal + '</td>' +
        '<td><span class="status-badge status-' + pesanan.status.toLowerCase() + '">' + pesanan.status + '</span></td>';

      tabelBody.appendChild(baris);
    });

    const semuaTombolBukti = document.querySelectorAll('.btn-lihat-bukti');
    const buktiModal = document.getElementById('buktiModal');
    const buktiModalImg = document.getElementById('buktiModalImg');
    const buktiModalClose = document.getElementById('buktiModalClose');

    semuaTombolBukti.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const idx = parseInt(this.getAttribute('data-bukti-index'));
        const pesanan = pesananSaya[idx];
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
});