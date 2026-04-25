'use strict';

// ── Sticky header ──────────────────────────────────────────────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile nav ─────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});

navLinks.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

// ── Active nav link on scroll ──────────────────────────────────────────────
const sections    = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link[href^="#"]');

function updateActiveNav() {
  const scrollY = window.scrollY + 100;
  let current = '';
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop) current = sec.id;
  });
  allNavLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// ── Scroll reveal ──────────────────────────────────────────────────────────
const revealSelectors = [
  '.service-card',
  '.why-item',
  '.testimonial-card',
  '.contact-card',
  '.contact-form-wrap',
  '.stat',
  '.about-content > p',
  '.section-header',
  '.about-photo-col',
  '.about-content',
];

revealSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 80}ms`;
  });
});

document.querySelectorAll('.process-step').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${i * 100}ms`;
});

const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } }),
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Terminal typewriter ────────────────────────────────────────────────────
const typedEl  = document.getElementById('typed-cmd');
const outputEl = document.getElementById('terminal-output');
if (typedEl && outputEl) {
  const sequences = [
    {
      cmd: './threat-assessment.sh --target org',
      lines: [
        { cls: 'info', text: '[*] Initialising assessment engine...' },
        { cls: 'ok',   text: '[+] Scope validated' },
        { cls: 'info', text: '[*] Running recon phase...' },
        { cls: 'warn', text: '[!] 3 exposed services detected' },
        { cls: 'warn', text: '[!] Legacy auth endpoint found' },
        { cls: 'ok',   text: '[+] Report generation complete' },
      ],
    },
    {
      cmd: 'nmap -sV --script vuln target.internal',
      lines: [
        { cls: 'info', text: '[*] Scanning 254 hosts...' },
        { cls: 'warn', text: '[!] CVE-2024-1337 detected on :8443' },
        { cls: 'warn', text: '[!] SMB signing disabled' },
        { cls: 'ok',   text: '[+] Findings exported' },
      ],
    },
    {
      cmd: 'python3 redteam.py --mode full-scope',
      lines: [
        { cls: 'info', text: '[*] Simulating adversary TTPs...' },
        { cls: 'warn', text: '[!] Phishing simulation: 18% click rate' },
        { cls: 'warn', text: '[!] Lateral movement path identified' },
        { cls: 'ok',   text: '[+] Purple team debrief ready' },
      ],
    },
  ];

  let seqIdx = 0;

  function runSequence() {
    const seq = sequences[seqIdx % sequences.length];
    seqIdx++;
    outputEl.innerHTML = '';
    typedEl.textContent = '';

    let i = 0;
    const typing = setInterval(() => {
      typedEl.textContent += seq.cmd[i++];
      if (i >= seq.cmd.length) {
        clearInterval(typing);
        let lineIdx = 0;
        const lineTimer = setInterval(() => {
          if (lineIdx >= seq.lines.length) {
            clearInterval(lineTimer);
            setTimeout(runSequence, 3000);
            return;
          }
          const { cls, text } = seq.lines[lineIdx++];
          const p = document.createElement('p');
          p.className = cls;
          p.textContent = text;
          outputEl.appendChild(p);
        }, 480);
      }
    }, 55);
  }

  setTimeout(runSequence, 800);
}

// ── Contact form ───────────────────────────────────────────────────────────
const contactForm    = document.getElementById('contact-form');
const formSuccess    = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const name    = contactForm.querySelector('#f-name').value.trim();
    const email   = contactForm.querySelector('#f-email').value.trim();
    const message = contactForm.querySelector('#f-message').value.trim();

    if (!name || !email || !message) {
      const firstEmpty = !name
        ? contactForm.querySelector('#f-name')
        : !email
          ? contactForm.querySelector('#f-email')
          : contactForm.querySelector('#f-message');
      firstEmpty.focus();
      firstEmpty.style.borderColor = '#f87171';
      setTimeout(() => { firstEmpty.style.borderColor = ''; }, 2000);
      return;
    }

    const company = contactForm.querySelector('#f-company').value.trim();
    const service = contactForm.querySelector('#f-service').value;

    const subject = encodeURIComponent(
      `[CN Security Enquiry] ${service || 'General Enquiry'} — ${company || name}`
    );
    const body = encodeURIComponent(
      `Name: ${name}\nCompany: ${company || 'N/A'}\nEmail: ${email}\nService: ${service || 'Not specified'}\n\n${message}`
    );

    window.location.href = `mailto:cnsecconsultingptyltd@gmail.com?subject=${subject}&body=${body}`;

    contactForm.hidden = true;
    formSuccess.hidden = false;
  });

  contactForm.querySelectorAll('.form-input, .form-textarea').forEach(el => {
    el.addEventListener('input', () => { el.style.borderColor = ''; });
  });
}

// ── Smooth scroll for anchor links ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
