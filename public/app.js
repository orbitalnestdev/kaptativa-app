/**
 * Kaptativa Corporate Website Interactivity (app.js)
 * Implements mobile menu, light/dark theme toggles, portfolio filtering,
 * FAQ accordions, contact form logic with WhatsApp redirect, and scroll animation triggers.
 */

// Scroll to an in-page section. Sections use `content-visibility: auto`, so their height is only
// an estimate until rendered: after each scroll we re-measure and correct (up to 4 passes).
const HEADER_OFFSET = 90;
function scrollToSection(targetEl, smooth = true, pass = 0) {
  const top = targetEl.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
  window.scrollTo({ top, behavior: smooth ? 'smooth' : 'instant' });
  if (pass >= 3) return;
  const settle = () => {
    const drift = targetEl.getBoundingClientRect().top - HEADER_OFFSET;
    if (Math.abs(drift) > 4) scrollToSection(targetEl, smooth, pass + 1);
  };
  if ('onscrollend' in window && smooth) {
    window.addEventListener('scrollend', settle, { once: true });
  } else {
    setTimeout(settle, smooth ? 900 : 250);
  }
}

// In-page buttons/links outside the main nav (e.g. "Ver módulos" -> #modulos) get the same correction
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"], a[href^="/#"]');
  if (!link || link.closest('#main-navigation')) return;
  const href = link.getAttribute('href');
  if (href.startsWith('/#') && window.location.pathname !== '/') return;
  const el = document.getElementById(decodeURIComponent(href.split('#')[1] || ''));
  if (!el) return;
  e.preventDefault();
  scrollToSection(el);
});

// Landing on /#seccion from another page: the browser's native jump has the same estimate problem
window.addEventListener('load', () => {
  if (!location.hash) return;
  const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (el) setTimeout(() => scrollToSection(el, false), 150);
});

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. MOBILE NAVIGATION MENU
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-navigation');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      mobileToggle.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking on any navigation link (except dropdown trigger)
    const drawerLinks = mainNav.querySelectorAll('a');
    drawerLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.classList.contains('dropdown-trigger')) {
          if (window.innerWidth <= 992) {
            e.preventDefault();
            return;
          }
          return;
        }

        const href = link.getAttribute('href');
        mainNav.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');

        if (href && href.includes('#')) {
          const hashIndex = href.indexOf('#');
          const hash = href.substring(hashIndex);
          const isCurrentPage = window.location.pathname === '/' || window.location.pathname === '' || href.startsWith('#') || href.startsWith('/#');

          if (isCurrentPage) {
            const targetId = hash.replace('#', '');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
              e.preventDefault();
              setTimeout(() => scrollToSection(targetEl), 80);
            }
          }
        }
      });
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
      const target = e.target;
      const isOpen = mainNav.classList.contains('open');
      if (isOpen && !mainNav.contains(target) && !mobileToggle.contains(target)) {
        mainNav.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Dropdown toggle logic for mobile click (one handler per dropdown: Soluciones, Servicios...)
    document.querySelectorAll('.nav-item-dropdown').forEach((dropdownContainer) => {
      const dropdownTrigger = dropdownContainer.querySelector('.dropdown-trigger');
      if (!dropdownTrigger) return;

      dropdownTrigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          e.stopPropagation();
          const isActive = dropdownContainer.classList.toggle('active');
          dropdownContainer.classList.toggle('open');
          dropdownTrigger.setAttribute('aria-expanded', isActive);
        }
      });
    });

    // Close mobile nav drawer when clicking on any dropdown item
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
          mainNav.classList.remove('open');
          mobileToggle.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ==========================================================================
  // 2. STICKY HEADER EFFECT ON SCROLL (IntersectionObserver Sentinel)
  // ==========================================================================
  const header = document.getElementById('header');
  const scrollSentinel = document.getElementById('scroll-sentinel');
  if (header && scrollSentinel) {
    const headerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });
    }, {
      root: null,
      threshold: 0,
      rootMargin: '0px'
    });
    headerObserver.observe(scrollSentinel);
  }

  // ==========================================================================
  // 3. THEME TOGGLER (DARK / LIGHT MODE)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';

  // Apply saved theme on load
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // ==========================================================================
  // 4. ACTIVE NAVIGATION LINK TRACKING ON SCROLL
  // ==========================================================================
  const sections = document.querySelectorAll('section, main > div');
  const activeNavObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -70% 0px', // Trigger when section occupies the sweet spot of viewport
    threshold: 0
  };

  const activeNavObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (id) {
          const matchingLink = document.querySelector(`.nav-link[href="#${id}"]`);
          if (matchingLink) {
            navLinks.forEach(link => link.classList.remove('active'));
            matchingLink.classList.add('active');
          }
        }
      }
    });
  }, activeNavObserverOptions);

  sections.forEach(section => {
    activeNavObserver.observe(section);
  });

  // ==========================================================================
  // 5. ANIMATIONS ON SCROLL (REVEAL UTILITY)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px', // Trigger slightly before element enters viewport completely
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // Animates once per page load
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ==========================================================================
  // 6. ACCORDION FOR RUBROS AND PARA-QUIEN (MOBILE <= 768px)
  // ==========================================================================
  const accordionCards = document.querySelectorAll('.rubro-card, .for-card');
  
  accordionCards.forEach(card => {
    card.addEventListener('click', function() {
      if (window.innerWidth > 768) return;

      const isActive = this.classList.contains('active');

      // Close sibling cards inside the same container
      const parentContainer = this.parentElement;
      if (parentContainer) {
        const siblings = parentContainer.querySelectorAll('.rubro-card, .for-card');
        siblings.forEach(s => s.classList.remove('active'));
      }

      if (!isActive) {
        this.classList.add('active');
      }
    });
  });


  // ==========================================================================
  // 7. DETALLES DE MOVIMIENTO (respetan prefers-reduced-motion)
  // ==========================================================================
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 7a. Contadores que cuentan al entrar en pantalla (solo valores numéricos: "100", "0%", "72hs")
  const counters = [...document.querySelectorAll('.metric-value')].filter((el) => /^\d+([.,]\d+)?\s*(%|hs)?$/.test(el.textContent.trim()));
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target; countObserver.unobserve(el);
        const raw = el.textContent.trim(); const target = parseFloat(raw.replace(',', '.')); const suffix = raw.replace(/^[\d.,\s]+/, '');
        const decimals = (raw.match(/[.,](\d+)/) || ['', ''])[1].length; const start = performance.now(); const dur = 1200;
        const tick = (now) => {
          const p = Math.min(1, (now - start) / dur); const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(decimals).replace('.', ',') + suffix;
          if (p < 1) requestAnimationFrame(tick); else el.textContent = raw;
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => countObserver.observe(el));
  }

  // 7b. Brillo que sigue el mouse en tarjetas (rubros, contadores, módulos, planes)
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.rubro-card, .h2-rubro, .metric-card-glass, .h2-tile, .h2-plan, .glass-card-premium').forEach((card) => {
      card.classList.add('spot');
      const glow = document.createElement('i'); glow.className = 'spot-glow'; card.appendChild(glow);
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--sx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        card.style.setProperty('--sy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
    });
  }

  // 7c. Línea del proceso que se dibuja al entrar en pantalla (home)
  const steps = document.querySelector('.h2-steps');
  if (steps && 'IntersectionObserver' in window) {
    const stepsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { steps.classList.add('drawn'); stepsObserver.disconnect(); } });
    }, { threshold: 0.35 });
    stepsObserver.observe(steps);
  }

});
