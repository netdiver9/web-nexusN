// ================================================================
// NEXUS_N · Modern Interactions
// ================================================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

document.addEventListener('DOMContentLoaded', function() {

    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const cursorGlow = document.getElementById('cursorGlow');

    // ============================================================
    // Preloader — fade out once page is settled
    // ============================================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const minDelay = prefersReducedMotion ? 200 : 1700;
        const start = performance.now();
        const dismiss = () => {
            const elapsed = performance.now() - start;
            const wait = Math.max(0, minDelay - elapsed);
            setTimeout(() => {
                preloader.classList.add('done');
                setTimeout(() => preloader.remove(), 800);
            }, wait);
        };
        if (document.readyState === 'complete') dismiss();
        else window.addEventListener('load', dismiss, { once: true });
    }

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

    // ============================================================
    // Hero constellation canvas — animated network points
    // ============================================================
    const heroCanvas = document.getElementById('heroCanvas');
    if (heroCanvas && !prefersReducedMotion) {
        const ctx = heroCanvas.getContext('2d');
        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let w = 0, h = 0;
        let points = [];
        let mouseCx = -9999, mouseCy = -9999;
        let rafId = null;
        let running = true;

        function resize() {
            const rect = heroCanvas.getBoundingClientRect();
            w = rect.width;
            h = rect.height;
            heroCanvas.width = Math.floor(w * dpr);
            heroCanvas.height = Math.floor(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            initPoints();
        }

        function initPoints() {
            const area = w * h;
            const baseCount = Math.round(area / 18000);
            const count = Math.max(28, Math.min(110, baseCount));
            points = [];
            for (let i = 0; i < count; i++) {
                points.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.18,
                    vy: (Math.random() - 0.5) * 0.18,
                    r: Math.random() * 1.4 + 0.6
                });
            }
        }

        function tick() {
            if (!running) return;
            ctx.clearRect(0, 0, w, h);

            for (const p of points) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < -20) p.x = w + 20;
                if (p.x > w + 20) p.x = -20;
                if (p.y < -20) p.y = h + 20;
                if (p.y > h + 20) p.y = -20;
            }

            // Connection lines
            const maxDist = 130;
            for (let i = 0; i < points.length; i++) {
                const p1 = points[i];
                for (let j = i + 1; j < points.length; j++) {
                    const p2 = points[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.22;
                        ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }

                // Mouse interaction
                const mdx = p1.x - mouseCx;
                const mdy = p1.y - mouseCy;
                const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
                const mouseRadius = 200;
                if (mDist < mouseRadius) {
                    const alpha = (1 - mDist / mouseRadius) * 0.55;
                    ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouseCx, mouseCy);
                    ctx.stroke();
                }
            }

            // Points
            for (const p of points) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
                ctx.fill();
            }

            rafId = requestAnimationFrame(tick);
        }

        function onMouseMove(e) {
            const rect = heroCanvas.getBoundingClientRect();
            mouseCx = e.clientX - rect.left;
            mouseCy = e.clientY - rect.top;
        }

        function onMouseLeave() {
            mouseCx = -9999;
            mouseCy = -9999;
        }

        // Pause when not visible (saves CPU)
        const heroObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!running) {
                        running = true;
                        tick();
                    }
                } else {
                    running = false;
                    if (rafId) cancelAnimationFrame(rafId);
                }
            });
        }, { threshold: 0 });
        heroObs.observe(heroCanvas);

        let resizeT = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeT);
            resizeT = setTimeout(resize, 150);
        });
        document.addEventListener('mousemove', onMouseMove);
        heroCanvas.addEventListener('mouseleave', onMouseLeave);

        resize();
        tick();
    }

    // ============================================================
    // Spotlight: track mouse for radial highlight on cards
    // ============================================================
    if (!isTouch) {
        const spotlightCards = document.querySelectorAll('.bento, .feature-card, .contact-card, .strength-item, .why-item, .philosophy-card, .process-step, .ais-card');
        spotlightCards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mx', x + '%');
                card.style.setProperty('--my', y + '%');
            });
        });
    }

    // ============================================================
    // Sticky side indicator — shows current section
    // ============================================================
    const sideIndicator = document.getElementById('sideIndicator');
    const sideNum = document.getElementById('sideNum');
    const sideLabel = document.getElementById('sideLabel');

    if (sideIndicator && sideNum && sideLabel) {
        const sectionMeta = [
            { id: 'home', num: '01', label: 'HOME', dark: false },
            { id: 'stats', num: '02', label: 'STATS', dark: true },
            { id: 'about', num: '03', label: 'ABOUT', dark: true },
            { id: 'values', num: '04', label: 'VALUES', dark: false },
            { id: 'why', num: '05', label: 'WHY US', dark: true },
            { id: 'business', num: '06', label: 'BUSINESS', dark: true },
            { id: 'contact', num: '07', label: 'CONTACT', dark: false }
        ];

        // Tag certain sections that don't have IDs by class
        const heroEl = document.querySelector('.hero');
        const statsEl = document.querySelector('.stats');
        const whyEl = document.querySelector('.why');
        if (heroEl && !heroEl.id) heroEl.dataset.sec = 'home';
        if (statsEl && !statsEl.id) statsEl.dataset.sec = 'stats';
        if (whyEl && !whyEl.id) whyEl.dataset.sec = 'why';

        const elMap = {};
        sectionMeta.forEach(m => {
            elMap[m.id] = document.getElementById(m.id) || document.querySelector(`[data-sec="${m.id}"]`);
        });

        let currentId = '';
        function updateSide() {
            const trigger = window.scrollY + window.innerHeight * 0.4;
            let matched = sectionMeta[0];
            for (const m of sectionMeta) {
                const el = elMap[m.id];
                if (el && el.offsetTop <= trigger) matched = m;
            }
            if (window.scrollY < 80) {
                sideIndicator.classList.remove('visible');
            } else {
                sideIndicator.classList.add('visible');
            }
            if (matched.id !== currentId) {
                currentId = matched.id;
                sideIndicator.classList.add('changing');
                sideIndicator.classList.toggle('dark', matched.dark);
                setTimeout(() => {
                    sideNum.textContent = matched.num;
                    sideLabel.textContent = matched.label;
                    sideIndicator.classList.remove('changing');
                }, 180);
            }
        }
        window.addEventListener('scroll', updateSide, { passive: true });
        updateSide();
    }

    // ============================================================
    // Char split for hero title (mask reveal per character)
    // ============================================================
    if (!prefersReducedMotion) {
        const heroWords = document.querySelectorAll('.hero-title .word');
        heroWords.forEach((word, wi) => {
            const text = word.textContent;
            // Wrap each char in a mask + animated span for richer reveal
            word.innerHTML = '';
            [...text].forEach((ch, i) => {
                const mask = document.createElement('span');
                mask.className = 'char-mask';
                const inner = document.createElement('span');
                inner.textContent = ch === ' ' ? ' ' : ch;
                inner.style.animationDelay = (0.15 + wi * 0.08 + i * 0.025) + 's';
                mask.appendChild(inner);
                word.appendChild(mask);
            });
            // Restore original animation by removing the legacy translate-up keyframe
            word.style.animation = 'none';
            word.style.transform = 'none';
        });
    }
});
