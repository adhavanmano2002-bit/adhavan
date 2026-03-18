/* ============================================
   app.js — Adhavan M Portfolio
   All JavaScript: Navbar, Typing, Animations,
   Skill Bars, Counters, Filter, Form
============================================ */

/* ── 1. NAVBAR ── */
const navbar = document.getElementById('navbar');
const topBtn = document.getElementById('topBtn');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('solid', window.scrollY > 60);
  topBtn.classList.toggle('show', window.scrollY > 400);
  highlightNav();
});

/* ── 2. ACTIVE NAV ── */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

function highlightNav() {
  let cur = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) cur = s.id;
  });
  navAs.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + cur));
}

/* ── 3. HAMBURGER ── */
const burger    = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

burger.addEventListener('click', () => {
  burger.classList.toggle('x');
  mobileNav.classList.toggle('open');
});

function closeNav() {
  burger.classList.remove('x');
  mobileNav.classList.remove('open');
}

/* ── 4. TYPING EFFECT ── */
const roles = ['Data Scientist', 'Data Analyst', 'ML Enthusiast', 'Problem Solver'];
let ri = 0, ci = 0, del = false;
const typedEl = document.getElementById('typed-text');

function typeIt() {
  const word = roles[ri];
  typedEl.textContent = del ? word.slice(0, ci--) : word.slice(0, ci++);
  let t = del ? 60 : 110;
  if (!del && ci > word.length)  { t = 1800; del = true; }
  if  (del && ci < 0)            { del = false; ri = (ri + 1) % roles.length; t = 400; }
  setTimeout(typeIt, t);
}
setTimeout(typeIt, 1500);

/* ── 5. SCROLL ANIMATIONS (IntersectionObserver) ── */
const animEls = document.querySelectorAll('.anim-up, .anim-l, .anim-r');

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('show');

      /* Skill bars inside this element */
      e.target.querySelectorAll('.sk-fill').forEach(bar => {
        if (!bar.dataset.done) {
          bar.style.width = bar.dataset.w + '%';
          bar.dataset.done = '1';
        }
      });

      /* Counters inside this element */
      e.target.querySelectorAll('.cnt[data-n]').forEach(el => {
        if (!el.dataset.done) {
          el.dataset.done = '1';
          countUp(el);
        }
      });
    }
  });
}, { threshold: 0.15 });

animEls.forEach(el => io.observe(el));

/* Also watch skills section directly for bars */
const skillsSec = document.getElementById('skills');
if (skillsSec) {
  const sio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.sk-fill').forEach(bar => {
          if (!bar.dataset.done) {
            bar.style.width = bar.dataset.w + '%';
            bar.dataset.done = '1';
          }
        });
      }
    });
  }, { threshold: 0.1 });
  sio.observe(skillsSec);
}

/* ── 6. COUNTER ANIMATION ── */
function countUp(el) {
  const target = +el.dataset.n;
  let n = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const t = setInterval(() => {
    n += step;
    if (n >= target) { n = target; clearInterval(t); }
    el.textContent = n;
  }, 40);
}

/* ── 7. PROJECT FILTER ── */
const fBtns = document.querySelectorAll('.fbtn');
const cards = document.querySelectorAll('.proj-card');

fBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    fBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    cards.forEach(c => {
      const match = f === 'all' || c.dataset.cat === f;
      c.style.transition = 'opacity .3s ease, transform .3s ease';
      if (match) {
        c.classList.remove('hidden');
        setTimeout(() => { c.style.opacity = '1'; c.style.transform = 'translateY(0)'; }, 10);
      } else {
        c.style.opacity = '0';
        c.style.transform = 'translateY(10px)';
        setTimeout(() => c.classList.add('hidden'), 320);
      }
    });
  });
});

/* ── 8. CONTACT FORM (Formspree) ── */
const form   = document.getElementById('contactForm');
const formOk = document.getElementById('form-ok');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.style.opacity = '0';
        form.style.transform = 'translateY(-10px)';
        form.style.transition = '.4s ease';
        setTimeout(() => {
          form.style.display = 'none';
          formOk.style.display = 'block';
        }, 420);
      } else {
        btn.textContent = 'Error — Try Again';
        btn.style.background = '#c0392b';
        btn.disabled = false;
      }
    } catch {
      form.style.display = 'none';
      formOk.style.display = 'block';
    }
  });
}
