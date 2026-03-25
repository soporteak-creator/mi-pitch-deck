/* ============================================================
   VERISMART PITCH DECK – shared/js/core.js
   Shared utilities: progress bar, animated counters,
   video autoplay on scroll, nav highlight
   ============================================================ */

'use strict';

/* ── PROGRESS BAR ────────────────────────────────────────────── */
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── ANIMATED COUNTERS (GSAP required) ───────────────────────── */
function initCounters() {
  if (typeof gsap === 'undefined') return;

  const counters = document.querySelectorAll('[data-count]');

  counters.forEach(el => {
    const target  = parseFloat(el.dataset.count);
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const prefix  = el.dataset.prefix  || '';
    const suffix  = el.dataset.suffix  || '';
    const dur     = parseFloat(el.dataset.duration || '2');

    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: dur,
          ease: 'power2.out',
          snap: { val: decimals === 0 ? 1 : 0.1 },
          onUpdate: () => {
            el.textContent = prefix + obj.val.toFixed(decimals) + suffix;
          }
        });
        el.closest('.kpi-card')?.classList.add('in-view');
      }
    });
  });
}

/* ── VIDEO AUTOPLAY ON SCROLL ────────────────────────────────── */
function initVideoAutoplay() {
  const videos = document.querySelectorAll('.phone__screen video, [data-autoplay]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const vid = entry.target;
      if (entry.isIntersecting) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, { threshold: 0.3 });

  videos.forEach(v => {
    v.muted = true;
    v.loop  = true;
    v.playsInline = true;
    observer.observe(v);
  });
}

/* ── VIDEO HOVER ON CARDS ────────────────────────────────────── */
function initCardVideoHover() {
  const cards = document.querySelectorAll('.card-video');

  cards.forEach(card => {
    const vid = card.querySelector('video');
    if (!vid) return;

    vid.muted = true;
    vid.loop  = true;
    vid.playsInline = true;

    card.addEventListener('mouseenter', () => vid.play().catch(() => {}));
    card.addEventListener('mouseleave', () => {
      vid.pause();
      vid.currentTime = 0;
    });
  });
}

/* ── NAV ACTIVE SECTION HIGHLIGHT ───────────────────────────── */
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  if (!navLinks.length || !sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => observer.observe(s));
}

/* ── SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ── INIT ALL ────────────────────────────────────────────────── */
function initCore() {
  initProgressBar();
  initVideoAutoplay();
  initCardVideoHover();
  initNavHighlight();
  initSmoothScroll();

  // Counters need GSAP/ScrollTrigger to be ready
  if (typeof ScrollTrigger !== 'undefined') {
    initCounters();
  } else {
    document.addEventListener('gsap-ready', initCounters);
  }
}

// Auto-init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCore);
} else {
  initCore();
}
