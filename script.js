document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const cursor = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.custom-cursor-dot');
    const scrollProgress = document.querySelector('.scroll-progress');
    
    // Custom Cursor Logic
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
    });

    // Cursor Hover Effects
    const links = document.querySelectorAll('a, button, .gallery-card');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.background = 'rgba(230, 255, 0, 0.1)';
        });
        link.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'transparent';
        });
    });

    // Scroll Progress & Header Logic
    window.addEventListener('scroll', () => {
        // Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + "%";

        // Header Background
        if (window.scrollY > 50) {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.padding = '0.8rem 2rem';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.7)';
            header.style.padding = '1.2rem 2rem';
        }
    });

    // Parallax effect for espejo decorations
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        document.querySelectorAll('.espejo-decoration').forEach(el => {
            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });

    // ── Hero Slideshow ──────────────────────────────────
    const slides = document.querySelectorAll('.hero-slide');
    const dots   = document.querySelectorAll('.hero-dot');
    let current  = 0;
    let slideshowTimer;

    function goToSlide(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    function nextSlide() {
        goToSlide(current + 1);
    }

    function startSlideshow() {
        slideshowTimer = setInterval(nextSlide, 5000); // cambia cada 5s
    }

    // Dots clicables
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            clearInterval(slideshowTimer);
            goToSlide(parseInt(dot.dataset.index));
            startSlideshow();
        });
    });

    // Flechas manuales
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');

    if (prevBtn) prevBtn.addEventListener('click', () => {
        clearInterval(slideshowTimer);
        goToSlide(current - 1);
        startSlideshow();
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        clearInterval(slideshowTimer);
        goToSlide(current + 1);
        startSlideshow();
    });

    if (slides.length > 1) startSlideshow();
});
