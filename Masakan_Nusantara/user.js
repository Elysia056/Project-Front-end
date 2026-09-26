// ==========================================================================
// user.js
// Logika halaman user.html: menampilkan daftar pesanan milik Pelanggan yang
// sedang login, dengan mencocokkan email akun terhadap email pada pesanan
// yang tersimpan di localStorage (diisi lewat form "Pesan" di index.html).
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {
  // Cek akses: hanya role 'user' yang boleh membuka halaman ini
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

  const data = localStorage.getItem('bikaAmbonOrders');
  const semuaPesanan = data ? JSON.parse(data) : [];

  // Metode filter() untuk mengambil pesanan milik user ini saja
  const pesananSaya = semuaPesanan.filter(function (pesanan) {
    return pesanan.email === user.email;
  });

  if (pesananSaya.length === 0) {
    if (emptyState) emptyState.classList.add('show');
  } else {
    if (emptyState) emptyState.classList.remove('show');

    pesananSaya.forEach(function (pesanan) {
      const baris = document.createElement('tr');

      baris.innerHTML =
        '<td>' + pesanan.id + '</td>' +
        '<td>' + pesanan.varian + '</td>' +
        '<td>' + pesanan.jumlah + ' Loyang</td>' +
        '<td>' + pesanan.tanggal + '</td>' +
        '<td><span class="status-badge status-' + pesanan.status.toLowerCase() + '">' + pesanan.status + '</span></td>';

      tabelBody.appendChild(baris);
    });
  }
});
