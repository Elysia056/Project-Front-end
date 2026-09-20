// Seluruh interaktivitas halaman ditulis dengan jQuery.
$(document).ready(function () {

    // Toggle menu pada tampilan mobile
    $('#menu-icon').on('click', function () {
        $('.navbar').toggleClass('active');
    });

    // Menu otomatis tertutup setelah salah satu link diklik (mobile)
    $('.navbar a').on('click', function () {
        $('.navbar').removeClass('active');
    });

    // Scroll-spy & tombol kembali ke atas
    $(window).on('scroll', function () {
        let top = $(window).scrollTop();

        // Tandai link navbar sesuai section yang sedang dilihat
        $('section').each(function () {
            let offset = $(this).offset().top - 150;
            let height = $(this).outerHeight();
            let id = $(this).attr('id');

            if (top >= offset && top < offset + height) {
                $('.navbar a').removeClass('active');
                $('.navbar a[href="#' + id + '"]').addClass('active');
            }
        });

        // Tombol kembali ke atas muncul/hilang (manipulasi class) setelah
        // scroll cukup jauh; transisi halusnya ditangani oleh CSS
        if (top > 400) {
            $('#scrollTop').addClass('show');
        } else {
            $('#scrollTop').removeClass('show');
        }
    });

    // Klik tombol kembali ke atas -> scroll halus (animate) ke posisi 0
    $('#scrollTop').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 600);
    });

    // FAQ Accordion
    // Klik pertanyaan -> ambil jawaban terdekat dengan .next(), lalu slideToggle()
    $('.faq-question').on('click', function () {
        let $answer = $(this).next('.faq-answer');
        let sudahTerbuka = $(this).hasClass('active');

        // Tutup semua FAQ lain agar hanya satu jawaban yang terbuka
        $('.faq-question').not(this).removeClass('active');
        $('.faq-answer').not($answer).slideUp(300);

        // Toggle class untuk mengubah tampilan ikon +/- pada pertanyaan aktif
        $(this).toggleClass('active', !sudahTerbuka);
        $answer.slideToggle(300);
    });

});