/**
 * nav.js — Navigation module
 * Handles: sticky navbar, mobile burger, active link states, smooth scroll
 */

export function initNav() {
  const nav       = document.querySelector('.nav');
  const burgerBtn = document.getElementById('burger-btn');
  const navLinks  = document.getElementById('nav-links');
  const sections  = document.querySelectorAll('section[id]');
  const allLinks  = document.querySelectorAll('.nav__links a');

  // ── Sticky shrink on scroll ──
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveLink();
  }, { passive: true });

  // ── Mobile burger toggle ──
  burgerBtn?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close menu when a nav link is tapped
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // ── Smooth scroll with nav offset ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 73,
        behavior: 'smooth',
      });
    });
  });

  // ── Highlight active section link ──
  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });
    allLinks.forEach(link => {
      const isActive = link.getAttribute('href') === '#' + current;
      link.style.opacity    = isActive ? '1'   : '0.5';
      link.style.fontWeight = isActive ? '700' : '400';
    });
  }
}
