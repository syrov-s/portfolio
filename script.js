// ========== БЕЗОПАСНЫЙ ПОИСК ЭЛЕМЕНТОВ ==========
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const progressBar = document.getElementById('scrollProgress');
const themeToggle = document.getElementById('themeToggle');
const toTop = document.getElementById('toTop');
const typedEl = document.getElementById('typed');
const canvas = document.getElementById('stars');

// ========== ПЛАВНЫЙ СКРОЛЛ ==========
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            if (navLinks && burger) {
                navLinks.classList.remove('open');
                burger.classList.remove('active');
                document.body.classList.remove('no-scroll');
                burger.setAttribute('aria-expanded', 'false');
            }
        }
    });
});

// ========== БУРГЕР-МЕНЮ ==========
if (burger && navLinks) {
    burger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        burger.classList.toggle('active', isOpen);
        document.body.classList.toggle('no-scroll', isOpen);
        burger.setAttribute('aria-expanded', isOpen);
    });
}

// ========== ПОЯВЛЕНИЕ СЕКЦИЙ ==========
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section').forEach(section => {
    sectionObserver.observe(section);
});

// ========== ПРОГРЕСС-БАР ПРОКРУТКИ ==========
if (progressBar) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = progress + '%';
        }
    });
}

// ========== ПЕЧАТАЮЩИЙСЯ ТЕКСТ ==========
if (typedEl) {
    const words = ['сайты-визитки', 'лендинги', 'интерфейсы', 'SPA на React', 'анимации'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        if (!isDeleting) {
            typedEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(type, 1800);
                return;
            }
        } else {
            typedEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
        }
        setTimeout(type, isDeleting ? 50 : 100);
    }
    setTimeout(type, 500);
}

// ========== КНОПКА «НАВЕРХ» ==========
if (toTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            toTop.classList.add('visible');
        } else {
            toTop.classList.remove('visible');
        }
    });
    toTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========== КАСТОМНЫЙ КУРСОР ==========
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let isMouseMoving = false;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!isMouseMoving) {
            cursorDot.style.opacity = '1';
            cursorRing.style.opacity = '1';
            isMouseMoving = true;
        }
        
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .tilt').forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
}

// ========== ЗВЁЗДНЫЙ ФОН ==========
if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];

    function resizeStars() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        stars = [];
        const count = Math.floor((canvas.width * canvas.height) / 8000);
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.5 + 0.3,
                a: Math.random() * 0.6 + 0.2,
                speed: Math.random() * 0.3 + 0.05
            });
        }
    }
    resizeStars();
    window.addEventListener('resize', resizeStars);

    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            // Делаем искры чуть более розовыми в тон новому акценту
            ctx.fillStyle = 'rgba(255, 100, 150, ' + s.a + ')';
            ctx.fill();
            s.y += s.speed;
            if (s.y > canvas.height) {
                s.y = 0;
                s.x = Math.random() * canvas.width;
            }
        });
        requestAnimationFrame(drawStars);
    }
    drawStars();
}

// ========== СЧЁТЧИКИ-ЦИФРЫ ==========
const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-num').forEach(num => {
                const target = +num.dataset.target;
                let current = 0;
                const step = target / 60;
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        num.textContent = target;
                        clearInterval(timer);
                    } else {
                        num.textContent = Math.floor(current);
                    }
                }, 20);
            });
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) statObserver.observe(statsSection);

// ========== ПРОГРЕСС-БАРЫ НАВЫКОВ ==========
const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-fill').forEach(fill => {
                setTimeout(() => {
                    fill.style.width = fill.dataset.width + '%';
                }, 100);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const skillsSection = document.querySelector('.skills-bars');
if (skillsSection) skillObserver.observe(skillsSection);

// ========== 3D-TILT ДЛЯ КАРТОЧЕК ==========
document.querySelectorAll('.tilt').forEach(card => {
    const inner = card.querySelector('.tilt-inner');
    if (inner) {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            inner.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
        });
        card.addEventListener('mouseleave', () => {
            inner.style.transform = 'rotateX(0) rotateY(0) scale(1)';
        });
    }
});

// ========== ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ ==========
if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light');
        themeToggle.textContent = isLight ? '☀️' : '🌙';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        showToast(isLight ? '☀️ Светлая тема' : '🌙 Тёмная тема');
    });
}

// ========== ТОСТ-УВЕДОМЛЕНИЯ ==========
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

window.addEventListener('load', () => {
    if (!sessionStorage.getItem('visited')) {
        setTimeout(() => showToast('👋 Добро пожаловать!'), 1000);
        sessionStorage.setItem('visited', 'true');
    }
});

// ========== МАГНИТНАЯ КНОПКА ==========
const magnetBtn = document.getElementById('magnetBtn');
if (magnetBtn) {
    magnetBtn.addEventListener('mousemove', e => {
        const rect = magnetBtn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        magnetBtn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
    });
    magnetBtn.addEventListener('mouseleave', () => {
        magnetBtn.style.transform = 'translate(0, 0)';
    });
}

// ========== КОПИРОВАНИЕ EMAIL ==========
const emailLink = document.querySelector('a[href^="mailto:"]');
if (emailLink) {
    emailLink.addEventListener('click', e => {
        e.preventDefault();
        const email = emailLink.href.replace('mailto:', '');
        navigator.clipboard.writeText(email).then(() => {
            showToast('📋 Email скопирован: ' + email);
        }).catch(() => {
            window.location.href = emailLink.href;
        });
    });
}