document.addEventListener('DOMContentLoaded', function () {
  // Jika sudah login sebelumnya, langsung arahkan ke dashboard masing-masing
  const userSudahLogin = ambilUserLogin();
  if (userSudahLogin) {
    if (userSudahLogin.role === 'admin') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'user.html';
    }
    return;
  }

  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const passwordInput = document.getElementById('password');

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Mencegah reload halaman bawaan form

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      let akunDitemukan = null;

      // Mencari akun yang cocok menggunakan perulangan for
      for (let i = 0; i < AKUN_TERDAFTAR.length; i++) {
        if (AKUN_TERDAFTAR[i].username === username && AKUN_TERDAFTAR[i].password === password) {
          akunDitemukan = AKUN_TERDAFTAR[i];
          break;
        }
      }

      if (akunDitemukan) {
        // Simpan status login ke localStorage
        localStorage.setItem('currentUser', JSON.stringify(akunDitemukan));

        if (loginError) {
          loginError.classList.remove('show');
        }

        if (akunDitemukan.role === 'admin') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'user.html';
        }
      } else {
        if (loginError) {
          loginError.textContent = 'Username atau password salah. Silakan coba lagi.';
          loginError.classList.add('show');
        }
      }
    });
  }

  // Tombol kecil untuk menampilkan / menyembunyikan password
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', function () {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePasswordBtn.textContent = 'Sembunyikan';
      } else {
        passwordInput.type = 'password';
        togglePasswordBtn.textContent = 'Tampilkan';
      }
    });
  }
});
