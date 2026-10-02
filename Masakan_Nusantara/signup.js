document.addEventListener('DOMContentLoaded', function () {
  const signupForm = document.getElementById('signupForm');
  const signupError = document.getElementById('signupError');
  const signupSuccess = document.getElementById('signupSuccess');
  const togglePasswordSignupBtn = document.getElementById('togglePasswordSignupBtn');
  const passwordSignup = document.getElementById('passwordSignup');

  // Toggle show/hide password
  if (togglePasswordSignupBtn && passwordSignup) {
    togglePasswordSignupBtn.addEventListener('click', function () {
      if (passwordSignup.type === 'password') {
        passwordSignup.type = 'text';
        togglePasswordSignupBtn.textContent = 'Sembunyikan';
      } else {
        passwordSignup.type = 'password';
        togglePasswordSignupBtn.textContent = 'Tampilkan';
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const namaLengkap = document.getElementById('namaLengkap').value.trim();
      const email = document.getElementById('emailSignup').value.trim();
      const username = document.getElementById('usernameSignup').value.trim();
      const password = document.getElementById('passwordSignup').value.trim();
      const passwordConfirm = document.getElementById('passwordConfirm').value.trim();

      // Reset pesan
      signupError.classList.remove('show');
      signupSuccess.classList.remove('show');

      // Validasi: password cocok
      if (password !== passwordConfirm) {
        signupError.textContent = 'Password dan konfirmasi password tidak cocok.';
        signupError.classList.add('show');
        return;
      }

      // Validasi: password minimal 6 karakter
      if (password.length < 6) {
        signupError.textContent = 'Password minimal 6 karakter.';
        signupError.classList.add('show');
        return;
      }

      // Ambil daftar user dari localStorage (user yang sudah sign up sebelumnya)
      let daftarUser = JSON.parse(localStorage.getItem('bikaAmbonUsers') || '[]');

      // Cek apakah username sudah dipakai (termasuk cek admin)
      const semuaAkun = ambilSemuaAkun();
      const usernameDipakai = semuaAkun.some(function (u) {
        return u.username.toLowerCase() === username.toLowerCase();
      });
      const emailDipakai = daftarUser.some(function (u) {
        return u.email.toLowerCase() === email.toLowerCase();
      });

      if (usernameDipakai) {
        signupError.textContent = 'Username sudah dipakai. Coba yang lain.';
        signupError.classList.add('show');
        return;
      }

      if (emailDipakai) {
        signupError.textContent = 'Email sudah terdaftar. Silakan login.';
        signupError.classList.add('show');
        return;
      }

      // Buat user baru
      const userBaru = {
        username: username,
        password: password,
        role: 'user',
        nama: namaLengkap,
        email: email
      };

      daftarUser.push(userBaru);
      localStorage.setItem('bikaAmbonUsers', JSON.stringify(daftarUser));

      // Tampilkan sukses
      signupSuccess.textContent = 'Pendaftaran berhasil! Mengalihkan ke halaman login...';
      signupSuccess.classList.add('show');
      signupForm.reset();

      // Redirect ke login setelah 1.5 detik
      setTimeout(function () {
        window.location.href = 'login.html';
      }, 1500);
    });
  }
});