
$(document).ready(function () {

  console.log('script.js berhasil dimuat.');


  $('#menuToggle').on('click', function () {
    $('#mainNav').slideToggle(250);
  });


  $('.nav-link').on('click', function (e) {
    e.preventDefault();

    const targetId = $(this).attr('href');
    const $target = $(targetId);

    if ($target.length) {
      $('html, body').stop().animate({
        scrollTop: $target.offset().top - 70
      }, 700);
    }

    if ($(window).width() <= 768) {
      $('#mainNav').slideUp(250);
    }
  });


  $('#heroOrderBtn').on('click', function () {
    $('html, body').stop().animate({
      scrollTop: $('#order').offset().top - 60
    }, 700);
  });


  $('#factToggleBtn').on('click', function () {
    $('#factBox').slideToggle(300);

    const $btn = $(this);
    if ($btn.text().indexOf('Tampilkan') !== -1) {
      $btn.text('Lainya');
    } else {
      $btn.text('Tampilkan');
    }
  });

  $('#orderForm').on('submit', function (e) {
    e.preventDefault();

    const nama  = $('#name').val().trim();
    const email = $('#email').val().trim();
    const $feedback = $('#formFeedback');

    if (nama === '' || email === '') {
      $feedback.css('color', '#c0392b')
               .text(' Nama dan email wajib diisi ')
               .hide()
               .fadeIn(300);
      return;
    }


    $feedback.css('color', '#27ae60')
             .text('Terima kasih, ' + nama + '! Pesan kamu sudah terkirim.')
             .hide()
             .fadeIn(400);


    $('#orderForm')[0].reset();


    setTimeout(function () {
      $feedback.fadeOut(400);
    }, 5000);
  });


  $(window).on('scroll', function () {
    const scrollPos = $(window).scrollTop() + 120;

    $('.nav-link').each(function () {
      const sectionId = $(this).attr('href');
      const $section = $(sectionId);

      if ($section.length) {
        const top    = $section.offset().top;
        const bottom = top + $section.outerHeight();

        if (scrollPos >= top && scrollPos < bottom) {
          $('.nav-link').removeClass('active');
          $(this).addClass('active');
        }
      }
    });
  });


  $('.section').css('opacity', 0);

  function fadeInSections() {
    const windowBottom = $(window).scrollTop() + $(window).height();

    $('.section').each(function () {
      const $el   = $(this);
      const elTop = $el.offset().top;

      if (windowBottom > elTop + 80 && $el.css('opacity') == 0) {
        $el.animate({ opacity: 1 }, 600);
      }
    });
  }

  fadeInSections();
  $(window).on('scroll', fadeInSections);

  $('.gallery-item').on('mouseenter', function () {
    $(this).find('img').stop().animate({ 
      // gunakan CSS transform via jQuery css()
    }, 200);
    $(this).find('img').css('transform', 'scale(1.08)');
  }).on('mouseleave', function () {
    $(this).find('img').css('transform', 'scale(1)');
  });

});