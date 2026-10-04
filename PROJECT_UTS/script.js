document.addEventListener('DOMContentLoaded', function () {
  console.log('script.js berhasil dimuat.');

  // Render tombol auth di navbar (MASUK atau nama user)
  renderNavAuth();

  // Auto-isi form pesan kalau user sudah login
  const userAktif = ambilUserLogin();
  if (userAktif && userAktif.role === 'user') {
    const inputNama = document.getElementById('nama');
    const inputEmail = document.getElementById('email');
    if (inputNama && !inputNama.value) inputNama.value = userAktif.nama || '';
    if (inputEmail && !inputEmail.value) inputEmail.value = userAktif.email || '';
  }

  // Mobile navigasi (tombol 3 titik)
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      mainNav.classList.toggle('active');
    });
  }

  // Smooth scroll ke section saat link nav diklik
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

          if (mainNav && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
          }
        }
      }
    });
  });

  // Scrollspy: tandai nav & indicator sesuai section yang sedang dilihat
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
        allNavLinks.forEach(function (nav) {
          if (nav.getAttribute('href') === '#' + sectionId) {
            nav.classList.add('active');
          } else {
            nav.classList.remove('active');
          }
        });

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

  // Interaktif "Belah Rongganya" (slider geser)
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

  // Tombol "Baca asal-usul Jalan Ambon"
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

  // Galeri: modal preview saat card diklik
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

  // Konfigurasi harga, tarif ongkir, dan lokasi toko
  const HARGA_PER_LOYANG = 150000;
  const TARIF_PER_KM = 3000;
  const LOKASI_TOKO = {
    nama: 'Bika Ambon Zulaikha - Jl. Mojopahit No.70 A-C, Medan',
    lat: 3.5952,
    lng: 98.6577
  };

  function formatRupiah(angka) {
    return 'Rp ' + angka.toLocaleString('id-ID');
  }

  function hitungOngkir(jarak) {
    const jarakBulat = Math.max(1, Math.ceil(jarak));
    return jarakBulat * TARIF_PER_KM;
  }

  function hitungJarakHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const btnMinus = document.getElementById('btnMinus');
  const btnPlus = document.getElementById('btnPlus');
  const stepperVal = document.getElementById('stepperVal');
  const hiddenJumlah = document.getElementById('hiddenJumlah');
  const subtotalHarga = document.getElementById('subtotalHarga');
  const jarakInput = document.getElementById('jarakAntar');
  const estimasiOngkir = document.getElementById('estimasiOngkir');
  const totalBayarBox = document.getElementById('totalBayarBox');
  const alamatInput = document.getElementById('alamat');
  const jarakStatus = document.getElementById('jarakStatus');
  let currentQuantity = 1;

  function updateSemuaHarga() {
    const subtotal = HARGA_PER_LOYANG * currentQuantity;
    const jarak = parseFloat(jarakInput ? jarakInput.value : 0) || 0;
    const ongkir = hitungOngkir(jarak);
    const total = subtotal + ongkir;

    if (subtotalHarga) {
      subtotalHarga.textContent = 'Subtotal: ' + formatRupiah(subtotal);
    }
    if (estimasiOngkir) {
      estimasiOngkir.textContent = 'Estimasi ongkir: ' + formatRupiah(ongkir);
    }
    if (totalBayarBox) {
      totalBayarBox.innerHTML =
        'Subtotal: <strong>' + formatRupiah(subtotal) + '</strong>' +
        ' + Ongkir: <strong>' + formatRupiah(ongkir) + '</strong>' +
        ' = <strong>' + formatRupiah(total) + '</strong>';
    }
  }

  if (btnMinus && btnPlus && stepperVal) {
    btnMinus.addEventListener('click', function () {
      if (currentQuantity > 1) {
        currentQuantity--;
        stepperVal.textContent = currentQuantity;
        if (hiddenJumlah) hiddenJumlah.value = currentQuantity;
        updateSemuaHarga();
      }
    });

    btnPlus.addEventListener('click', function () {
      currentQuantity++;
      stepperVal.textContent = currentQuantity;
      if (hiddenJumlah) hiddenJumlah.value = currentQuantity;
      updateSemuaHarga();
    });
  }

  updateSemuaHarga();

  let map = null;
  let markerUser = null;
  let garisRute = null;

  function initMap() {
    const mapEl = document.getElementById('mapPicker');
    if (!mapEl) return;
    if (typeof L === 'undefined') {
      console.warn('Leaflet belum termuat.');
      return;
    }

    map = L.map('mapPicker').setView([LOKASI_TOKO.lat, LOKASI_TOKO.lng], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19
    }).addTo(map);

    const iconToko = L.divIcon({
      className: 'map-marker-toko',
      html: '<div class="marker-pin marker-pin-toko">🏪</div>',
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });

    L.marker([LOKASI_TOKO.lat, LOKASI_TOKO.lng], { icon: iconToko })
      .addTo(map)
      .bindPopup('<b>Toko Bika Ambon</b><br>' + LOKASI_TOKO.nama);

    map.on('click', function (e) {
      setLokasiUser(e.latlng.lat, e.latlng.lng, null);
    });
  }

  function setLokasiUser(lat, lng, alamatManual) {
    if (!map) return;

    const iconUser = L.divIcon({
      className: 'map-marker-user',
      html: '<div class="marker-pin marker-pin-user">📍</div>',
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });

    if (markerUser) {
      markerUser.setLatLng([lat, lng]);
    } else {
      markerUser = L.marker([lat, lng], { icon: iconUser, draggable: true }).addTo(map);
      markerUser.on('dragend', function (ev) {
        const pos = ev.target.getLatLng();
        setLokasiUser(pos.lat, pos.lng, null);
      });
    }

    if (garisRute) {
      map.removeLayer(garisRute);
    }
    garisRute = L.polyline([
      [LOKASI_TOKO.lat, LOKASI_TOKO.lng],
      [lat, lng]
    ], {
      color: '#d48227',
      weight: 3,
      dashArray: '6 6'
    }).addTo(map);

    const jarak = hitungJarakHaversine(LOKASI_TOKO.lat, LOKASI_TOKO.lng, lat, lng);
    const jarakBulat = Math.round(jarak * 10) / 10;
    if (jarakInput) jarakInput.value = jarakBulat;

    if (jarakStatus) {
      jarakStatus.textContent = '✓ Jarak dari toko: ' + jarakBulat + ' km (dari peta)';
      jarakStatus.style.color = '#2e7d32';
    }

    if (!alamatManual) {
      reverseGeocode(lat, lng);
    }

    updateSemuaHarga();
  }

  function reverseGeocode(lat, lng) {
    const url = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' +
      lat + '&lon=' + lng + '&zoom=18&addressdetails=1';

    fetch(url, { headers: { 'Accept': 'application/json' } })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.display_name && alamatInput) {
          alamatInput.value = data.display_name;
        }
      })
      .catch(function () {});
  }

  function geocodeAlamat(alamat, callback) {
    const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' +
      encodeURIComponent(alamat + ', Indonesia');

    fetch(url, { headers: { 'Accept': 'application/json' } })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.length > 0) {
          callback(parseFloat(data[0].lat), parseFloat(data[0].lon), data[0].display_name);
        } else {
          callback(null, null, null);
        }
      })
      .catch(function () {
        callback(null, null, null);
      });
  }

  initMap();

  const btnCariAlamat = document.getElementById('btnCariAlamat');
  if (btnCariAlamat) {
    btnCariAlamat.addEventListener('click', function () {
      const alamat = alamatInput ? alamatInput.value.trim() : '';
      if (alamat.length < 5) {
        alert('Mohon isi alamat dulu (minimal 5 karakter).');
        return;
      }

      if (jarakStatus) {
        jarakStatus.textContent = 'Mencari lokasi dari alamat...';
        jarakStatus.style.color = 'var(--accent-amber-dark)';
      }

      geocodeAlamat(alamat, function (lat, lng, displayName) {
        if (lat !== null && lng !== null && map) {
          map.setView([lat, lng], 15);
          setLokasiUser(lat, lng, alamat);
          if (jarakStatus) {
            jarakStatus.textContent = '✓ Lokasi ditemukan: ' + displayName;
            jarakStatus.style.color = '#2e7d32';
          }
        } else {
          if (jarakStatus) {
            jarakStatus.textContent = '✗ Alamat tidak ditemukan. Coba klik peta langsung.';
            jarakStatus.style.color = '#8a2f24';
          }
        }
      });
    });
  }

  const btnLokasiSaya = document.getElementById('btnLokasiSaya');
  if (btnLokasiSaya) {
    btnLokasiSaya.addEventListener('click', function () {
      if (!navigator.geolocation) {
        alert('Browser kamu tidak mendukung geolokasi.');
        return;
      }

      if (jarakStatus) {
        jarakStatus.textContent = 'Mengambil lokasi kamu...';
        jarakStatus.style.color = 'var(--accent-amber-dark)';
      }

      navigator.geolocation.getCurrentPosition(
        function (pos) {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          if (map) {
            map.setView([lat, lng], 15);
            setLokasiUser(lat, lng, null);
          }
        },
        function () {
          if (jarakStatus) {
            jarakStatus.textContent = '✗ Gagal ambil lokasi. Izinkan akses lokasi di browser.';
            jarakStatus.style.color = '#8a2f24';
          }
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  const btnResetMap = document.getElementById('btnResetMap');
  if (btnResetMap) {
    btnResetMap.addEventListener('click', function () {
      if (!map) return;
      map.setView([LOKASI_TOKO.lat, LOKASI_TOKO.lng], 12);
      if (markerUser) {
        map.removeLayer(markerUser);
        markerUser = null;
      }
      if (garisRute) {
        map.removeLayer(garisRute);
        garisRute = null;
      }
      if (jarakInput) jarakInput.value = '';
      if (alamatInput) alamatInput.value = '';
      if (jarakStatus) {
        jarakStatus.textContent = 'Ketik alamat atau klik peta di bawah untuk pilih lokasi antar';
        jarakStatus.style.color = '';
      }
      updateSemuaHarga();
    });
  }

  // Info rekening & upload bukti transfer
  const REKENING_INFO = {
    'Transfer BCA': {
      judul: 'Transfer ke Rekening BCA',
      detail: '<strong>Bank BCA</strong><br>' +
              'No. Rek: <strong>1234567890</strong><br>' +
              'Atas Nama: <strong>Bika Ambon Kelompok 1</strong>',
      perluBukti: true
    },
    'GoPay': {
      judul: 'Transfer ke GoPay',
      detail: '<strong>GoPay / E-Wallet</strong><br>' +
              'No. HP: <strong>0812-3456-7890</strong><br>' +
              'Atas Nama: <strong>Bika Ambon Kelompok 1</strong>',
      perluBukti: true
    },
    'Cash': {
      judul: 'Bayar di Tempat (COD)',
      detail: 'Pembayaran dilakukan saat pesanan diantar ke alamat kamu.',
      perluBukti: false
    }
  };

  const metodeBayarSelect = document.getElementById('metodeBayar');
  const paymentInfoBox = document.getElementById('paymentInfoBox');
  const buktiTransferGroup = document.getElementById('buktiTransferGroup');
  const buktiTransferInput = document.getElementById('buktiTransfer');
  const buktiPreview = document.getElementById('buktiPreview');
  let buktiBase64 = null;

  const buktiModalGlobal = document.getElementById('buktiModal');
  const buktiModalCloseGlobal = document.getElementById('buktiModalClose');
  const buktiModalImg = document.getElementById('buktiModalImg');

  if (buktiModalCloseGlobal && buktiModalGlobal) {
    buktiModalCloseGlobal.addEventListener('click', function () {
      buktiModalGlobal.classList.remove('show');
    });
    buktiModalGlobal.addEventListener('click', function (ev) {
      if (ev.target === buktiModalGlobal) {
        buktiModalGlobal.classList.remove('show');
      }
    });
  }

  function updateMetodeBayar() {
    const metode = metodeBayarSelect ? metodeBayarSelect.value : '';
    const info = REKENING_INFO[metode];

    if (!info || !paymentInfoBox) {
      if (paymentInfoBox) paymentInfoBox.style.display = 'none';
      if (buktiTransferGroup) buktiTransferGroup.style.display = 'none';
      return;
    }

    paymentInfoBox.style.display = 'block';
    paymentInfoBox.innerHTML =
      '<div class="payment-info-title">' + info.judul + '</div>' +
      '<div class="payment-info-detail">' + info.detail + '</div>';

    if (info.perluBukti) {
      if (buktiTransferGroup) buktiTransferGroup.style.display = 'block';
    } else {
      if (buktiTransferGroup) buktiTransferGroup.style.display = 'none';
      buktiBase64 = null;
      if (buktiPreview) buktiPreview.innerHTML = '';
      if (buktiTransferInput) buktiTransferInput.value = '';
    }
  }

  if (metodeBayarSelect) {
    metodeBayarSelect.addEventListener('change', updateMetodeBayar);
    updateMetodeBayar();
  }

  // Upload bukti transfer → tampil tombol "Lihat Bukti"
  if (buktiTransferInput) {
    buktiTransferInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB.');
        this.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        buktiBase64 = e.target.result;
        if (buktiPreview) {
          buktiPreview.innerHTML =
            '<button type="button" class="btn-lihat-bukti-small" id="btnLihatBuktiSmall">' +
              '<i class="bx bx-show"></i> Lihat Bukti' +
            '</button>' +
            '<button type="button" class="btn-hapus-bukti-small" id="btnHapusBuktiSmall" title="Hapus bukti">' +
              '<i class="bx bx-trash"></i> Hapus' +
            '</button>';
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Delegation: klik tombol "Lihat Bukti" dan "Hapus"
  if (buktiPreview) {
    buktiPreview.addEventListener('click', function (ev) {
      const target = ev.target.closest('button');
      if (!target) return;

      if (target.id === 'btnLihatBuktiSmall') {
        if (buktiModalImg && buktiModalGlobal && buktiBase64) {
          buktiModalImg.src = buktiBase64;
          buktiModalGlobal.classList.add('show');
        }
      }

      if (target.id === 'btnHapusBuktiSmall') {
        buktiBase64 = null;
        if (buktiTransferInput) buktiTransferInput.value = '';
        buktiPreview.innerHTML = '';
      }
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
      e.preventDefault();

      const nama = document.getElementById('nama').value.trim();
      const email = document.getElementById('email').value.trim();
      const varian = document.getElementById('varian').value;
      const catatan = document.getElementById('catatan').value.trim();
      const alamat = document.getElementById('alamat').value.trim();
      const jarak = parseFloat(document.getElementById('jarakAntar').value) || 0;
      const metodeBayar = document.getElementById('metodeBayar').value;

      if (!nama || !email) {
        alert('Mohon isi nama dan email dengan benar.');
        return;
      }

      if (!alamat) {
        alert('Mohon isi alamat pengiriman atau pilih lokasi di peta.');
        return;
      }

      if (jarak <= 0) {
        alert('Jarak belum terhitung. Mohon pilih lokasi antar di peta atau klik "Cari dari Alamat".');
        return;
      }

      if (!metodeBayar) {
        alert('Mohon pilih metode pembayaran.');
        return;
      }

      const infoBayar = REKENING_INFO[metodeBayar];
      if (infoBayar && infoBayar.perluBukti && !buktiBase64) {
        alert('Mohon upload bukti transfer untuk metode ' + metodeBayar + '.');
        return;
      }

      const ongkir = hitungOngkir(jarak);
      const subtotal = HARGA_PER_LOYANG * currentQuantity;
      const totalBayar = subtotal + ongkir;

      const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
      const ticketCode = 'BA-2026-' + randomTicketNum;

      const pesananBaru = {
        id: '#' + ticketCode,
        nama: nama,
        email: email,
        varian: varian,
        jumlah: currentQuantity,
        harga: HARGA_PER_LOYANG,
        subtotal: subtotal,
        catatan: catatan,
        alamat: alamat,
        jarak: jarak,
        ongkir: ongkir,
        metodeBayar: metodeBayar,
        buktiTransfer: buktiBase64 || null,
        totalBayar: totalBayar,
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

      const recHarga = document.getElementById('recHarga');
      const recSubtotal = document.getElementById('recSubtotal');
      const recAlamat = document.getElementById('recAlamat');
      const recJarak = document.getElementById('recJarak');
      const recOngkir = document.getElementById('recOngkir');
      const recMetode = document.getElementById('recMetode');
      const recTotal = document.getElementById('recTotal');

      if (recHarga) recHarga.textContent = formatRupiah(HARGA_PER_LOYANG) + ' / loyang';
      if (recSubtotal) recSubtotal.textContent = formatRupiah(subtotal);
      if (recAlamat) recAlamat.textContent = alamat;
      if (recJarak) recJarak.textContent = jarak + ' km';
      if (recOngkir) recOngkir.textContent = formatRupiah(ongkir);
      if (recMetode) recMetode.textContent = metodeBayar;
      if (recTotal) recTotal.textContent = formatRupiah(totalBayar);

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
      if (hiddenJumlah) hiddenJumlah.value = 1;
      orderForm.style.display = 'block';
      ticketConfirmation.classList.remove('show');

      buktiBase64 = null;
      if (buktiPreview) buktiPreview.innerHTML = '';
      if (paymentInfoBox) paymentInfoBox.style.display = 'none';
      if (buktiTransferGroup) buktiTransferGroup.style.display = 'none';

      if (map) {
        map.setView([LOKASI_TOKO.lat, LOKASI_TOKO.lng], 12);
      }
      if (markerUser && map) {
        map.removeLayer(markerUser);
        markerUser = null;
      }
      if (garisRute && map) {
        map.removeLayer(garisRute);
        garisRute = null;
      }
      if (jarakStatus) {
        jarakStatus.textContent = 'Ketik alamat atau klik peta di bawah untuk pilih lokasi antar';
        jarakStatus.style.color = '';
      }
      updateSemuaHarga();
    });
  }
});