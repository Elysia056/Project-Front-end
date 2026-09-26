document.addEventListener('DOMContentLoaded', function () {
  console.log('script.js berhasil dimuat.');

  // Mobile Navigasi
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      mainNav.classList.toggle('active');
    });
  }

  // Smooth Scrolling
  const navLinks = document.querySelectorAll('.nav-link, .btn-pesan-nav, .indicator-dot, .back-to-top');

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetHref = this.getAttribute('href');
      if (targetHref && targetHref.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetHref);
        if (targetSection) {
          const headerHeight = 70;
          const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Tutup menu mobile jika sedang terbuka
          if (mainNav && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
          }
        }
      }
    });
  });

  // Scrollspy
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const allIndicators = document.querySelectorAll('.indicator-dot');

  function updateActiveSection() {
    const scrollPos = window.scrollY + 140;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        // Update top navbar
        allNavLinks.forEach(function (nav) {
          if (nav.getAttribute('href') === '#' + sectionId) {
            nav.classList.add('active');
          } else {
            nav.classList.remove('active');
          }
        });

        // Update left hexagon indicator
        allIndicators.forEach(function (ind) {
          if (ind.getAttribute('href') === '#' + sectionId) {
            ind.classList.add('active');
          } else {
            ind.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveSection);
  updateActiveSection();

  // Interaktif Belah Rongganya
  const sliceContainer = document.getElementById('sliceContainer');
  const sliceCrust = document.getElementById('sliceCrust');
  const sliceDivider = document.getElementById('sliceDivider');
  const slicePercentText = document.getElementById('slicePercentText');
  const resetSliceBtn = document.getElementById('resetSliceBtn');

  let isDraggingSlice = false;

  function setSlicePosition(percentage) {
    const clamped = Math.max(5, Math.min(95, percentage));
    if (sliceCrust && sliceDivider) {
      sliceCrust.style.width = (100 - clamped) + '%';
      sliceDivider.style.left = clamped + '%';
    }
    if (slicePercentText) {
      slicePercentText.textContent = Math.round(clamped) + '%';
    }
  }

  function handleSliceMove(clientX) {
    if (!sliceContainer) return;
    const rect = sliceContainer.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = (offsetX / rect.width) * 100;
    setSlicePosition(percentage);
  }

  if (sliceContainer) {
    // Mouse events
    sliceContainer.addEventListener('mousedown', function (e) {
      isDraggingSlice = true;
      handleSliceMove(e.clientX);
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDraggingSlice) return;
      handleSliceMove(e.clientX);
    });

    window.addEventListener('mouseup', function () {
      if (isDraggingSlice) isDraggingSlice = false;
    });

    // Touch events untuk ponsel / tablet
    sliceContainer.addEventListener('touchstart', function (e) {
      isDraggingSlice = true;
      if (e.touches.length > 0) {
        handleSliceMove(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
      if (!isDraggingSlice) return;
      if (e.touches.length > 0) {
        handleSliceMove(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', function () {
      if (isDraggingSlice) isDraggingSlice = false;
    });
  }

  if (resetSliceBtn) {
    resetSliceBtn.addEventListener('click', function () {
      setSlicePosition(40);
    });
  }

  // Cerita Tambahan
  const historyToggleBtn = document.getElementById('historyToggleBtn');
  const historyBox = document.getElementById('historyBox');

  if (historyToggleBtn && historyBox) {
    historyToggleBtn.addEventListener('click', function () {
      const isShown = historyBox.classList.contains('show');
      if (isShown) {
        historyBox.classList.remove('show');
        historyToggleBtn.innerHTML = 'Baca asal-usul Jalan Ambon &rarr;';
      } else {
        historyBox.classList.add('show');
        historyToggleBtn.innerHTML = 'Tutup catatan sejarah &uarr;';
      }
    });
  }

  // Galeri Modal Preview
  const galleryCards = document.querySelectorAll('.gallery-card');
  const galleryModal = document.getElementById('galleryModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalCode = document.getElementById('modalCode');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');

  galleryCards.forEach(function (card) {
    card.addEventListener('click', function () {
      const code = this.getAttribute('data-code');
      const title = this.getAttribute('data-title');
      const desc = this.getAttribute('data-desc');
      const imgSrc = this.getAttribute('data-img');

      if (modalCode) modalCode.textContent = code;
      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalImg && imgSrc) {
        modalImg.src = imgSrc;
        modalImg.alt = title;
      }

      if (galleryModal) {
        galleryModal.classList.add('show');
      }
    });
  });

  if (modalCloseBtn && galleryModal) {
    modalCloseBtn.addEventListener('click', function () {
      galleryModal.classList.remove('show');
    });

    galleryModal.addEventListener('click', function (e) {
      if (e.target === galleryModal) {
        galleryModal.classList.remove('show');
      }
    });
  }

  // Form Pesanan & Stepper Jumlah
  const btnMinus = document.getElementById('btnMinus');
  const btnPlus = document.getElementById('btnPlus');
  const stepperVal = document.getElementById('stepperVal');
  const hiddenJumlah = document.getElementById('hiddenJumlah');
  let currentQuantity = 1;

  if (btnMinus && btnPlus && stepperVal) {
    btnMinus.addEventListener('click', function () {
      if (currentQuantity > 1) {
        currentQuantity--;
        stepperVal.textContent = currentQuantity;
        if (hiddenJumlah) hiddenJumlah.value = currentQuantity;
      }
    });

    btnPlus.addEventListener('click', function () {
      currentQuantity++;
      stepperVal.textContent = currentQuantity;
      if (hiddenJumlah) hiddenJumlah.value = currentQuantity;
    });
  }

  const orderForm = document.getElementById('orderForm');
  const ticketConfirmation = document.getElementById('ticketConfirmation');
  const recNama = document.getElementById('recNama');
  const recEmail = document.getElementById('recEmail');
  const recVarian = document.getElementById('recVarian');
  const recJumlah = document.getElementById('recJumlah');
  const recCatatan = document.getElementById('recCatatan');
  const recTicketId = document.getElementById('recTicketId');
  const btnResetOrder = document.getElementById('btnResetOrder');

  if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Mencegah reload form bawaan browser

      const nama = document.getElementById('nama').value.trim();
      const email = document.getElementById('email').value.trim();
      const varian = document.getElementById('varian').value;
      const catatan = document.getElementById('catatan').value.trim();

      if (!nama || !email) {
        alert('Mohon isi nama dan email dengan benar.');
        return;
      }

      const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
      const ticketCode = 'BA-2026-' + randomTicketNum;

      // Simpan pesanan ke localStorage supaya bisa dilihat di Dashboard Admin & User
      const pesananBaru = {
        id: '#' + ticketCode,
        nama: nama,
        email: email,
        varian: varian,
        jumlah: currentQuantity,
        catatan: catatan,
        tanggal: new Date().toLocaleString('id-ID'),
        status: 'Diproses'
      };

      const pesananLama = localStorage.getItem('bikaAmbonOrders');
      const daftarPesanan = pesananLama ? JSON.parse(pesananLama) : [];
      daftarPesanan.push(pesananBaru);
      localStorage.setItem('bikaAmbonOrders', JSON.stringify(daftarPesanan));

      if (recNama) recNama.textContent = nama;
      if (recEmail) recEmail.textContent = email;
      if (recVarian) recVarian.textContent = varian;
      if (recJumlah) recJumlah.textContent = currentQuantity + ' Loyang';
      if (recCatatan) recCatatan.textContent = catatan ? catatan : '-';
      if (recTicketId) recTicketId.textContent = '#' + ticketCode;

      orderForm.style.display = 'none';
      if (ticketConfirmation) {
        ticketConfirmation.classList.add('show');
      }
    });
  }

  if (btnResetOrder && orderForm && ticketConfirmation) {
    btnResetOrder.addEventListener('click', function () {
      orderForm.reset();
      currentQuantity = 1;
      if (stepperVal) stepperVal.textContent = 1;
      orderForm.style.display = 'block';
      ticketConfirmation.classList.remove('show');
    });
  }
});
