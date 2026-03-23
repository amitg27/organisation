/* Organization of Choice™ — Main JS */

// --- Nav scroll ---
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
}

// --- Mobile nav ---
const hamburger = document.getElementById('nav-hamburger');
const mobileNav = document.getElementById('nav-mobile');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  // Close on link click
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// --- FAQ Accordion ---
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    // Close siblings within the same accordion
    item.closest('.accordion')?.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// --- Filter tabs ---
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    tab.closest('.filter-tabs')?.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// --- Stats counter ---
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  if (!target) return;
  const duration = 1800;
  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString() + suffix;
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stats-grid').forEach(el => statsObserver.observe(el));

// --- Smooth scroll anchors ---
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 74;
      window.scrollTo({ top: target.offsetTop - navH - 20, behavior: 'smooth' });
    }
  });
});

// --- Certificate verify ---
const verifyForm = document.getElementById('verify-form');
if (verifyForm) {
  verifyForm.addEventListener('submit', async e => {
    e.preventDefault();
    const input = document.getElementById('cert-id');
    const resultBox = document.getElementById('verify-result');
    const certId = input?.value.trim();
    if (!certId || !resultBox) return;

    resultBox.innerHTML = '<p style="color:var(--ink-muted);font-size:.875rem;padding:.5rem 0;">Checking certificate&hellip;</p>';

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificate_id: certId })
      });
      const data = await res.json();

      if (data.found) {
        resultBox.innerHTML = `
          <div class="verify-success">
            <div class="cert-badge" style="margin-bottom:.875rem;"><i class="fa-solid fa-circle-check"></i> Verified — ${data.status}</div>
            <div class="verify-success__org">${data.organization}</div>
            <p style="font-size:.875rem;color:var(--ink-soft);margin-bottom:.5rem;">${data.industry} &middot; ${data.country} &middot; Certified ${data.year}</p>
            <p style="font-size:.78rem;color:var(--ink-muted);">Certificate ID: ${certId}</p>
          </div>`;
      } else {
        resultBox.innerHTML = `
          <div class="verify-fail">
            <strong>Certificate not found.</strong> This ID was not found in our records.
            If you believe this is an error, please <a href="/contact" style="color:var(--sage);text-decoration:underline;">contact us</a>.
          </div>`;
      }
    } catch {
      resultBox.innerHTML = '<div class="verify-fail">Unable to verify at this time. Please try again.</div>';
    }
  });
}

// --- Apply form ---
const applyForm = document.getElementById('apply-form');
if (applyForm) {
  applyForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = applyForm.querySelector('[type=submit]');
    const origText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting&hellip;';
    await new Promise(r => setTimeout(r, 1000));
    applyForm.style.display = 'none';
    document.getElementById('apply-success')?.classList.add('visible');
  });
}

// --- Contact form ---
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type=submit]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending&hellip;';
    await new Promise(r => setTimeout(r, 1000));
    contactForm.style.display = 'none';
    document.getElementById('contact-success')?.classList.add('visible');
  });
}
