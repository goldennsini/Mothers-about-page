/* script.js — all JS logic for interactions and small UI behavior
   Place in same folder and link from index.html with defer
*/

/* ================
   Utility selectors
   ================ */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

/* ================
   Mobile menu toggle
   ================ */
const btnMenu = document.getElementById('btnMenu');
const mainNav = document.querySelector('.main-nav');
btnMenu?.addEventListener('click', () => {
  const expanded = btnMenu.getAttribute('aria-expanded') === 'true';
  btnMenu.setAttribute('aria-expanded', String(!expanded));
  // toggle simple mobile menu (show/hide)
  mainNav.style.display = expanded ? 'none' : 'block';
});

/* ================
   Reveal on scroll using IntersectionObserver
   ================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

$$('.reveal, .reveal-soft').forEach(el => revealObserver.observe(el));

/* ================
   Lightbox for gallery images
   ================ */
const lightbox = $('#lightbox');
const lightboxImg = $('.lightbox-img', lightbox);
const lightboxCaption = $('.lightbox-caption', lightbox);
const lightboxClose = $('.lightbox-close', lightbox);

function openLightbox(src, alt, caption){
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightboxCaption.textContent = caption || '';
  lightbox.classList.add('show');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(){
  lightbox.classList.remove('show');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

$$('#masonryGrid img').forEach(img => {
  img.addEventListener('click', (e) => {
    openLightbox(img.dataset.full || img.src, img.alt, img.parentElement.querySelector('figcaption')?.textContent);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('show')) closeLightbox();
});

/* ================
   Contact form handling (client-side)
   This simulates submission, replace with real endpoint later
   ================ */
const form = $('#contactForm');
const status = $('#formStatus');
form?.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = $('#name').value.trim();
  const email = $('#email').value.trim();
  const message = $('#message').value.trim();

  // minimal validation
  if (!name || !email || !message) {
    status.textContent = 'Please fill all fields before sending.';
    status.style.color = 'crimson';
    return;
  }

  // simulate send
  status.textContent = 'Sending message...';
  status.style.color = 'var(--muted)';

  setTimeout(() => {
    status.textContent = 'Thank you — your message has been received. We will reply soon.';
    status.style.color = 'green';
    form.reset();
  }, 1000);
});

/* ================
   Small enhancements
   - Auto year in footer
   - Smooth scroll for internal links
   ================ */
$('#year') && ($('#year').textContent = new Date().getFullYear());
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
      // close mobile menu if open
      if (window.innerWidth < 720 && mainNav) mainNav.style.display = 'none';
    }
  });
});

/* ================
   Accessibility / Focus styles for keyboard users
   ================ */
document.addEventListener('keydown', function(e){
  if (e.key === 'Tab') document.body.classList.add('show-focus');
}, { once: true });

/* ================
   Ready: small micro-animation (pulse small ribbon)
   ================ */
const ribbon = document.querySelector('.ribbon');
if (ribbon) {
  setInterval(() => {
    ribbon.animate([{ transform: 'translateY(0)' },{ transform: 'translateY(-4px)' },{ transform: 'translateY(0)' }], {
      duration: 2500, iterations: 1, easing: 'ease-in-out'
    });
  }, 6000);
}

