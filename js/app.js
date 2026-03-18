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

/* ── 8. CONTACT FORM — WhatsApp + Email ── */
const form   = document.getElementById('contactForm');
const formOk = document.getElementById('form-ok');

/* Build mailto link dynamically as user types */
function buildMailto() {
  const name    = document.getElementById('f-name')?.value    || '';
  const email   = document.getElementById('f-email')?.value   || '';
  const phone   = document.getElementById('f-phone')?.value   || '';
  const subject = document.getElementById('f-subject')?.value || '';
  const msg     = document.getElementById('f-msg')?.value     || '';
  const body    = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${msg}`;
  const mailBtn = document.getElementById('mailtoBtn');
  if (mailBtn) {
    mailBtn.href = `mailto:adhavanmano2002@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
}

/* Update mailto on every input change */
['f-name','f-email','f-phone','f-subject','f-msg'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', buildMailto);
});
buildMailto();

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('f-name').value.trim();
    const email   = document.getElementById('f-email').value.trim();
    const phone   = document.getElementById('f-phone').value.trim();
    const subject = document.getElementById('f-subject').value.trim();
    const msg     = document.getElementById('f-msg').value.trim();

    if (!name || !email || !subject || !msg) {
      alert('Please fill in all required fields.');
      return;
    }

    /* Build WhatsApp message */
    const waText =
      `*New Portfolio Message!* 🎉\n\n` +
      `*Name:* ${name}\n` +
      `*Email:* ${email}\n` +
      `*Phone:* ${phone || 'Not provided'}\n` +
      `*Subject:* ${subject}\n\n` +
      `*Message:*\n${msg}`;

    /* Open WhatsApp with your number */
    const waUrl = `https://wa.me/919629383681?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');

    /* Show success */
    form.style.opacity    = '0';
    form.style.transform  = 'translateY(-10px)';
    form.style.transition = '.4s ease';
    setTimeout(() => {
      form.style.display  = 'none';
      formOk.style.display = 'block';
    }, 420);
  });
}
