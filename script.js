// ── THEME TOGGLE ──
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ── NAVBAR SCROLL EFFECT ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── ACTIVE NAV LINK ON SCROLL ──
const sections = document.querySelectorAll('section[id]');
const navLinkItems = document.querySelectorAll('.nav-links a');

const observerNav = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observerNav.observe(s));

// ── REVEAL ON SCROLL ──
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// ── GALLERY FILTER TABS ──
const tabBtns = document.querySelectorAll('.tab-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    galleryItems.forEach(item => {
      if (filter === 'all' || item.getAttribute('data-cat') === filter) {
        item.classList.remove('hidden');
        item.classList.remove('visible');
        setTimeout(() => item.classList.add('visible'), 50);
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ── LIGHTBOX ──
const lightbox   = document.getElementById('lightbox');
const lbImg      = document.getElementById('lbImg');
const lbCaption  = document.getElementById('lbCaption');
const lbClose    = document.getElementById('lbClose');
const lbPrev     = document.getElementById('lbPrev');
const lbNext     = document.getElementById('lbNext');

let currentLbItems = [];
let currentLbIndex = 0;

function openLightbox(items, index) {
  currentLbItems = items;
  currentLbIndex = index;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateLightbox() {
  const item = currentLbItems[currentLbIndex];
  const img = item.querySelector('img');
  const cap = item.querySelector('.gallery-overlay span');
  lbImg.src = img ? img.src : '';
  lbCaption.textContent = cap ? cap.textContent : '';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    const visible = [...galleryItems].filter(i => !i.classList.contains('hidden'));
    const vIdx = visible.indexOf(item);
    openLightbox(visible, vIdx);
  });
});

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

lbPrev.addEventListener('click', (e) => {
  e.stopPropagation();
  currentLbIndex = (currentLbIndex - 1 + currentLbItems.length) % currentLbItems.length;
  updateLightbox();
});

lbNext.addEventListener('click', (e) => {
  e.stopPropagation();
  currentLbIndex = (currentLbIndex + 1) % currentLbItems.length;
  updateLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft')  { currentLbIndex = (currentLbIndex - 1 + currentLbItems.length) % currentLbItems.length; updateLightbox(); }
  if (e.key === 'ArrowRight') { currentLbIndex = (currentLbIndex + 1) % currentLbItems.length; updateLightbox(); }
});

// ── CONTACT FORM ──
const contactForm = document.getElementById('contactForm');
const formNote    = document.getElementById('formNote');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name  = document.getElementById('cName').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const msg   = document.getElementById('cMsg').value.trim();

  if (!name || !email || !msg) {
    formNote.style.color = '#ef4444';
    formNote.textContent = 'Please fill all fields.';
    return;
  }

  formNote.style.color = 'var(--accent3)';
  formNote.textContent = `Thanks, ${name}! Your message has been received. I'll reply soon.`;
  contactForm.reset();
  setTimeout(() => { formNote.textContent = ''; }, 5000);
});

// ── TYPING EFFECT ──
const tagline = document.querySelector('.home-tagline');
const texts   = ['BTech CSE Student', 'Aspiring Developer', 'MERN Stack Learner', 'AI Enthusiast'];
let tIdx = 0, cIdx = 0, deleting = false;

function typeEffect() {
  const current = texts[tIdx];
  if (!deleting) {
    tagline.textContent = current.substring(0, cIdx + 1);
    cIdx++;
    if (cIdx === current.length) {
      deleting = true;
      setTimeout(typeEffect, 1800);
      return;
    }
  } else {
    tagline.textContent = current.substring(0, cIdx - 1);
    cIdx--;
    if (cIdx === 0) {
      deleting = false;
      tIdx = (tIdx + 1) % texts.length;
    }
  }
  setTimeout(typeEffect, deleting ? 60 : 90);
}

setTimeout(typeEffect, 1200);
