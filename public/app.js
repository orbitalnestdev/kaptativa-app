/**
 * Kaptativa Corporate Website Interactivity (app.js)
 * Implements mobile menu, light/dark theme toggles, portfolio filtering,
 * FAQ accordions, contact form logic with WhatsApp redirect, and scroll animation triggers.
 */

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
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.classList.contains('dropdown-trigger')) {
          if (window.innerWidth <= 992) {
            e.preventDefault();
            return;
          }
          return;
        }
        mainNav.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
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

    // Dropdown toggle logic for mobile click
    const dropdownTrigger = document.querySelector('.dropdown-trigger');
    const dropdownContainer = document.querySelector('.nav-item-dropdown');

    if (dropdownTrigger && dropdownContainer) {
      dropdownTrigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          e.stopPropagation();
          const isActive = dropdownContainer.classList.toggle('active');
          dropdownContainer.classList.toggle('open');
          dropdownTrigger.setAttribute('aria-expanded', isActive);
        }
      });
    }

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

});
