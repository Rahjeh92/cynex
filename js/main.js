// ==============================
// Basic interactions (menu, i18n, smooth scroll, contact form)
// ==============================

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu toggle
const toggleBtn = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');
if (toggleBtn && navLinks) {
  toggleBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      navLinks?.classList.remove('open');
    }
  });
});

// ========== i18n switching ==========
let currentLang = 'en'; // default language
const langBtn = document.getElementById('langBtn');

function applyI18n() {
  // Update all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[currentLang] && dict[currentLang][key]) {
      el.textContent = dict[currentLang][key];
    }
  });
  // RTL toggle for Arabic
  if (currentLang === 'ar') {
    document.body.classList.add('rtl');
    document.documentElement.lang = 'ar';
    langBtn.textContent = 'EN';
  } else {
    document.body.classList.remove('rtl');
    document.documentElement.lang = 'en';
    langBtn.textContent = 'عربي';
  }
}
applyI18n();

if (langBtn) {
  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    applyI18n();
  });
}

// ========== Contact Form (Formspree) ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const note = document.getElementById('formNote');
    const data = new FormData(contactForm);

    // Validate email
    const email = (data.get('email') || '').toString().trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      note.textContent = currentLang === 'ar'
        ? 'رجاءً أدخل بريد صحيح.'
        : 'Please enter a valid email.';
      return;
    }

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        contactForm.reset();
        note.textContent = currentLang === 'ar'
          ? '✅ تم الاستلام! سنتواصل معك قريباً.'
          : '✅ Got it! We will contact you shortly.';
      } else {
        note.textContent = currentLang === 'ar'
          ? '❌ حدث خطأ. جرّب لاحقاً.'
          : '❌ Something went wrong. Please try again.';
      }
    } catch (err) {
      note.textContent = currentLang === 'ar'
        ? '⚠️ تعذّر الإرسال. تفقد اتصالك.'
        : '⚠️ Failed to send. Check your connection.';
    }
  });
}
