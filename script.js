document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 500);
  }
  initCustomCursor();
  initGridCanvas();
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
  initMobileMenu();
});

function initCustomCursor() {
  if (window.innerWidth <= 768) return;
  const cursor = document.createElement('div');
  cursor.id = 'customCursor';
  cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
  document.body.appendChild(cursor);
  let mx = 0, my = 0, cx = 0, cy = 0;
  let active = false;
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });
  document.querySelectorAll('a, button, input, textarea, .tilt-card, .stat-card, .cert-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => { active = true; cursor.classList.add('active'); });
    el.addEventListener('mouseleave', () => { active = false; cursor.classList.remove('active'); });
  });
  document.addEventListener('mouseleave', () => cursor.style.display = 'none');
  document.addEventListener('mouseenter', () => cursor.style.display = 'block');
}

function initGridCanvas() {
  const canvas = document.createElement('canvas');
  canvas.id = 'gridCanvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  const spacing = 60;
  const dots = [];
  const mouse = { x: -1000, y: -1000 };
  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  for (let x = 0; x < canvas.width + spacing; x += spacing) {
    for (let y = 0; y < canvas.height + spacing; y += spacing) {
      dots.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
    }
  }
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#00f0ff';
    dots.forEach(d => {
      const dx = d.ox - mouse.x;
      const dy = d.oy - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120 * 2;
        const angle = Math.atan2(dy, dx);
        d.vx += Math.cos(angle) * force;
        d.vy += Math.sin(angle) * force;
      }
      d.vx *= 0.85;
      d.vy *= 0.85;
      d.x += d.vx;
      d.y += d.vy;
      const tx = (d.x - d.ox) * 0.05;
      const ty = (d.y - d.oy) * 0.05;
      d.x -= tx;
      d.y -= ty;
      ctx.fillStyle = gridColor;
      ctx.globalAlpha = 0.2 + (Math.sin((d.x + d.y) * 0.01 + Date.now() * 0.0005) * 0.05);
      ctx.beginPath();
      ctx.arc(d.x, d.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  animate();
}

function initTypingEffect() {
  const el = document.getElementById('typingText');
  if (!el) return;
  const titles = [
    'Technical Support Engineer',
    'AI Automation Engineer',
    'Chrome Extension Developer',
    'Python Developer',
    'LLM Engineer',
    'Data Analytics Enthusiast'
  ];
  let ti = 0, ci = 0, del = false;
  function type() {
    const cur = titles[ti];
    if (del) {
      el.textContent = cur.substring(0, ci - 1);
      ci--;
      if (ci === 0) { del = false; ti = (ti + 1) % titles.length; setTimeout(type, 500); return; }
      setTimeout(type, 25);
    } else {
      el.textContent = cur.substring(0, ci + 1);
      ci++;
      if (ci === cur.length) { del = true; setTimeout(type, 2000); return; }
      setTimeout(type, 45);
    }
  }
  setTimeout(type, 500);
}

function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => obs.observe(el));
}

function initCounterAnimation() {
  const counters = [
    { id: 'counterYears', target: 3, suffix: '+' },
    { id: 'counterPromotions', target: 3, suffix: '' },
    { id: 'counterReduction', target: 70, suffix: '%+' },
    { id: 'counterGlobal', target: 3, suffix: '' }
  ];
  counters.forEach(c => {
    const el = document.getElementById(c.id);
    if (!el) return;
    el.dataset.target = c.target;
    el.dataset.suffix = c.suffix || '';
    el.textContent = '0' + c.suffix;
  });
  const statCards = document.querySelectorAll('.stat-card');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.animated) {
        e.target.dataset.animated = 'true';
        const numEl = e.target.querySelector('.stat-number span');
        if (!numEl) return;
        const target = parseInt(numEl.dataset.target) || 0;
        const suffix = numEl.dataset.suffix || '';
        let cur = 0;
        const dur = 1500;
        const start = performance.now();
        function tick(time) {
          const p = Math.min((time - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          cur = Math.floor(eased * target);
          numEl.textContent = cur + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else numEl.textContent = target + suffix;
        }
        requestAnimationFrame(tick);
      }
    });
  }, { threshold: 0.3 });
  statCards.forEach(card => obs.observe(card));
}

function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = 0, mouseY = 0, isNear = false;
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.sx = (Math.random() - 0.5) * 0.4;
      this.sy = (Math.random() - 0.5) * 0.4;
      this.op = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.sx;
      this.y += this.sy;
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
      if (isNear) {
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const f = (150 - dist) / 150 * 0.8;
          this.x += (dx / dist) * f;
          this.y += (dy / dist) * f;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#00f0ff';
      ctx.fillStyle = gridColor;
      ctx.globalAlpha = this.op;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  const count = Math.min(60, Math.floor(window.innerWidth / 20));
  for (let i = 0; i < count; i++) particles.push(new Particle());
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const op = (1 - dist / 120) * 0.1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#00f0ff';
          ctx.strokeStyle = gridColor;
          ctx.globalAlpha = op;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
    isNear = true;
  });
  canvas.addEventListener('mouseleave', () => { isNear = false; });
}

function initMouseGlow() {
  const glow = document.getElementById('mouseGlow');
  if (!glow) return;
  let vis = false;
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    if (!vis) { glow.style.display = 'block'; vis = true; }
  });
  document.addEventListener('mouseleave', () => { glow.style.display = 'none'; vis = false; });
}

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.pageYOffset > 50);
  });
}

async function initGitHubAPI() {
  const username = 'vishal4u88';
  const reposList = document.getElementById('githubReposList');
  const followersEl = document.getElementById('githubFollowers');
  const reposEl = document.getElementById('githubRepos');
  const starsEl = document.getElementById('githubStars');
  const avatarImg = document.querySelector('#githubAvatar img');
  if (!reposList) return;
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6&type=public`)
    ]);
    if (!userRes.ok) throw new Error('User fetch failed');
    if (!reposRes.ok) throw new Error('Repos fetch failed');
    const [userData, repos] = await Promise.all([userRes.json(), reposRes.json()]);
    if (avatarImg) {
      avatarImg.src = userData.avatar_url;
      avatarImg.alt = `${userData.login} GitHub avatar`;
    }
    if (followersEl) followersEl.textContent = userData.followers ?? 0;
    if (reposEl) reposEl.textContent = userData.public_repos ?? 0;
    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    if (starsEl) starsEl.textContent = totalStars;
    reposList.innerHTML = '';
    if (repos.length === 0) {
      reposList.innerHTML = '<p style="color:#555570;font-size:0.85rem;font-family:var(--font-mono);">No repositories found.</p>';
      return;
    }
    repos.forEach(repo => {
      const item = document.createElement('div');
      item.className = 'github-repo-item';
      const color = getLanguageColor(repo.language);
      item.innerHTML = `
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name">${repo.name}</a>
        <div class="repo-meta">
          ${repo.language ? `<span class="lang-dot" style="background:${color};color:${color};"></span> ${repo.language}` : ''}
          <span>★ ${repo.stargazers_count}</span>
          <span>⑂ ${repo.forks_count}</span>
        </div>
      `;
      reposList.appendChild(item);
    });
  } catch (error) {
    console.error('GitHub API Error:', error);
    reposList.innerHTML = '<p style="color:#ff3355;font-size:0.85rem;font-family:var(--font-mono);">⚠ Unable to load repositories. Please try again later.</p>';
  }
}

function getLanguageColor(lang) {
  const colors = {
    'JavaScript': '#f1e05a', 'Python': '#3572A5', 'HTML': '#e34c26',
    'CSS': '#563d7c', 'TypeScript': '#3178c6', 'Java': '#b07219',
    'C++': '#f34b7d', 'C#': '#178600', 'Ruby': '#701516',
    'Go': '#00ADD8', 'Rust': '#dea584', 'Swift': '#ffac45',
    'PHP': '#4F5D95', 'Vue': '#42b883', 'Shell': '#89e051', 'SQL': '#e38c00',
    'Kotlin': '#A97BFF', 'Dart': '#00B4AB', 'Scala': '#c22d40',
    'Jupyter Notebook': '#DA5B0B'
  };
  return colors[lang] || '#808080';
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const submitBtn = form.querySelector('.submit-btn');
  function validateField(input, errorEl, validator) {
    const val = input.value.trim();
    if (!val) {
      input.classList.remove('valid');
      input.classList.add('error');
      if (errorEl) errorEl.classList.add('visible');
      return false;
    }
    if (validator && !validator(val)) {
      input.classList.remove('valid');
      input.classList.add('error');
      if (errorEl) errorEl.classList.add('visible');
      return false;
    }
    input.classList.remove('error');
    input.classList.add('valid');
    if (errorEl) errorEl.classList.remove('visible');
    return true;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function validateAll() {
    const validName = validateField(nameInput, nameError);
    const validEmail = validateField(emailInput, emailError, v => emailRegex.test(v));
    const validMessage = validateField(messageInput, messageError, v => v.length >= 10);
    return validName && validEmail && validMessage;
  }
  nameInput.addEventListener('blur', () => validateField(nameInput, nameError));
  nameInput.addEventListener('input', () => { if (nameInput.value.trim()) validateField(nameInput, nameError); });
  emailInput.addEventListener('blur', () => validateField(emailInput, emailError, v => emailRegex.test(v)));
  emailInput.addEventListener('input', () => { if (emailRegex.test(emailInput.value.trim())) validateField(emailInput, emailError, v => emailRegex.test(v)); });
  messageInput.addEventListener('blur', () => validateField(messageInput, messageError, v => v.length >= 10));
  messageInput.addEventListener('input', () => { if (messageInput.value.trim().length >= 10) validateField(messageInput, messageError, v => v.length >= 10); });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    const originalHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn-loader"><span></span><span></span><span></span></span>';
    const subject = encodeURIComponent(`Portfolio Contact from ${nameInput.value.trim()}`);
    const body = encodeURIComponent(
      `Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`
    );
    await new Promise(r => setTimeout(r, 600));
    window.location.href = `mailto:vishal4u88@gmail.com?subject=${subject}&body=${body}`;
    submitBtn.innerHTML = '✅ Message Sent!';
    submitBtn.style.background = 'linear-gradient(135deg, #00e676, #00bcd4)';
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    setTimeout(() => {
      submitBtn.innerHTML = originalHtml;
      submitBtn.style.background = '';
      form.reset();
      [nameInput, emailInput, messageInput].forEach(i => i.classList.remove('valid', 'error'));
      [nameError, emailError, messageError].forEach(e => { if (e) e.classList.remove('visible'); });
    }, 3000);
  });
}

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initYearUpdate() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

function initProjectCards() {
  document.querySelectorAll('.project-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });
}

function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const saved = localStorage.getItem('theme');
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  btn.textContent = theme === 'dark' ? '🌙' : '☀️';
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    btn.textContent = next === 'dark' ? '🌙' : '☀️';
  });
}

function animateSkillBars() {
  const fills = document.querySelectorAll('.skill-bar-fill');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target;
        const w = fill.dataset.width || 0;
        setTimeout(() => { fill.style.width = w + '%'; }, 200);
        obs.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });
  fills.forEach(fill => obs.observe(fill));
}

function initTiltCards() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = r.width / 2;
      const cy = r.height / 2;
      const rx = ((y - cy) / cy) * -10;
      const ry = ((x - cx) / cx) * 10;
      card.style.setProperty('--rotateX', rx + 'deg');
      card.style.setProperty('--rotateY', ry + 'deg');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rotateX', '0deg');
      card.style.setProperty('--rotateY', '0deg');
    });
  });
}

function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  const close = document.getElementById('closeMenu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => menu.classList.add('active'));
  if (close) close.addEventListener('click', () => menu.classList.remove('active'));
  menu.addEventListener('click', e => {
    if (e.target.tagName === 'A') menu.classList.remove('active');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') menu.classList.remove('active');
  });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const nav = document.getElementById('navbar');
      const offset = nav ? nav.offsetHeight : 0;
      window.scrollTo({ top: target.offsetTop - offset - 20, behavior: 'smooth' });
    }
  });
});

function downloadResume() {
  window.open('assets/resume.pdf', '_blank');
}

console.log('%c⚡ Vishal Kumar — Portfolio v3', 'font-size:22px;font-weight:800;color:#00f0ff;');
console.log('%cTechnical Support Engineer & AI Automation @ HP', 'font-size:13px;color:#8888aa;');
console.log('%cgithub.com/vishal4u88', 'font-size:12px;color:#b400ff;');
