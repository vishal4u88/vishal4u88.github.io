/* ========================================
   SCRIPT.JS - Complete Portfolio Functionality
   ======================================== */

// ========================================
// 1. LOADER
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    }
    
    initTypingEffect();
    initScrollReveal();
    initCounterAnimation();
    initParticles();
    initMouseGlow();
    initNavbarScroll();
    initGitHubAPI();
    initContactForm();
    initBackToTop();
    initYearUpdate();
    initProjectCards();
    initThemeToggle();
    animateSkillBars();
    initTiltCards();
});

// ========================================
// 2. TYPING EFFECT
// ========================================
function initTypingEffect() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;
    
    const titles = [
        'Technical Support Engineer',
        'AI Automation Engineer',
        'Chrome Extension Developer',
        'Python Developer',
        'LLM Engineer',
        'Data Analytics Enthusiast'
    ];
    
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
                setTimeout(typeEffect, 500);
                return;
            }
            setTimeout(typeEffect, 30);
        } else {
            typingElement.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentTitle.length) {
                isDeleting = true;
                setTimeout(typeEffect, 2000);
                return;
            }
            setTimeout(typeEffect, 50);
        }
    }
    
    setTimeout(typeEffect, 500);
}

// ========================================
// 3. SCROLL REVEAL
// ========================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => observer.observe(el));
}

// ========================================
// 4. COUNTER ANIMATION
// ========================================
function initCounterAnimation() {
    const counters = [
        { id: 'counterYears', target: 3, suffix: '+' },
        { id: 'counterPromotions', target: 3, suffix: '' },
        { id: 'counterReduction', target: 70, suffix: '%+' },
        { id: 'counterGlobal', target: 3, suffix: '' }
    ];
    
    counters.forEach(counter => {
        const element = document.getElementById(counter.id);
        if (!element) return;
        element.dataset.target = counter.target;
        element.dataset.suffix = counter.suffix || '';
        element.textContent = '0' + counter.suffix;
    });
}

// ========================================
// 5. PARTICLES
// ========================================
function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let isMouseNear = false;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
            if (isMouseNear) {
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    const force = (150 - distance) / 150 * 0.5;
                    this.x += (dx / distance) * force;
                    this.y += (dy / distance) * force;
                }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(108, 92, 231, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(108, 92, 231, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        isMouseNear = true;
    });
    canvas.addEventListener('mouseleave', () => { isMouseNear = false; });
}

// ========================================
// 6. MOUSE GLOW
// ========================================
function initMouseGlow() {
    const glow = document.getElementById('mouseGlow');
    if (!glow) return;
    let visible = false;
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        if (!visible) { glow.style.display = 'block'; visible = true; }
    });
    document.addEventListener('mouseleave', () => {
        glow.style.display = 'none';
        visible = false;
    });
}

// ========================================
// 7. NAVBAR SCROLL
// ========================================
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.pageYOffset > 50);
    });
}

// ========================================
// 8. GITHUB API
// ========================================
async function initGitHubAPI() {
    const username = 'vishal4u88';
    const reposList = document.getElementById('githubReposList');
    const followersEl = document.getElementById('githubFollowers');
    const reposEl = document.getElementById('githubRepos');
    const starsEl = document.getElementById('githubStars');
    const avatarImg = document.querySelector('#githubAvatar img');
    if (!reposList) return;
    
    try {
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) throw new Error('User not found');
        const userData = await userRes.json();
        if (avatarImg) avatarImg.src = userData.avatar_url;
        if (followersEl) followersEl.textContent = userData.followers || 0;
        if (reposEl) reposEl.textContent = userData.public_repos || 0;
        
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        if (!reposRes.ok) throw new Error('Repos not found');
        const repos = await reposRes.json();
        const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
        if (starsEl) starsEl.textContent = totalStars;
        
        reposList.innerHTML = '';
        if (repos.length === 0) {
            reposList.innerHTML = '<p style="color:#606078;font-size:0.9rem;">No repositories found.</p>';
            return;
        }
        repos.forEach(repo => {
            const item = document.createElement('div');
            item.className = 'github-repo-item';
            const color = getLanguageColor(repo.language);
            item.innerHTML = `
                <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                <div class="repo-meta">
                    ${repo.language ? `<span class="lang-dot" style="background:${color};"></span> ${repo.language}` : ''}
                    <span>⭐ ${repo.stargazers_count}</span>
                    <span>🍴 ${repo.forks_count}</span>
                </div>
            `;
            reposList.appendChild(item);
        });
    } catch (error) {
        console.error('GitHub API Error:', error);
        reposList.innerHTML = '<p style="color:#606078;font-size:0.9rem;">⚠️ Unable to load repositories.</p>';
    }
}

function getLanguageColor(lang) {
    const colors = {
        'JavaScript': '#f1e05a', 'Python': '#3572A5', 'HTML': '#e34c26',
        'CSS': '#563d7c', 'TypeScript': '#2b7489', 'Java': '#b07219',
        'C++': '#f34b7d', 'C#': '#178600', 'Ruby': '#701516',
        'Go': '#00ADD8', 'Rust': '#dea584', 'Swift': '#ffac45',
        'PHP': '#4F5D95', 'Vue': '#2c3e50', 'Shell': '#89e051', 'SQL': '#e38c00'
    };
    return colors[lang] || '#808080';
}

// ========================================
// 9. CONTACT FORM
// ========================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        if (!name || !email || !message) { alert('Please fill in all fields.'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Please enter a valid email.'); return; }
        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        window.location.href = `mailto:vishal4u88@gmail.com?subject=${subject}&body=${body}`;
        const btn = form.querySelector('.btn-primary');
        const original = btn.textContent;
        btn.textContent = '✅ Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
        setTimeout(() => { btn.textContent = original; btn.style.background = ''; form.reset(); }, 3000);
    });
}

// ========================================
// 10. BACK TO TOP
// ========================================
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========================================
// 11. YEAR UPDATE
// ========================================
function initYearUpdate() {
    const el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
}

// ========================================
// 12. PROJECT CARDS
// ========================================
function initProjectCards() {
    document.querySelectorAll('.project-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.1}s`;
    });
}

// ========================================
// 13. THEME TOGGLE
// ========================================
function initThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
    toggleBtn.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
    toggleBtn.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        toggleBtn.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    });
}

// ========================================
// 14. SKILL BARS ANIMATION
// ========================================
function animateSkillBars() {
    const fills = document.querySelectorAll('.skill-bar-fill');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.dataset.width || 0;
                setTimeout(() => { fill.style.width = width + '%'; }, 200);
                observer.unobserve(fill);
            }
        });
    }, { threshold: 0.5 });
    fills.forEach(fill => observer.observe(fill));
}

// ========================================
// 15. TILT CARDS (3D HOVER)
// ========================================
function initTiltCards() {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            card.style.setProperty('--rotateX', rotateX + 'deg');
            card.style.setProperty('--rotateY', rotateY + 'deg');
        });
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--rotateX', '0deg');
            card.style.setProperty('--rotateY', '0deg');
        });
    });
}

// ========================================
// 16. SMOOTH SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const navHeight = document.getElementById('navbar').offsetHeight;
            window.scrollTo({
                top: target.offsetTop - navHeight - 20,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// 17. CONSOLE WELCOME
// ========================================
console.log('%c🚀 Vishal Kumar Portfolio', 'font-size:24px;font-weight:bold;color:#6c5ce7;');
console.log('%cBuilt with ❤️ using Vanilla JS', 'font-size:14px;color:#9090a8;');
console.log('%cSource: https://github.com/vishal4u88', 'font-size:14px;color:#00d4ff;');