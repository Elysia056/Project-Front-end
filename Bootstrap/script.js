$(document).ready(function () {

    let selectedMenuTitle = '';

    // Scroll to Top Button Toggle
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 300) {$('#scrollTop').addClass('show');
        } else {
            $('#scrollTop').removeClass('show');
        }
    });

    $('#scrollTop').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 500);
    });

    // Event Listener Modal Detail Bootstrap
    const menuModal = document.getElementById('menuModal');
    if (menuModal) {
        menuModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            
            selectedMenuTitle = button.getAttribute('data-title');
            const desc = button.getAttribute('data-desc');
            const price = button.getAttribute('data-price');
            const img = button.getAttribute('data-img');
            const category = button.getAttribute('data-category');
            const rating = button.getAttribute('data-rating');
            const tags = button.getAttribute('data-tags') ? button.getAttribute('data-tags').split(',') : [];

            $('#modalTitle').text(selectedMenuTitle);
            $('#modalDesc').text(desc);
            $('#modalPrice').text(price);
            $('#modalImg').attr('src', img);
            $('#modalCategory').text(category);
            $('#modalRating').text(rating);

            let tagsHtml = '';
            tags.forEach(function(tag) {
                tagsHtml += `<span class="badge bg-light text-dark border rounded-pill px-2 py-1">${tag.trim()}</span> `;
            });
            $('#modalTags').html(tagsHtml);
        });
    }

    // Klik "Pesan Sekarang" dari Modal -> Tutup Modal, Scroll ke Form Kontak, Otomatis Isikan Pesanan
    $('#btnPesanModal').on('click', function() {
        const bsModal = bootstrap.Modal.getInstance(menuModal);
        if (bsModal) {
            bsModal.hide();
        }

        // Smooth scroll ke section kontak
        $('html, body').animate({
            scrollTop: $('#kontak').offset().top - 80
        }, 600, function() {
            // Masukkan nama menu ke kolom textarea dan beri fokus
            $('#pesan').val(`Halo, saya ingin memesan: ${selectedMenuTitle}`).focus();
        });
    });

});