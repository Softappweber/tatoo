// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const nav = document.querySelector('.nav');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!open));
    // simple approach: toggle a class by inline style
    if (!open) {
      nav.style.display = 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.right = '4vw';
      nav.style.top = '68px';
      nav.style.padding = '12px';
      nav.style.background = 'rgba(6,6,10,.75)';
      nav.style.border = '1px solid rgba(255,255,255,.14)';
      nav.style.backdropFilter = 'blur(14px)';
      nav.style.zIndex = '50';
    } else {
      nav.style.display = '';
      nav.style.removeProperty('flex-direction');
      nav.style.removeProperty('position');
      nav.style.removeProperty('right');
      nav.style.removeProperty('top');
      nav.style.removeProperty('padding');
      nav.style.removeProperty('background');
      nav.style.removeProperty('border');
      nav.style.removeProperty('backdrop-filter');
      nav.style.removeProperty('z-index');
    }
  });
}

// Theme switch
const root = document.documentElement;
const buttons = document.querySelectorAll('.mode-btn');

function setTheme(t) {
  root.setAttribute('data-theme', t);
  buttons.forEach(b => {
    const selected = b.dataset.theme === t;
    b.setAttribute('aria-selected', selected ? 'true' : 'false');
  });
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => setTheme(btn.dataset.theme));
});

// Set initial theme
setTheme('neon');

// Count up animation
function animateCount(el, target, duration = 900) {
  const start = 0;
  const startTime = performance.now();
  const isFloat = String(target).includes('.');
  function frame(now){
    const t = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = start + (target - start) * eased;
    el.textContent = isFloat ? val.toFixed(1) : Math.round(val).toString();
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const metrics = document.querySelectorAll('#metrics .num');
metrics.forEach(el => {
  const target = Number(el.dataset.count || 0);
  animateCount(el, target, 900);
});

const bigs = document.querySelectorAll('.k[data-k]');
bigs.forEach(el => {
  const target = Number(el.dataset.k);
  animateCount(el, target, 1100);
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
