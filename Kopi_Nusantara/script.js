// Toggle menu navigasi pada tampilan mobile
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.addEventListener('click', function () {
    navbar.classList.toggle('active');
});

// Tutup menu navigasi ketika salah satu link diklik (khusus mobile)
let navLinks = document.querySelectorAll('.navbar a');

navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
        navbar.classList.remove('active');
    });
});

// Scroll-spy: menandai link navigasi sesuai section yang sedang dilihat
let sections = document.querySelectorAll('section');

window.onscroll = function () {
    let top = window.scrollY;

    sections.forEach(function (sec) {
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(function (link) {
                link.classList.remove('active');
            });
            document.querySelector('.navbar a[href="#' + id + '"]').classList.add('active');
        }
    });
};