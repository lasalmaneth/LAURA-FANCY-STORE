/**
 * forms.js — Form handling module
 * Handles: contact form submission, newsletter signup
 */

export function initForms() {
  _initContactForm();
  _initNewsletterForm();
}

function _initContactForm() {
  const form    = document.getElementById('contact-form');
  const btn     = document.getElementById('submit-btn');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    btn.textContent = 'Sending...';
    btn.disabled    = true;

    // Simulate async send — replace with real fetch() call as needed
    setTimeout(() => {
      form.reset();
      btn.textContent = 'Send Message';
      btn.disabled    = false;
      success.style.display = 'block';
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    }, 1200);
  });
}

function _initNewsletterForm() {
  const form    = document.getElementById('newsletter-form');
  const btn     = document.getElementById('newsletter-btn');
  const success = document.getElementById('newsletter-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    btn.textContent = 'Subscribing...';
    btn.disabled    = true;

    // Simulate async send — replace with real fetch() call as needed
    setTimeout(() => {
      form.reset();
      btn.textContent = 'Subscribe';
      btn.disabled    = false;
      success.style.display = 'block';
    }, 900);
  });
}
