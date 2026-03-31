/* ============================================================
   AXON Physio — Shared Scripts
   ============================================================ */

(function () {
  'use strict';

  /* ── Hamburger Menu ──────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('main-nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a link is clicked (mobile)
    nav.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Active Nav Link ─────────────────────────────────────── */
  (function setActiveNav() {
    const links    = document.querySelectorAll('.nav__link');
    const pathname = window.location.pathname;

    // Extract the filename from the pathname
    const filename = pathname.split('/').pop() || 'index.html';

    links.forEach(function (link) {
      const href = link.getAttribute('href') || '';
      const linkFile = href.split('/').pop();

      // Handle root / and index.html as the same
      const isHome = (filename === '' || filename === 'index.html') &&
                     (linkFile === 'index.html' || linkFile === '');

      if (isHome || (linkFile && linkFile === filename)) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  })();

  /* ── Contact Form Submit ─────────────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Poruka poslana! ✓';
      btn.disabled = true;
      btn.style.background = '#48bb78';
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.background = '';
        contactForm.reset();
      }, 3500);
    });
  }

  /* ── Hero Slider ─────────────────────────────────────────── */
  (function initSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.hero-slide');
    const dots   = slider.querySelectorAll('.slider-dot');
    const prev   = slider.querySelector('.slider-arrow--prev');
    const next   = slider.querySelector('.slider-arrow--next');
    let current  = 0;
    let timer;

    function goTo(n) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    function autoPlay() {
      timer = setInterval(function () { goTo(current + 1); }, 5000);
    }

    function resetTimer() {
      clearInterval(timer);
      autoPlay();
    }

    prev.addEventListener('click', function () { goTo(current - 1); resetTimer(); });
    next.addEventListener('click', function () { goTo(current + 1); resetTimer(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); resetTimer(); });
    });

    // Touch / swipe
    let touchStartX = 0;
    slider.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? current + 1 : current - 1);
        resetTimer();
      }
    }, { passive: true });

    autoPlay();
  })();

  /* ── Gallery Lightbox ───────────────────────────────────── */
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length) {
    const images = Array.from(galleryItems).map(function (el) {
      return el.style.backgroundImage.slice(5, -2);
    });
    let current = 0;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox__overlay"></div>
      <button class="lightbox__close" aria-label="Zatvori">×</button>
      <button class="lightbox__prev" aria-label="Prethodna">&#8249;</button>
      <button class="lightbox__next" aria-label="Sljedeća">&#8250;</button>
      <div class="lightbox__img-wrap">
        <img class="lightbox__img" src="" alt="Galerija" />
      </div>
      <div class="lightbox__counter"></div>
    `;
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('.lightbox__img');
    const lbCounter = lightbox.querySelector('.lightbox__counter');

    function openLightbox(index) {
      current = index;
      lbImg.src = images[current];
      lbCounter.textContent = (current + 1) + ' / ' + images.length;
      lightbox.classList.add('lightbox--open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('lightbox--open');
      document.body.style.overflow = '';
    }

    function navigate(dir) {
      current = (current + dir + images.length) % images.length;
      lbImg.src = images[current];
      lbCounter.textContent = (current + 1) + ' / ' + images.length;
    }

    galleryItems.forEach(function (item, i) {
      item.addEventListener('click', function () { openLightbox(i); });
    });

    lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__overlay').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__prev').addEventListener('click', function () { navigate(-1); });
    lightbox.querySelector('.lightbox__next').addEventListener('click', function () { navigate(1); });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('lightbox--open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  /* ── Floating CTA ───────────────────────────────────────── */
  const fab = document.createElement('div');
  fab.className = 'fab-group';
  fab.innerHTML = `
    <a href="tel:+38267080890" class="fab fab--phone" aria-label="Pozovite nas" title="Pozovite nas">
      <i class="fa-solid fa-phone"></i>
    </a>
    <a href="https://wa.me/38267080890" target="_blank" rel="noopener" class="fab fab--whatsapp" aria-label="WhatsApp" title="Pišite nam na WhatsApp">
      <i class="fa-brands fa-whatsapp"></i>
    </a>
  `;
  document.body.appendChild(fab);

  /* ── FAQ Accordion ───────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('faq-item--open');
      document.querySelectorAll('.faq-item--open').forEach(function (el) {
        el.classList.remove('faq-item--open');
        el.querySelector('.faq-icon').textContent = '+';
      });
      if (!isOpen) {
        item.classList.add('faq-item--open');
        btn.querySelector('.faq-icon').textContent = '×';
      }
    });
  });

  /* ── Scroll-reveal ───────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const style = document.createElement('style');
    style.textContent = [
      '.reveal{opacity:0;transform:translateY(20px);transition:opacity .35s ease,transform .35s ease}',
      '.reveal.visible{opacity:1;transform:none}',
      '.reveal-left{opacity:0;transform:translateX(-20px);transition:opacity .35s ease,transform .35s ease}',
      '.reveal-left.visible{opacity:1;transform:none}',
      '.reveal-right{opacity:0;transform:translateX(20px);transition:opacity .35s ease,transform .35s ease}',
      '.reveal-right.visible{opacity:1;transform:none}'
    ].join('');
    document.head.appendChild(style);

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Fade up: cards, stats, titles, subtitles, contact rows, team cards
    document.querySelectorAll(
      '.card, .stat-item, .section-title, .section-subtitle, ' +
      '.contact-info-row, .team-card-v2, .testimonial-card, ' +
      '.intro-text, .intro-visual, .service-card, .spec-card'
    ).forEach(function (el) {
      el.classList.add('reveal');
      observer.observe(el);
    });

    // Stagger delay for grid children
    document.querySelectorAll(
      '.grid-3, .grid-4, .team-grid, .services-grid, .spec-grid'
    ).forEach(function (grid) {
      grid.children && Array.from(grid.children).forEach(function (child, i) {
        child.style.transitionDelay = (i * 0.1) + 's';
      });
    });
  }
})();
