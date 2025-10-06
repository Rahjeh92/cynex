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
        // Fallback: show immediately
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }

    // ===================================
    // ===== SERVICES: ACCORDION (one) ===
    // Title-only visible; click to slide-down description (one open at a time)
    // ===================================
    const cards = Array.from(document.querySelectorAll('.service-card'));
    const cardMap = new WeakMap(); // store title/desc per card

    function collapse(card) {
        const pair = cardMap.get(card);
        if (!pair) return;
        pair.desc.style.maxHeight = '0px';
        card.classList.remove('open');
        pair.title.setAttribute('aria-expanded', 'false');
    }

    function expand(card) {
        const pair = cardMap.get(card);
        if (!pair) return;
        // close others first
        cards.forEach(c => { if (c !== card) collapse(c); });
        // then open target
        pair.desc.style.maxHeight = pair.desc.scrollHeight + 'px';
        card.classList.add('open');
        pair.title.setAttribute('aria-expanded', 'true');
    }

    cards.forEach((card) => {
        const title = card.querySelector('.svc-title') || card.querySelector('h3');
        const desc = card.querySelector('.desc') || card.querySelector('p');
        if (!title || !desc) return;

        // init collapsed
        desc.style.maxHeight = '0px';
        desc.style.overflow = 'hidden';
        title.setAttribute('role', 'button');
        title.setAttribute('tabindex', '0');
        title.setAttribute('aria-expanded', 'false');

        const toggle = (e) => {
            e.preventDefault();
            if (card.classList.contains('open')) collapse(card);
            else expand(card);
        };

        title.addEventListener('click', toggle);
        title.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') toggle(e);
        });

        // keep height correct if content wraps on resize
        window.addEventListener('resize', () => {
            if (card.classList.contains('open')) {
                desc.style.maxHeight = desc.scrollHeight + 'px';
            }
        });

        // remember pair
        cardMap.set(card, { title, desc });
    });

    // ===================================
    // ======== SERVICE CARD TILT =========
    // Disabled when a card is open; mouse/pen only
    // ===================================
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (isFinePointer) {
        const tiltElements = document.querySelectorAll('.tilt');
        tiltElements.forEach((el) => {
            let rx = 0, ry = 0, rafId = null;

            const apply = () => {
                if (el.classList.contains('open')) {
                    el.style.transform = 'perspective(500px) scale(1) rotateX(0deg) rotateY(0deg)';
                } else {
                    el.style.transform = `perspective(500px) scale(1.03) rotateX(${rx}deg) rotateY(${ry}deg)`;
                }
                rafId = null;
            };

            const onMove = (e) => {
                if (el.classList.contains('open')) return;
                const rect = el.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
                const py = (e.clientY - rect.top) / rect.height - 0.5; // -0.5..0.5
                ry = px * 20;   // left/right tilt
                rx = -py * 20;  // up/down tilt (negative feels natural)
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
    // (scoped to .slider-container so arrows work)
    // ===================================
    document.querySelectorAll('.slider-container').forEach((container) => {
        const track = container.querySelector('.slider');      // the moving track
        const slides = Array.from(container.querySelectorAll('.slide'));
        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');

        if (!track || slides.length === 0) return;

        let index = 0;

        const show = (i) => {
            index = (i + slides.length) % slides.length;           // wrap around
            track.style.transform = `translateX(-${index * 100}%)`;
            slides.forEach((s, k) => s.setAttribute('aria-current', String(k === index)));
        };

        prevBtn?.addEventListener('click', (e) => { e.preventDefault(); show(index - 1); });
        nextBtn?.addEventListener('click', (e) => { e.preventDefault(); show(index + 1); });

        // Keyboard support inside the container
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); prevBtn?.click(); }
            if (e.key === 'ArrowRight') { e.preventDefault(); nextBtn?.click(); }
        });

        // Basic touch swipe
        let startX = 0, dx = 0, swiping = false;
        container.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; dx = 0; swiping = true; }, { passive: true });
        container.addEventListener('touchmove', (e) => { if (!swiping) return; dx = e.touches[0].clientX - startX; }, { passive: true });
        container.addEventListener('touchend', () => {
            if (!swiping) return;
            if (dx < -40) show(index + 1);
            else if (dx > 40) show(index - 1);
            swiping = false;
        });

        show(0); // init
    });

    // ===================================
    // =========== FOOTER YEAR ===========
    // ===================================
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());
});
