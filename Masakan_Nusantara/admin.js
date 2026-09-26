// ==========================================================================
// admin.js
// Logika halaman admin.html: menampilkan seluruh pesanan yang masuk lewat
// form "Pesan" di index.html, lalu memungkinkan Admin mengubah status atau
// menghapus pesanan. Semua data pesanan disimpan di localStorage dengan
// key 'bikaAmbonOrders' (array of object), diisi oleh script.js.
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {
  // Cek akses: hanya role 'admin' yang boleh membuka halaman ini
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

  // Mengambil daftar pesanan dari localStorage
  function ambilPesanan() {
    const data = localStorage.getItem('bikaAmbonOrders');
    return data ? JSON.parse(data) : [];
  }

  // Menyimpan kembali daftar pesanan ke localStorage
  function simpanPesanan(daftarPesanan) {
    localStorage.setItem('bikaAmbonOrders', JSON.stringify(daftarPesanan));
  }

  // Menggambar ulang seluruh tabel berdasarkan data terbaru
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

    // Perulangan forEach untuk membuat baris tabel satu per satu
    daftarPesanan.forEach(function (pesanan, index) {
      totalLoyang += pesanan.jumlah;
      if (pesanan.status === 'Selesai') {
        totalSelesai++;
      }

      // Membuat elemen <tr> baru dengan createElement 
      const baris = document.createElement('tr');

      baris.innerHTML =
        '<td>' + pesanan.id + '</td>' +
        '<td>' + pesanan.nama + '</td>' +
        '<td>' + pesanan.email + '</td>' +
        '<td>' + pesanan.varian + '</td>' +
        '<td>' + pesanan.jumlah + ' Loyang</td>' +
        '<td>' + (pesanan.catatan ? pesanan.catatan : '-') + '</td>' +
        '<td>' + pesanan.tanggal + '</td>' +
        '<td>' +
          '<select class="status-select" data-index="' + index + '">' +
            '<option value="Diproses">Diproses</option>' +
            '<option value="Selesai">Selesai</option>' +
            '<option value="Dibatalkan">Dibatalkan</option>' +
          '</select>' +
        '</td>' +
        '<td><button type="button" class="btn-hapus" data-index="' + index + '">Hapus</button></td>';

      // Set pilihan select sesuai status pesanan saat ini
      const statusSelect = baris.querySelector('.status-select');
      if (statusSelect) {
        statusSelect.value = pesanan.status;
      }

      tabelBody.appendChild(baris);
    });

    if (statTotalPesanan) statTotalPesanan.textContent = daftarPesanan.length;
    if (statTotalLoyang) statTotalLoyang.textContent = totalLoyang;
    if (statSelesai) statSelesai.textContent = totalSelesai;

    pasangEventBaris();
  }

  // Memasang event listener pada tiap select status & tombol hapus
  // (dipanggil ulang tiap kali tabel digambar ulang)
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
          daftar.splice(idx, 1); // Metode splice()
          simpanPesanan(daftar);
          tampilkanPesanan();
        }
      });
    });
  }

  tampilkanPesanan();
});
