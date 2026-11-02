/* ==========================================================================
   Infinite Abstract Space: dynamic behaviour (progressive enhancement)
   --------------------------------------------------------------------------
   1. Scroll choreography: as the page scrolls, the glass sheets, light
      fields and colour washes evolve continuously (a slow "camera drift"
      through the space). Fully reversible: scrolling back restores the
      scene. Smoothed with inertia, so it never jumps.
   2. Cursor light: desktop mouse only.

   Only compositor-friendly properties are written: the individual
   `translate` / `rotate` / `scale` properties (which compose with the
   CSS keyframe `transform` ambient animations) and `opacity`.
   Nothing runs while the page is idle. Disabled by prefers-reduced-motion.
   ========================================================================== */
(() => {
  const root = document.querySelector('.space-bg');
  if (!root) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ---- helpers ---------------------------------------------------------- */
  const clamp01 = (x) => Math.min(1, Math.max(0, x));
  // Smooth 0→1 ramp between a and b (no hard starts/stops).
  const ramp = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  // Smooth 0→1→0 bump peaking at the middle of the scroll range.
  const wave = (x) => Math.sin(Math.PI * x);
  const $ = (sel) => root.querySelector(sel);

  /* ---- SCENE -------------------------------------------------------------
     p = scroll progress, 0 (top) → 1 (bottom). Each entry returns the
     state of one layer for a given p. Units: vw/vh (viewport %), degrees.
     Edit these to change the choreography.
     ------------------------------------------------------------------------ */
  const SCENE = [
    { el: $('.space-bg__sheet--tl'),            // top-left sweep lifts & opens up
      at: (p) => ({ x: -5 * p, y: -16 * ramp(0, 1, p), r: 9 * p, s: 1 + 0.08 * p,
                    o: 1 - 0.55 * ramp(0.35, 0.9, p) }) },
    { el: $('.space-bg__sheet--r'),             // right swell drifts up and turns
      at: (p) => ({ x: -5 * wave(p), y: -22 * p, r: -7 * p, s: 1 + 0.06 * wave(p) }) },
    { el: $('.space-bg__sheet--br'),            // bottom-right rises mid-page, then settles
      at: (p) => ({ x: -7 * wave(p), y: -20 * wave(p), r: 5 * wave(p), s: 1 + 0.05 * wave(p) }) },
    { el: $('.space-bg__sheet--bl'),            // lower-left sweep emerges from below
      at: (p) => { const t = ramp(0.12, 0.65, p);
                   return { x: -6 * (1 - t), y: 28 * (1 - t) - 6 * ramp(0.65, 1, p), r: -8 * (1 - t),
                            s: 1, o: t * (1 - 0.3 * ramp(0.85, 1, p)) }; } },
    { el: $('.space-bg__light--a'),             // central glow breathes, stays centred
      at: (p) => ({ x: 0, y: -4 * wave(p), s: 1 + 0.08 * wave(p) }) },
    { el: $('.space-bg__light--b'),             // upper bloom travels left → right
      at: (p) => ({ x: 34 * p, y: 8 * wave(p) }) },
    { el: $('.space-bg__light--c'),             // icy field rises on the right
      at: (p) => ({ x: -8 * wave(p), y: -34 * p }) },
    { el: $('.space-bg__light--d'),             // lavender field drifts to the centre-left
      at: (p) => ({ x: 18 * p, y: -26 * p, s: 1 + 0.1 * wave(p) }) },
    { el: $('.space-bg__tint--lavender'),       // lavender wash peaks mid-page
      at: (p) => ({ o: 0.9 * wave(p) }) },
    { el: $('.space-bg__tint--ice'),            // icy wash builds towards the end
      at: (p) => ({ o: 0.85 * ramp(0.55, 1, p) }) },
  ].filter((layer) => layer.el);

  /* ---- scroll loop ------------------------------------------------------ */
  const EASE = 0.075;            // inertia: lower = more floaty
  let strength = 1;              // --scroll-strength (CSS)
  let vw = 0, vh = 0, maxScroll = 1;
  let target = 0, current = -1, frame = 0;

  const measure = () => {
    vw = window.innerWidth / 100;
    vh = window.innerHeight / 100;
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const v = parseFloat(getComputedStyle(root).getPropertyValue('--scroll-strength'));
    strength = Number.isFinite(v) ? v : 1;
    target = clamp01(window.scrollY / maxScroll);
  };

  const apply = (p) => {
    for (const { el, at } of SCENE) {
      const st = at(p);
      const k = strength;
      if ('x' in st || 'y' in st) {
        el.style.translate = `${((st.x || 0) * k * vw).toFixed(2)}px ${((st.y || 0) * k * vh).toFixed(2)}px`;
      }
      if ('r' in st) el.style.rotate = `${(st.r * k).toFixed(3)}deg`;
      if ('s' in st) el.style.scale = (1 + (st.s - 1) * k).toFixed(4);
      if ('o' in st) el.style.opacity = clamp01(st.o).toFixed(3);
    }
  };

  const tick = () => {
    current = current < 0 ? target : current + (target - current) * EASE;
    if (Math.abs(target - current) < 0.0004) current = target;
    apply(current);
    frame = current !== target ? requestAnimationFrame(tick) : 0;
  };
  const wake = () => { if (!frame) frame = requestAnimationFrame(tick); };

  window.addEventListener('scroll', () => {
    target = clamp01(window.scrollY / maxScroll);
    wake();
  }, { passive: true });
  window.addEventListener('resize', () => { measure(); apply(current < 0 ? target : current); }, { passive: true });
  window.addEventListener('load', () => { measure(); wake(); });

  measure();
  current = target;              // start in the right state (e.g. after reload mid-page)
  apply(current);

  /* ---- cursor light (desktop mouse only) -------------------------------- */
  const light = $('.space-bg__cursor');
  if (!light || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const C_EASE = 0.06;
  let tx = window.innerWidth / 2, ty = window.innerHeight / 2, cx = tx, cy = ty, cFrame = 0;

  const follow = () => {
    cx += (tx - cx) * C_EASE;
    cy += (ty - cy) * C_EASE;
    light.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
    cFrame = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.5 ? requestAnimationFrame(follow) : 0;
  };

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    tx = e.clientX;
    ty = e.clientY;
    light.classList.add('is-active');
    if (!cFrame) cFrame = requestAnimationFrame(follow);
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', () => light.classList.remove('is-active'));
})();
