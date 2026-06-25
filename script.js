/* ========================================
   SCRIPT.JS - Complete Portfolio Functionality
   ======================================== */

// ========================================
// 1. LOADER
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Hide loader when page is fully loaded
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    }
    
    // Initialize everything
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
    let isWaiting = false;
    
    function typeEffect() {
        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            // Deleting characters
            typingElement.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                isWaiting = true;
                titleIndex = (titleIndex + 1) % titles.length;
                setTimeout(() => {
                    isWaiting = false;
                    typeEffect();
                }, 500);
                return;
            }
            
            setTimeout(typeEffect, 30);
        } else {
            // Typing characters
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
    
    // Start the typing effect after a small delay
    setTimeout(typeEffect, 500);
}

// ========================================
// 3. SCROLL REVEAL ANIMATIONS
// ========================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If it's a counter element, trigger counter animation
                if (entry.target.querySelector('.counter-number')) {
                    animateCounter(entry.target.querySelector('.counter-number'));
                }
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
        
        // Store target as data attribute for scroll trigger
        element.dataset.target = counter.target;
        element.dataset.suffix = counter.suffix || '';
        element.textContent = '0' + counter.suffix;
    });
}

function animateCounter(element) {
    if (!element || element.dataset.animated === 'true') return;
    
    const target = parseInt(element.dataset.target);
    const suffix = element.dataset.suffix || '';
    let current = 0;
    const duration = 1500;
    const step = Math.max(1, Math.floor(target / 60));
    const increment = target / (duration / 16);
    
    element.dataset.animated = 'true';
    
    function updateCounter() {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            return;
        }
        element.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(updateCounter);
    }
    
    updateCounter();
}

// ========================================
// 5. PARTICLES BACKGROUND
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
            
            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
            
            // Mouse interaction
            if (isMouseNear) {
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;
                
                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance * 0.5;
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
    
    // Create particles
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Draw connections between nearby particles
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
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawConnections();
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // Track mouse for interaction
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        isMouseNear = true;
    });
    
    canvas.addEventListener('mouseleave', () => {
        isMouseNear = false;
    });
}

// ========================================
// 6. MOUSE GLOW EFFECT
// ========================================
function initMouseGlow() {
    const glow = document.getElementById('mouseGlow');
    if (!glow) return;
    
    let isVisible = false;
    
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        
        if (!isVisible) {
            glow.style.display = 'block';
            isVisible = true;
        }
    });
    
    document.addEventListener('mouseleave', () => {
        glow.style.display = 'none';
        isVisible = false;
    });
}

// ========================================
// 7. NAVBAR SCROLL EFFECT
// ========================================
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ========================================
// 8. GITHUB API INTEGRATION
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
        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) throw new Error('User not found');
        const userData = await userResponse.json();
        
        // Update avatar
        if (avatarImg) {
            avatarImg.src = userData.avatar_url;
            avatarImg.alt = `${username}'s avatar`;
        }
        
        // Update stats
        if (followersEl) followersEl.textContent = userData.followers || 0;
        if (reposEl) reposEl.textContent = userData.public_repos || 0;
        
        // Fetch repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        if (!reposResponse.ok) throw new Error('Repositories not found');
        const repos = await reposResponse.json();
        
        // Calculate total stars
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        if (starsEl) starsEl.textContent = totalStars;
        
        // Render repositories
        reposList.innerHTML = '';
        
        if (repos.length === 0) {
            reposList.innerHTML = '<p style="color: #606078; font-size: 0.9rem;">No repositories found.</p>';
            return;
        }
        
        repos.forEach(repo => {
            const repoItem = document.createElement('div');
            repoItem.className = 'github-repo-item';
            
            const langColor = getLanguageColor(repo.language);
            
            repoItem.innerHTML = `
                <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                <div class="repo-meta">
                    ${repo.language ? `<span class="lang-dot" style="background: ${langColor};"></span> ${repo.language}` : ''}
                    <span>⭐ ${repo.stargazers_count}</span>
                    <span>🍴 ${repo.forks_count}</span>
                </div>
            `;
            
            reposList.appendChild(repoItem);
        });
        
    } catch (error) {
        console.error('GitHub API Error:', error);
        reposList.innerHTML = `
            <p style="color: #606078; font-size: 0.9rem;">
                ⚠️ Unable to load repositories. Please try again later.
            </p>
        `;
    }
}

// Language colors for GitHub repos
function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'TypeScript': '#2b7489',
        'Java': '#b07219',
        'C++': '#f34b7d',
        'C#': '#178600',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'Swift': '#ffac45',
        'PHP': '#4F5D95',
        'Vue': '#2c3e50',
        'Shell': '#89e051',
        'SQL': '#e38c00'
    };
    return colors[language] || '#808080';
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
        
        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Create mailto link
        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        window.location.href = `mailto:vishal4u88@gmail.com?subject=${subject}&body=${body}`;
        
        // Show success feedback
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '✅ Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            form.reset();
        }, 3000);
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ========================================
// 10. BACK TO TOP BUTTON
// ========================================
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// 11. UPDATE FOOTER YEAR
// ========================================
function initYearUpdate() {
    const yearEl = document.getElementById('footerYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

// ========================================
// 12. PROJECT CARD ANIMATIONS
// ========================================
function initProjectCards() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}

// ========================================
// 13. SMOOTH SCROLL FOR NAV LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const navHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// 14. PARALLAX EFFECT ON HERO
// ========================================
function initParallax() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollY < hero.offsetHeight) {
            const parallax = scrollY * 0.4;
            const blobs = hero.querySelectorAll('.blob');
            blobs.forEach((blob, index) => {
                blob.style.transform = `translateY(${parallax * (0.5 + index * 0.2)}px)`;
            });
        }
    });
}

initParallax();

// ========================================
// 15. KEYBOARD SHORTCUTS
// ========================================
document.addEventListener('keydown', (e) => {
    // Press 'ESC' to close mobile menu
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.style.display === 'flex') {
            mobileMenu.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
    
    // Press 'Ctrl + K' to open search (for future enhancement)
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        // Can be extended for search functionality
    }
});

// ========================================
// 16. PERFORMANCE: LAZY LOAD IMAGES
// ========================================
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ========================================
// 17. CONSOLE WELCOME
// ========================================
console.log('%c🚀 Vishal Kumar Portfolio', 'font-size: 24px; font-weight: bold; color: #6c5ce7;');
console.log('%cBuilt with ❤️ using Vanilla JS', 'font-size: 14px; color: #9090a8;');
console.log('%cCheck out the source code: https://github.com/vishal4u88', 'font-size: 14px; color: #00d4ff;');

// ========================================
// 18. RESPONSIVE GITHUB CONTRIBUTION GRAPH
// ========================================
function updateGitHubGraph() {
    const graphImg = document.querySelector('#github-section .github-contribution img');
    if (graphImg) {
        // Add cache-busting to prevent stale images
        const username = 'vishal4u88';
        graphImg.src = `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&hide_border=true&bg_color=0a0a0f&title_color=6c5ce7&text_color=9090a8&icon_color=00d4ff&cache=${Date.now()}`;
    }
}

// Call after GitHub API loads
setTimeout(updateGitHubGraph, 2000);

// ========================================
// 19. DETECT BROWSER FEATURES
// ========================================
function detectBrowserFeatures() {
    const features = {
        supportsWebP: false,
        supportsIntersectionObserver: 'IntersectionObserver' in window,
        supportsTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };
    
    // Check WebP support
    const img = new Image();
    img.onload = () => { features.supportsWebP = true; };
    img.onerror = () => { features.supportsWebP = false; };
    img.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
    
    // Add class to body for feature detection
    document.body.classList.add(features.prefersReducedMotion ? 'reduce-motion' : 'allow-motion');
    document.body.classList.add(features.supportsTouch ? 'touch-device' : 'mouse-device');
    
    return features;
}

detectBrowserFeatures();

// ========================================
// 20. PORTFOLIO READY LOG
// ========================================
console.log('✅ Portfolio ready!');
console.log(`📱 ${window.innerWidth}x${window.innerHeight} viewport`);
console.log(`🌙 ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light'} mode`);