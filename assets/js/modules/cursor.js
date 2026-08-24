/**
 * cursor.js — Custom cursor module
 * Creates a blended dot cursor on pointer-capable devices
 */

export function initCursor() {
  // Only run on fine-pointer devices (mouse), skip touch
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot = document.createElement('div');
  dot.id = 'cursor-dot';
  Object.assign(dot.style, {
    position:        'fixed',
    width:           '6px',
    height:          '6px',
    background:      '#0a0a0a',
    borderRadius:    '50%',
    pointerEvents:   'none',
    zIndex:          '99999',
    transition:      'transform 0.12s ease',
    mixBlendMode:    'difference',
  });
  document.body.appendChild(dot);

  // Track mouse position
  document.addEventListener('mousemove', ({ clientX, clientY }) => {
    dot.style.left = (clientX - 3) + 'px';
    dot.style.top  = (clientY - 3) + 'px';
  });

  // Enlarge on interactive elements
  const interactives = 'a, button, .product-card, .collage-card, .feature-item';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => { dot.style.transform = 'scale(4)'; });
    el.addEventListener('mouseleave', () => { dot.style.transform = 'scale(1)'; });
  });
}
