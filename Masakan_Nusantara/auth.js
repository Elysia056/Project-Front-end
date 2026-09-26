// Daftar akun yang terdaftar
const AKUN_TERDAFTAR = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    nama: 'Admin Bika Ambon'
  },
  {
    username: 'user',
    password: 'user123',
    role: 'user',
    nama: 'Pelanggan Setia',
    email: 'user@bikaambon.com'
  }
];

// Mengambil data user yang sedang login dari localStorage
function ambilUserLogin() {
  const data = localStorage.getItem('currentUser');
  if (!data) {
    return null;
  }
  return JSON.parse(data);
}

// Mengecek apakah halaman boleh diakses sesuai role yang dibutuhkan
// Jika tidak boleh, otomatis redirect ke login.html
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
