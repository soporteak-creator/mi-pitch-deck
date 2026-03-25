/* ============================================================
   VERISMART – brands/verismart/js/main.js
   All GSAP + ScrollTrigger animations, tabs, Chart.js init
   ============================================================ */

'use strict';

/* ── GSAP REGISTRATION ───────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ── HERO ENTRANCE ANIMATION ─────────────────────────────────── */
function initHeroAnimation() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Reveal grid bg
  const grid = document.querySelector('.hero__grid');
  if (grid) setTimeout(() => grid.classList.add('visible'), 300);

  tl.fromTo('.hero__badge',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6 }, 0.2)

  .fromTo('.hero__title .word',
    { opacity: 0, y: 60 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.4)

  .fromTo('.hero__sub',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.7 }, 0.9)

  .fromTo('.hero__actions',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6 }, 1.1)

  .fromTo('.hero__phone',
    { opacity: 0, x: 60, rotateY: -15 },
    { opacity: 1, x: 0, rotateY: 0, duration: 1.2, ease: 'power2.out' }, 0.5)

  .fromTo('.hero__scroll-hint',
    { opacity: 0 },
    { opacity: 1, duration: 0.5 }, 1.4);

  // Split hero title into words for animation
  const title = document.querySelector('.hero__title');
  if (title) {
    const html = title.innerHTML;
    title.innerHTML = html.replace(/([^\s<>]+)/g, (match) => {
      if (match.startsWith('<') || match.endsWith('>')) return match;
      return `<span class="word" style="display:inline-block">${match}&nbsp;</span>`;
    });
  }
}

/* ── SCROLL-TRIGGERED SECTION ANIMATIONS ────────────────────── */
function initSectionAnimations() {
  // Generic fade-up on all .fade-up elements
  gsap.utils.toArray('.fade-up').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      }
    );
  });

  // Stagger cards in grids
  gsap.utils.toArray('.stagger-group').forEach(group => {
    const items = group.querySelectorAll('.stagger-item');
    gsap.fromTo(items,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 80%',
          once: true
        }
      }
    );
  });
}

/* ── PINNED SECTION: PROBLEM SECTION ────────────────────────── */
function initProblemPin() {
  const section = document.getElementById('problem');
  if (!section) return;

  const lines = section.querySelectorAll('.problem-line');

  gsap.fromTo(lines,
    { opacity: 0, x: -60 },
    {
      opacity: 1, x: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 65%',
        once: true
      }
    }
  );
}

/* ── SEGMENT TABS (SCROLL + CLICK) ───────────────────────────── */
function initSegmentTabs() {
  const tabs   = document.querySelectorAll('.segment-tab');
  const panels = document.querySelectorAll('.segment-panel');
  if (!tabs.length) return;

  let current = 0;

  function switchTo(idx) {
    tabs[current].classList.remove('active');
    panels[current].classList.remove('active');
    current = idx;
    tabs[current].classList.add('active');
    panels[current].classList.add('active');
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => switchTo(i));
  });

  // Auto-cycle on scroll into section
  const segSection = document.getElementById('segments');
  if (!segSection) return;

  let autoTimer;

  ScrollTrigger.create({
    trigger: segSection,
    start: 'top 60%',
    end: 'bottom 40%',
    onEnter: () => {
      autoTimer = setInterval(() => {
        switchTo((current + 1) % tabs.length);
      }, 3000);
    },
    onLeave: () => clearInterval(autoTimer),
    onEnterBack: () => {
      autoTimer = setInterval(() => {
        switchTo((current + 1) % tabs.length);
      }, 3000);
    },
    onLeaveBack: () => clearInterval(autoTimer)
  });

  // Scroll-driven tab progression (pinned)
  const segWrap = document.querySelector('.segments-pin-wrap');
  if (!segWrap) return;

  ScrollTrigger.create({
    trigger: segWrap,
    pin: true,
    pinSpacing: true,
    start: 'top top',
    end: '+=200%',
    scrub: 0.5,
    onUpdate: self => {
      const idx = Math.min(
        Math.floor(self.progress * tabs.length),
        tabs.length - 1
      );
      if (idx !== current) switchTo(idx);
    }
  });
}

/* ── PINNED KPI SECTION ──────────────────────────────────────── */
function initKpiSection() {
  const section = document.getElementById('kpis');
  if (!section) return;

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=100%',
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onEnter: () => {
      gsap.fromTo('.kpi-card',
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'back.out(1.2)'
        }
      );
    }
  });
}

/* ── CHART.JS GROWTH CHART ───────────────────────────────────── */
function initGrowthChart() {
  const canvas = document.getElementById('growth-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  let chartInitialized = false;

  ScrollTrigger.create({
    trigger: canvas,
    start: 'top 75%',
    once: true,
    onEnter: () => {
      if (chartInitialized) return;
      chartInitialized = true;
      renderChart(canvas);
    }
  });
}

function renderChart(canvas) {
  fetch('../../data/verismart.json')
    .then(r => r.json())
    .then(data => {
      const { labels, downloads, polizas } = data.growthData;

      const ctx = canvas.getContext('2d');

      // Gradient fills
      const gradDownloads = ctx.createLinearGradient(0, 0, 0, 400);
      gradDownloads.addColorStop(0, 'rgba(0,85,255,0.4)');
      gradDownloads.addColorStop(1, 'rgba(0,85,255,0)');

      const gradPolizas = ctx.createLinearGradient(0, 0, 0, 400);
      gradPolizas.addColorStop(0, 'rgba(0,212,255,0.3)');
      gradPolizas.addColorStop(1, 'rgba(0,212,255,0)');

      new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Descargas acumuladas',
              data: downloads,
              borderColor: '#0066ff',
              backgroundColor: gradDownloads,
              borderWidth: 2.5,
              pointBackgroundColor: '#0066ff',
              pointRadius: 4,
              pointHoverRadius: 7,
              fill: true,
              tension: 0.45
            },
            {
              label: 'Pólizas activas',
              data: polizas,
              borderColor: '#00d4ff',
              backgroundColor: gradPolizas,
              borderWidth: 2,
              pointBackgroundColor: '#00d4ff',
              pointRadius: 4,
              pointHoverRadius: 7,
              fill: true,
              tension: 0.45
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          animation: {
            duration: 1800,
            easing: 'easeInOutQuart'
          },
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              labels: {
                color: '#7a8499',
                font: { family: 'DM Sans', size: 13 },
                usePointStyle: true,
                pointStyleWidth: 10
              }
            },
            tooltip: {
              backgroundColor: '#080c1a',
              borderColor: 'rgba(0,212,255,0.2)',
              borderWidth: 1,
              titleColor: '#eef2fa',
              bodyColor: '#7a8499',
              padding: 12,
              callbacks: {
                label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString('es-CL')}`
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#3d4557', font: { family: 'JetBrains Mono', size: 11 } }
            },
            y: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#3d4557',
                font: { family: 'JetBrains Mono', size: 11 },
                callback: val => val.toLocaleString('es-CL')
              }
            }
          }
        }
      });
    })
    .catch(() => {
      // Fallback: render with inline data
      renderChartFallback(canvas);
    });
}

function renderChartFallback(canvas) {
  const labels   = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const downloads = [1200,2400,3900,5800,7200,9100,11500,14200,17800,21300,26000,31500];
  const polizas   = [400,900,1600,2500,3200,4100,5300,6800,8500,10200,12800,15600];
  const ctx = canvas.getContext('2d');
  const g1 = ctx.createLinearGradient(0,0,0,400);
  g1.addColorStop(0,'rgba(0,85,255,0.4)'); g1.addColorStop(1,'rgba(0,85,255,0)');
  const g2 = ctx.createLinearGradient(0,0,0,400);
  g2.addColorStop(0,'rgba(0,212,255,0.3)'); g2.addColorStop(1,'rgba(0,212,255,0)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label:'Descargas acumuladas', data:downloads, borderColor:'#0066ff', backgroundColor:g1, borderWidth:2.5, fill:true, tension:0.45, pointBackgroundColor:'#0066ff', pointRadius:4 },
        { label:'Pólizas activas', data:polizas, borderColor:'#00d4ff', backgroundColor:g2, borderWidth:2, fill:true, tension:0.45, pointBackgroundColor:'#00d4ff', pointRadius:4 }
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:true,
      animation: { duration:1800, easing:'easeInOutQuart' },
      plugins: { legend: { labels: { color:'#7a8499', font:{family:'DM Sans',size:13}, usePointStyle:true } }, tooltip: { backgroundColor:'#080c1a', borderColor:'rgba(0,212,255,0.2)', borderWidth:1, titleColor:'#eef2fa', bodyColor:'#7a8499', padding:12 } },
      scales: {
        x: { grid:{color:'rgba(255,255,255,0.04)'}, ticks:{color:'#3d4557',font:{family:'JetBrains Mono',size:11}} },
        y: { grid:{color:'rgba(255,255,255,0.04)'}, ticks:{color:'#3d4557',font:{family:'JetBrains Mono',size:11},callback:v=>v.toLocaleString('es-CL')} }
      }
    }
  });
}

/* ── RAISE BARS ANIMATION ────────────────────────────────────── */
function initRaiseBars() {
  ScrollTrigger.create({
    trigger: '#raise',
    start: 'top 70%',
    once: true,
    onEnter: () => {
      document.querySelectorAll('.raise-bar__fill').forEach(fill => {
        setTimeout(() => fill.classList.add('animated'), 200);
      });
    }
  });
}

/* ── CLOSING / PINNED OUTRO ──────────────────────────────────── */
function initClosingPin() {
  const closing = document.getElementById('closing');
  if (!closing) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: closing,
      pin: true,
      pinSpacing: true,
      start: 'top top',
      end: '+=120%',
      scrub: 1
    }
  });

  tl.fromTo('.closing__logo',
    { opacity: 0, scale: 0.8, filter: 'blur(20px)' },
    { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.4 }, 0)

  .fromTo('.closing__cta',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.3 }, 0.5)

  .fromTo('.closing__contact',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.2 }, 0.75);
}

/* ── PARALLAX GLOWS ──────────────────────────────────────────── */
function initParallax() {
  gsap.to('.hero__glow--1', {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  gsap.to('.hero__glow--2', {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });
}

/* ── INIT ALL ────────────────────────────────────────────────── */
function init() {
  initHeroAnimation();
  initSectionAnimations();
  initProblemPin();
  initSegmentTabs();
  initKpiSection();
  initGrowthChart();
  initRaiseBars();
  initClosingPin();
  initParallax();

  // Dispatch ready event for core.js counters
  document.dispatchEvent(new Event('gsap-ready'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
