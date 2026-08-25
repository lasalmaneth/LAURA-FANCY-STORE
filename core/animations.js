/**
 * core/animations.js
 * Scroll-reveal observer. Called by registry after all services are mounted.
 * No dependencies on any service.
 */

const REVEAL_SELECTORS = [
  '.hero__left', '.hero__right',
  '.product-card',
  '.story__left', '.story__right',
  '.process-step',
  '.feature-item',
  '.contact__left', '.contact__right',
  '.newsletter__inner',
];

export function initAnimations() {
  _tagRevealElements();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  // Double rAF — ensures elements are painted before observation
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    )
  );

  // Stagger product cards on load
  window.addEventListener('load', () => {
    document.querySelectorAll('.product-card').forEach((card, i) => {
      setTimeout(() => card.classList.add('visible'), i * 100);
    });
  });
}

function _tagRevealElements() {
  REVEAL_SELECTORS.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      if (i === 1) el.classList.add('reveal-delay-1');
      if (i === 2) el.classList.add('reveal-delay-2');
      if (i === 3) el.classList.add('reveal-delay-3');
    });
  });
}
