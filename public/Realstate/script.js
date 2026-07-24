/* ============================================================
   DOMUS PROPIEDADES — script.js
   Preloader, navbar, menú mobile, reveals, contadores,
   parallax, tilt 3D, botones magnéticos, validación de formularios
   ============================================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // JS disponible: quitamos el fallback no-js
  document.documentElement.classList.remove('no-js');

  /* ============================================================
     PRELOADER
     ============================================================ */
  const preloader = document.getElementById('preloader');
  let introDone = false;

  function onIntroDone() {
    if (introDone) return;
    introDone = true;
    if (preloader) preloader.classList.add('is-done');
    document.body.classList.remove('is-locked');
    // Las animaciones de entrada arrancan recién ahora,
    // así no se ejecutan detrás del preloader
    initReveal();
    initCounters();
  }

  document.body.classList.add('is-locked');
  window.addEventListener('load', () => setTimeout(onIntroDone, 1400));
  // Fallback por si el evento load tarda demasiado (imágenes pesadas)
  setTimeout(onIntroDone, 4000);

  /* ============================================================
     NAVBAR — fondo sólido al hacer scroll
     ============================================================ */
  const navbar = document.getElementById('navbar');
  const toTop = document.getElementById('toTop');
  // Referencias del hero declaradas ANTES de onScroll() para evitar TDZ
  const heroBg = document.getElementById('heroBg');
  const heroContent = document.getElementById('heroContent');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('is-scrolled', y > 40);
    toTop.classList.toggle('is-visible', y > 600);
    parallaxHero(y);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ============================================================
     MENÚ MOBILE
     ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function toggleMenu(force) {
    const open = typeof force === 'boolean' ? force : !mobileMenu.classList.contains('is-open');
    mobileMenu.classList.toggle('is-open', open);
    hamburger.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('is-locked', open);
  }

  hamburger.addEventListener('click', () => toggleMenu());
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) toggleMenu(false);
  });

  /* ============================================================
     REVELADO AL HACER SCROLL (IntersectionObserver)
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal');

  function isInViewport(el) {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  function initReveal() {
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.style.transitionDelay = (el.dataset.delay || 0) + 's';
          el.classList.add('is-visible');
          obs.unobserve(el);
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

      revealEls.forEach(el => revealObserver.observe(el));

      // Red de seguridad: si IO no dispara (entornos headless, bugs de
      // navegador), lo que esté en viewport se revela igual a los 2.5s
      setTimeout(() => {
        revealEls.forEach(el => {
          if (!el.classList.contains('is-visible') && isInViewport(el)) {
            el.classList.add('is-visible');
          }
        });
      }, 2500);
    } else {
      revealEls.forEach(el => el.classList.add('is-visible'));
    }
  }

  /* ============================================================
     CONTADORES ANIMADOS
     ============================================================ */
  const counters = document.querySelectorAll('.stat__num[data-count]');

  function formatNumber(n) {
    return n.toLocaleString('es-AR');
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    let startTime = null;

    if (prefersReducedMotion) {
      el.textContent = prefix + formatNumber(target) + suffix;
      return;
    }

    function step(now) {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      // easing easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = prefix + formatNumber(Math.round(target * eased)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    if ('IntersectionObserver' in window) {
      const animated = new WeakSet();
      const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          animated.add(entry.target);
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.6 });

      counters.forEach(el => counterObserver.observe(el));

      // Red de seguridad igual que en los reveals
      setTimeout(() => {
        counters.forEach(el => {
          if (!animated.has(el) && isInViewport(el)) {
            animated.add(el);
            animateCounter(el);
          }
        });
      }, 2500);
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ============================================================
     PARALLAX EN HERO
     ============================================================ */
  function parallaxHero(y) {
    if (prefersReducedMotion || !heroBg) return;
    if (y > window.innerHeight * 1.2) return;
    if (!ticking) {
      requestAnimationFrame(() => {
        heroBg.style.transform = `translateY(${y * 0.35}px)`;
        if (heroContent) {
          heroContent.style.transform = `translateY(${y * 0.15}px)`;
          heroContent.style.opacity = String(Math.max(1 - y / (window.innerHeight * 0.85), 0));
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  /* ============================================================
     TILT 3D EN TARJETAS DE PROPIEDADES
     ============================================================ */
  if (canHover && !prefersReducedMotion) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      const MAX = 5; // grados máximos

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          `perspective(900px) rotateX(${(-relY * MAX).toFixed(2)}deg) rotateY(${(relX * MAX).toFixed(2)}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ============================================================
     BOTONES MAGNÉTICOS
     ============================================================ */
  if (canHover && !prefersReducedMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      const STRENGTH = 0.25;

      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * STRENGTH}px, ${y * STRENGTH}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ============================================================
     NAV ACTIVO SEGÚN SECCIÓN VISIBLE
     ============================================================ */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { threshold: 0.35 });

    sections.forEach(s => sectionObserver.observe(s));
  }

  /* ============================================================
     BUSCADOR (demo)
     ============================================================ */
  const searchForm = document.getElementById('searchForm');
  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(searchForm);
    const resumen = `${data.get('operacion')} · ${data.get('tipo')} · ${data.get('ubicacion')}`;
    // Demo: desplaza a la grilla de propiedades
    document.getElementById('propiedades').scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
    searchForm.querySelector('.search__btn').dataset.lastSearch = resumen;
  });

  /* ============================================================
     VALIDACIÓN — FORMULARIO DE CONTACTO
     ============================================================ */
  const contactForm = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function markError(field, hasError) {
    field.classList.toggle('has-error', hasError);
    if (hasError) {
      field.addEventListener('input', () => field.classList.remove('has-error'), { once: true });
    }
  }

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    feedback.textContent = '';
    feedback.className = 'form__feedback';

    const nombre = contactForm.nombre;
    const email = contactForm.email;
    const motivo = contactForm.motivo;
    const mensaje = contactForm.mensaje;
    let valid = true;

    if (!nombre.value.trim()) { markError(nombre, true); valid = false; }
    if (!EMAIL_RE.test(email.value.trim())) { markError(email, true); valid = false; }
    if (!motivo.value) { markError(motivo, true); valid = false; }
    if (!mensaje.value.trim()) { markError(mensaje, true); valid = false; }

    if (!valid) {
      feedback.textContent = 'Revisá los campos marcados para poder enviar tu consulta.';
      feedback.classList.add('is-error');
      return;
    }

    const btn = contactForm.querySelector('button[type="submit"]');
    const label = btn.querySelector('.btn__label');
    contactForm.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
    btn.classList.add('is-sent');
    label.textContent = 'Consulta enviada ✓';
    feedback.textContent = `Gracias, ${nombre.value.trim().split(' ')[0]}. Te vamos a estar contactando a la brevedad.`;
    feedback.classList.add('is-ok');
    contactForm.reset();

    setTimeout(() => {
      btn.classList.remove('is-sent');
      label.textContent = 'Enviar consulta';
    }, 5000);
  });

  /* ============================================================
     NEWSLETTER (demo)
     ============================================================ */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterFeedback = document.getElementById('newsletterFeedback');

  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');

    if (!EMAIL_RE.test(input.value.trim())) {
      newsletterFeedback.textContent = 'Ingresá un email válido.';
      input.classList.add('has-error');
      input.addEventListener('input', () => input.classList.remove('has-error'), { once: true });
      return;
    }

    newsletterFeedback.textContent = '¡Listo! Ya estás suscripto a nuestras novedades.';
    newsletterForm.reset();
    setTimeout(() => { newsletterFeedback.textContent = ''; }, 5000);
  });

  /* ============================================================
     AÑO AUTOMÁTICO EN FOOTER
     ============================================================ */
  document.getElementById('year').textContent = new Date().getFullYear();

})();
