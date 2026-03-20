/* =====================================================
   CANVAS MESH
===================================================== */
(function () {
  const c = document.getElementById('meshCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H, pts;

  function resize() {
    W = c.width  = c.offsetWidth;
    H = c.height = c.offsetHeight;
    pts = Array.from({ length: Math.max(24, Math.floor(W * H / 12000)) }, () => ({
      x: Math.random() * W,  y: Math.random() * H,
      vx: (Math.random() - .5) * .3,  vy: (Math.random() - .5) * .3,
      r: Math.random() * 1.4 + .6
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 150) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(9,150,136,${(1 - d / 150) * .18})`;
          ctx.lineWidth   = .7;
          ctx.stroke();
        }
      }
    }
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(13,184,166,.48)';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* =====================================================
   CUSTOM CURSOR
===================================================== */
const cdot  = document.getElementById('cdot');
const cring = document.getElementById('cring');

if (window.matchMedia('(hover:hover)').matches) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cdot.style.left = mx + 'px';
    cdot.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * .1;
    ry += (my - ry) * .1;
    cring.style.left = rx + 'px';
    cring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .sv, .pj, .ast, .tc, .ctx-item, .pillar, .prop-mv-card').forEach(el => {
    el.addEventListener('mouseenter', () => cring.classList.add('h'));
    el.addEventListener('mouseleave', () => cring.classList.remove('h'));
  });
}

/* =====================================================
   SCROLL PROGRESS BAR
===================================================== */
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - innerHeight) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* =====================================================
   NAVBAR — scrolled style + active link
===================================================== */
const navbar      = document.getElementById('navbar');
const navSections = ['inicio', 'propuesta', 'nosotros', 'servicios', 'proyectos', 'contacto'];

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', scrollY > 50);
  let current = 'inicio';
  navSections.forEach(id => {
    const el = document.getElementById(id);
    if (el && scrollY >= el.offsetTop - 140) current = id;
  });
  document.querySelectorAll('.nav-links a').forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + current)
  );
}, { passive: true });

/* =====================================================
   HAMBURGER + MOBILE NAV
===================================================== */
const ham     = document.getElementById('ham');
const mobNav  = document.getElementById('mobNav');
const mobClose = document.getElementById('mobClose');
let menuOpen  = false;

function toggleMenu(open) {
  menuOpen = open;
  mobNav.classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
  const ss = ham.querySelectorAll('span');
  ss[0].style.transform = menuOpen ? 'rotate(45deg) translate(5px,5px)'   : '';
  ss[1].style.opacity   = menuOpen ? '0' : '1';
  ss[2].style.transform = menuOpen ? 'rotate(-45deg) translate(5px,-5px)'  : '';
}

ham.addEventListener('click',      () => toggleMenu(!menuOpen));
mobClose.addEventListener('click', () => toggleMenu(false));
document.querySelectorAll('.mob-nav a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

/* =====================================================
   SCROLL REVEAL
===================================================== */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
  });
}, { threshold: .08 });

document.querySelectorAll('.sr, .sr-l, .sr-r, .sr-sc').forEach(el => revealObs.observe(el));

/* =====================================================
   COUNTER ANIMATION
===================================================== */
function animCount(el, to, dur = 1100) {
  let start;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    el.textContent = Math.floor(p * to);
    if (p < 1) requestAnimationFrame(step); else el.textContent = to;
  };
  requestAnimationFrame(step);
}

const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-count]').forEach(el => animCount(el, +el.dataset.count));
      e.target.querySelectorAll('.cnt').forEach(el => animCount(el, +el.dataset.to, 1400));
      countObs.unobserve(e.target);
    }
  });
}, { threshold: .5 });

document.querySelectorAll('.hero-stats, .about-stats').forEach(el => countObs.observe(el));

/* =====================================================
   SERVICES HOVER COUNTER
===================================================== */
const svRows = document.querySelectorAll('.sv');
const svcCtr = document.getElementById('svc-counter');

svRows.forEach(row => {
  row.addEventListener('mouseenter', () => {
    svRows.forEach(r => r.classList.remove('active'));
    row.classList.add('active');
    if (svcCtr) svcCtr.innerHTML = `<span class="acc">${row.dataset.n}</span>/6`;
  });
});

/* =====================================================
   PROJECT TABS
===================================================== */
function switchTab(proj, tab, btn, activeClass) {
  const ac = activeClass || 'on';
  document.querySelectorAll(`#pj-${proj} .pj-panel`).forEach(p => p.classList.remove('vis'));
  document.querySelectorAll(`#pj-${proj} .pj-tab`).forEach(b => b.classList.remove('on', 'on-g'));
  document.getElementById(`${proj}-${tab}`).classList.add('vis');
  btn.classList.add(ac);
}

/* =====================================================
   MODALS
===================================================== */
function openModal(id) {
  const m = document.getElementById('modal-' + id);
  if (m) { m.classList.add('on'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
  const m = document.getElementById('modal-' + id);
  if (m) { m.classList.remove('on'); document.body.style.overflow = ''; }
}

document.querySelectorAll('.modal-bg').forEach(m =>
  m.addEventListener('click', e => {
    if (e.target === m) { m.classList.remove('on'); document.body.style.overflow = ''; }
  })
);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape')
    document.querySelectorAll('.modal-bg.on').forEach(m => { m.classList.remove('on'); document.body.style.overflow = ''; });
});

/* =====================================================
   SMOOTH SCROLL
===================================================== */
function goTo(sel) {
  const el = document.querySelector(sel);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelectorAll('a[href^="#"]').forEach(a =>
  a.addEventListener('click', e => { e.preventDefault(); goTo(a.getAttribute('href')); })
);

/* =====================================================
   CONTACT FORM → mailto
===================================================== */
document.getElementById('cform').addEventListener('submit', function (e) {
  e.preventDefault();
  const d    = new FormData(this);
  const subj = encodeURIComponent(`Nuevo contacto de ${d.get('nombre')} — ${d.get('proyecto') || 'No especificado'}`);
  const body = encodeURIComponent(
    `Nombre: ${d.get('nombre')}\nEmpresa: ${d.get('empresa') || 'No especificada'}\nEmail: ${d.get('email')}\nProyecto: ${d.get('proyecto') || 'No especificado'}\n\nMensaje:\n${d.get('mensaje')}\n\n---\nEnviado desde policodelabs.com`
  );
  window.location.href = `mailto:policodelabs@gmail.com?subject=${subj}&body=${body}`;
  const btn = this.querySelector('.btn-send');
  const orig = btn.innerHTML;
  btn.innerHTML = '✓ &nbsp;¡Redirigiendo a tu correo!';
  btn.style.background = 'linear-gradient(135deg,#2d9e5f,#1a7a44)';
  setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 4000);
});

/* =====================================================
   TYPEWRITER
===================================================== */
(function () {
  const el = document.getElementById('twText');
  if (!el) return;
  const words = ['Innovadoras', 'Escalables', 'Inteligentes', 'Dinámicas', 'Ágiles'];
  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi % words.length];
    if (!deleting) {
      el.textContent = word.substring(0, ci + 1);
      ci++;
      if (ci === word.length) { deleting = true; setTimeout(tick, 1800); return; }
      setTimeout(tick, 115);
    } else {
      el.textContent = word.substring(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; wi++; setTimeout(tick, 380); return; }
      setTimeout(tick, 52);
    }
  }
  setTimeout(tick, 600);
})();
