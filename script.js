// ================================================================
// NEXUS_N · Modern Interactions
// ================================================================

document.addEventListener('DOMContentLoaded', function() {

    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const cursorGlow = document.getElementById('cursorGlow');

    // ============================================================
    // Page progress indicator
    // ============================================================
    const progressBar = document.createElement('div');
    progressBar.className = 'page-progress';
    progressBar.innerHTML = '<span></span>';
    document.body.appendChild(progressBar);
    const progressFill = progressBar.querySelector('span');

    // ============================================================
    // Scroll handler
    // ============================================================
    function handleScroll() {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollY / docHeight) * 100;
        progressFill.style.width = progress + '%';

        if (scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        updateActiveNavLink();
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ============================================================
    // Cursor glow
    // ============================================================
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;
        if (cursorGlow) {
            cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
        }
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // ============================================================
    // Magnetic effect on buttons
    // ============================================================
    const magneticElements = document.querySelectorAll('.btn, .cta-button, .nav-cta, .back-to-top');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', function(e) {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
        });
        el.addEventListener('mouseleave', function() {
            el.style.transform = '';
        });
    });

    // ============================================================
    // Bento card 3D tilt
    // ============================================================
    const tiltCards = document.querySelectorAll('.bento, .stat-card, .contact-card, .feature-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotateX = (y - 0.5) * -6;
            const rotateY = (x - 0.5) * 6;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });

    // ============================================================
    // Mobile menu
    // ============================================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ============================================================
    // Active nav based on scroll
    // ============================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNavLink() {
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);

            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }

    // ============================================================
    // Back to top
    // ============================================================
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================================================
    // Service tabs
    // ============================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            this.classList.add('active');
            const target = document.getElementById(tabId);
            if (target) target.classList.add('active');

            const business = document.getElementById('business');
            const tabsTop = business.offsetTop + 100;
            if (window.scrollY > tabsTop + 300) {
                window.scrollTo({ top: tabsTop, behavior: 'smooth' });
            }
        });
    });

    // ============================================================
    // Scroll reveal observer
    // ============================================================
    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.stat-card, .bento, .philosophy-card, .why-item, .feature-card, .strength-item, .process-step, .contact-card, .ais-card, .service-hero, .relationship-diagram, .job-codes, .process-section, .strengths, .company-info, .cta-banner, .stats-header, .about-hero, .why-headline-row, .business-headline, .values-header, .contact-headline'
    );

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // ============================================================
    // Counter animation
    // ============================================================
    const counters = document.querySelectorAll('.stat-number[data-count]');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                const original = el.textContent;
                const suffix = original.replace(/[0-9]/g, '');
                const duration = 2000;
                const startTime = performance.now();

                function tick(now) {
                    const progress = Math.min((now - startTime) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 4);
                    const current = Math.round(target * eased);
                    el.textContent = current + suffix;
                    if (progress < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));

    // ============================================================
    // Text split reveal for headlines
    // ============================================================
    const splitTargets = document.querySelectorAll('.about-headline, .values-title, .why-headline, .biz-title, .contact-title, .stats-title');

    splitTargets.forEach(el => {
        const text = el.innerHTML;
        if (!el.dataset.split) {
            el.dataset.split = 'true';
            el.style.overflow = 'hidden';
        }
    });

    const splitObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('split-visible');
                splitObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    splitTargets.forEach(el => splitObserver.observe(el));

    // ============================================================
    // Smooth scroll
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = this.getAttribute('href');
            if (target === '#') return;

            const targetEl = document.querySelector(target);
            if (targetEl) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const offsetTop = targetEl.offsetTop - navHeight + 1;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // ============================================================
    // Parallax on hero
    // ============================================================
    const hero = document.querySelector('.hero');
    const gradientMesh = document.querySelector('.gradient-mesh');
    const heroContent = document.querySelector('.hero-content');

    if (hero && gradientMesh && heroContent) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            const heroHeight = hero.offsetHeight;
            if (scrollY < heroHeight) {
                const factor = scrollY / heroHeight;
                gradientMesh.style.transform = `translateY(${scrollY * 0.4}px) scale(${1 + factor * 0.1})`;
                heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
                heroContent.style.opacity = 1 - factor * 0.6;
            }
        }, { passive: true });
    }

});
