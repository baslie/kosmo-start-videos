// Звёздное небо: редкие тусклые звёзды, лёгкое мерцание (без него при reduced-motion).
(() => {
  const c = document.querySelector('.sky');
  const ctx = c.getContext('2d');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars = [], w = 0, h = 0;

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    c.width = w * dpr; c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round((w * h) / 9000);
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() < 0.08 ? 1.2 : 0.6 + Math.random() * 0.4,
      a: 0.15 + Math.random() * 0.45,
      p: Math.random() * Math.PI * 2, s: 0.2 + Math.random() * 0.6,
      warm: Math.random() < 0.12,
    }));
    if (still) draw(0);
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const tw = still ? 1 : 0.65 + 0.35 * Math.sin(s.p + t * 0.001 * s.s);
      ctx.globalAlpha = s.a * tw;
      ctx.fillStyle = s.warm ? '#E8B56A' : '#E8EEF7';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    }
    if (!still) requestAnimationFrame(draw);
  }

  addEventListener('resize', resize);
  resize();
  if (!still) requestAnimationFrame(draw);
})();

// Появление роликов и подсветка текущего номера в навигации.
(() => {
  document.documentElement.classList.add('js');
  const clips = [...document.querySelectorAll('.clip')];
  const links = new Map([...document.querySelectorAll('.toc a')].map(a => [a.hash.slice(1), a]));

  const reveal = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px' });
  clips.forEach(el => reveal.observe(el));

  const spy = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      links.forEach(a => a.classList.remove('on'));
      links.get(e.target.dataset.toc || e.target.id)?.classList.add('on');
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  clips.forEach(el => spy.observe(el));
})();
