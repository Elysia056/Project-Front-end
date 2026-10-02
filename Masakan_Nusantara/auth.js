// Daftar akun default untuk admin
const AKUN_DEFAULT = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    nama: 'Admin Bika Ambon'
  }
];

// Ambil semua akun: default (admin) + hasil sign up user
function ambilSemuaAkun() {
  const dariSignup = JSON.parse(localStorage.getItem('bikaAmbonUsers') || '[]');
  return AKUN_DEFAULT.concat(dariSignup);
}

// Mengambil data user yang sedang login dari localStorage
function ambilUserLogin() {
  const data = localStorage.getItem('currentUser');
  if (!data) {
    return null;
  }
  return JSON.parse(data);
}

// Mengecek apakah halaman boleh diakses sesuai role yang dibutuhkan
function cekAkses(roleDibutuhkan) {
  const user = ambilUserLogin();

  if (!user) {
    alert('Anda harus login terlebih dahulu.');
    window.location.href = 'login.html';
    return null;
  }

  if (user.role !== roleDibutuhkan) {
    alert('Anda tidak memiliki akses ke halaman ini.');
    window.location.href = 'login.html';
    return null;
  }

  return user;
}

// Logout: hapus data login lalu kembali ke halaman login
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// Render tombol auth di navbar (MASUK atau username saja, tanpa tombol Keluar)
// Dipanggil di setiap halaman yang punya elemen #navAuthArea
function renderNavAuth() {
  const navAuthArea = document.getElementById('navAuthArea');
  if (!navAuthArea) return;

  const user = ambilUserLogin();

  if (user) {
    // Sudah login → tampilkan badge username saja (klik untuk ke dashboard)
    const dashboardUrl = user.role === 'admin' ? 'admin.html' : 'user.html';

    navAuthArea.innerHTML =
      '<a href="' + dashboardUrl + '" class="nav-user-badge" title="Buka Dashboard">' +
        '<span class="nav-user-name">' + user.username + '</span>' +
      '</a>';
  } else {
    // Belum login → tampilkan tombol MASUK
    navAuthArea.innerHTML =
      '<a href="login.html" class="nav-link">MASUK</a>';
  }
}