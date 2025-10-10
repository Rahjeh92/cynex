// Wait for the DOM to be fully loaded before running scripts 
document.addEventListener('DOMContentLoaded', () => {

    // ===================================
    // ========== STICKY HEADER ==========
    // ===================================
    const header = document.getElementById('header');
    if (header) {
        const onScroll = () => {
            const y = window.scrollY || document.documentElement.scrollTop;
            header.classList.toggle('scrolled', y > 50);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // initialize on load
    }

    // ===================================
    // =========== MOBILE MENU ===========
    // ===================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const open = hamburger.classList.toggle('open');
            navMenu.classList.toggle('open', open);
            hamburger.setAttribute('aria-expanded', String(open));
        });

        // Close menu when any link inside nav is clicked
        navMenu.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            hamburger.classList.remove('open');
            navMenu.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    }

    // ===================================
    // ========= HERO GLOW EFFECT ========
    // ===================================
    const hero = document.getElementById('hero');
    if (hero) {
        const onMove = (e) => {
            const rect = hero.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            hero.style.setProperty('--mouse-x', `${x}%`);
            hero.style.setProperty('--mouse-y', `${y}%`);
        };
        hero.addEventListener('pointermove', onMove);
    }

    // ===================================
    // ========== SCROLL REVEAL ==========
    // ===================================
    if ('IntersectionObserver' in window) {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const revealElements = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: prefersReduced ? 0.01 : 0.15, rootMargin: '0px 0px -10% 0px' });
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }

    // ===================================
    // ===== SERVICES: FLIP CARDS ========
    // ===================================
    const cards = document.querySelectorAll('.service-card');

    cards.forEach((card) => {
        card.addEventListener('click', () => {
            const isOpen = card.classList.contains('flip'); // check if this card is already open

            // Close all cards first
            cards.forEach(c => c.classList.remove('flip'));

            // If the clicked card was closed, open it
            if (!isOpen) {
                card.classList.add('flip');
            }
        });
    });

    // ===================================
    // ======== SERVICE CARD TILT =========
    // ===================================
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (isFinePointer) {
        const tiltElements = document.querySelectorAll('.tilt');
        tiltElements.forEach((el) => {
            let rx = 0, ry = 0, rafId = null;

            const apply = () => {
                if (el.classList.contains('flip')) {
                    el.style.transform = 'perspective(500px) scale(1) rotateX(0deg) rotateY(0deg)';
                } else {
                    el.style.transform = `perspective(500px) scale(1.03) rotateX(${rx}deg) rotateY(${ry}deg)`;
                }
                rafId = null;
            };

            const onMove = (e) => {
                if (el.classList.contains('flip')) return;
                const rect = el.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width - 0.5;
                const py = (e.clientY - rect.top) / rect.height - 0.5;
                ry = px * 20;
                rx = -py * 20;
                if (!rafId) rafId = requestAnimationFrame(apply);
            };

            const reset = () => {
                rx = 0; ry = 0;
                if (!rafId) rafId = requestAnimationFrame(apply);
            };

            el.addEventListener('pointermove', onMove);
            el.addEventListener('pointerleave', reset);
        });
    }

    // ===================================
    // ========= PROJECTS SLIDER =========
    // ===================================
    document.querySelectorAll('.slider-container').forEach((container) => {
        const track = container.querySelector('.slider');
        const slides = Array.from(container.querySelectorAll('.slide'));
        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');

        if (!track || slides.length === 0) return;

        let index = 0;

        const show = (i) => {
            index = (i + slides.length) % slides.length;
            track.style.transform = `translateX(-${index * 100}%)`;
            slides.forEach((s, k) => s.setAttribute('aria-current', String(k === index)));
        };

        prevBtn?.addEventListener('click', (e) => { e.preventDefault(); show(index - 1); });
        nextBtn?.addEventListener('click', (e) => { e.preventDefault(); show(index + 1); });

        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); prevBtn?.click(); }
            if (e.key === 'ArrowRight') { e.preventDefault(); nextBtn?.click(); }
        });

        let startX = 0, dx = 0, swiping = false;
        container.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; dx = 0; swiping = true; }, { passive: true });
        container.addEventListener('touchmove', (e) => { if (!swiping) return; dx = e.touches[0].clientX - startX; }, { passive: true });
        container.addEventListener('touchend', () => {
            if (!swiping) return;
            if (dx < -40) show(index + 1);
            else if (dx > 40) show(index - 1);
            swiping = false;
        });

        show(0);
    });

    // ===================================
    // ===== CONTACT FORM (Formspree) ====
    // ===================================
    const form = document.getElementById("contactForm");
    const status = document.getElementById("form-status");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault(); // Prevent page reload

            const data = new FormData(form);

            try {
                // Send form data to Formspree
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    status.textContent = "✅ Your message has been sent successfully!";
                    status.style.color = "limegreen";
                    form.reset(); // Clear inputs after success
                } else {
                    status.textContent = "❌ Error sending your message. Please try again.";
                    status.style.color = "red";
                }
            } catch (error) {
                status.textContent = "⚠️ Network error. Please try again later.";
                status.style.color = "orange";
            }
        });
    }

    // ===================================
    // =========== FOOTER YEAR ===========
    // ===================================
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());
});
