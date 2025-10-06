// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // ===================================
    // ========= STICKY HEADER ===========
    // ===================================
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ===================================
    // ========= MOBILE MENU =============
    // ===================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navMenu.classList.toggle('open');
            // Toggle ARIA expanded attribute
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Close menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                 hamburger.classList.remove('open');
                 navMenu.classList.remove('open');
                 hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ===================================
    // ======== HERO GLOW EFFECT =========
    // ===================================
    const hero = document.getElementById('hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { offsetWidth, offsetHeight } = hero;
            const x = (clientX / offsetWidth) * 100;
            const y = (clientY / offsetHeight) * 100;
            hero.style.setProperty('--mouse-x', `${x}%`);
            hero.style.setProperty('--mouse-y', `${y}%`);
        });
    }

    // ===================================
    // ======== SCROLL REVEAL ============
    // ===================================
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ===================================
    // ======== SERVICE CARD TILT ========
    // ===================================
    const tiltElements = document.querySelectorAll('.tilt');
    tiltElements.forEach(el => {
        const height = el.clientHeight;
        const width = el.clientWidth;

        el.addEventListener('mousemove', (e) => {
            const { layerX, layerY } = e;
            const yRotation = ((layerX - width / 2) / width) * 20;
            const xRotation = -((layerY - height / 2) / height) * 20;

            const string = `
                perspective(500px)
                scale(1.03)
                rotateX(${xRotation}deg)
                rotateY(${yRotation}deg)`;
            
            el.style.transform = string;
        });

        el.addEventListener('mouseout', () => {
            el.style.transform = `
                perspective(500px)
                scale(1)
                rotateX(0)
                rotateY(0)`;
        });
    });

    // ===================================
    // ======== PROJECTS SLIDER ==========
    // ===================================
    const slider = document.querySelector('.slider');
    if (slider) {
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');
        let currentIndex = 0;
        const totalSlides = slides.length;

        function showSlide(index) {
            // Loop back to the start or end
            if (index >= totalSlides) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = totalSlides - 1;
            } else {
                currentIndex = index;
            }
            const offset = -currentIndex * 100;
            slider.style.transform = `translateX(${offset}%)`;
        }

        nextBtn.addEventListener('click', () => {
            showSlide(currentIndex + 1);
        });

        prevBtn.addEventListener('click', () => {
            showSlide(currentIndex - 1);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
           if(e.target.closest('.slider-container')) {
               if (e.key === 'ArrowLeft') {
                   prevBtn.click();
               } else if (e.key === 'ArrowRight') {
                   nextBtn.click();
               }
           }
        });
    }

    // ===================================
    // ======== FOOTER YEAR ==============
    // ===================================
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
