document.addEventListener('DOMContentLoaded', () => {

  /**
   * Crea un carrusel por scroll-snap controlado por botones.
   * - viewport: el elemento que scrollea (main-slider o media-carousel)
   * - items: lista de slides (slider-item o hijos del carousel-track)
   */
  function setupSnapCarousel({ viewport, items, prevBtn, nextBtn }) {
    if (!viewport || !items.length || !prevBtn || !nextBtn) return;

    let index = 0;

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    const scrollToIndex = (i) => {
      index = clamp(i, 0, items.length - 1);
      viewport.scrollTo({
        left: items[index].offsetLeft,
        behavior: 'smooth'
      });
      updateButtons();
    };

    const updateButtons = () => {
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === items.length - 1;

      prevBtn.style.opacity = prevBtn.disabled ? '0.35' : '1';
      nextBtn.style.opacity = nextBtn.disabled ? '0.35' : '1';
    };

    // Clicks
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      scrollToIndex(index + 1);
    });

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      scrollToIndex(index - 1);
    });

    // Si el usuario scrollea con trackpad/rueda, intentamos “re-sincronizar”
    let scrollTimeout = null;
    viewport.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Encuentra el slide más cercano al scrollLeft actual
        const current = viewport.scrollLeft;
        let closest = 0;
        let closestDist = Infinity;

        items.forEach((el, i) => {
          const d = Math.abs(el.offsetLeft - current);
          if (d < closestDist) {
            closestDist = d;
            closest = i;
          }
        });

        index = closest;
        updateButtons();
      }, 120);
    });

    // Inicial
    updateButtons();
  }

  // ===============================
  // 1) Carouseles internos (imagenes/videos)
  // ===============================
  document.querySelectorAll('.carousel-container').forEach(container => {
    const viewport = container.querySelector('.media-carousel');
    const track = container.querySelector('.carousel-track');
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');

    if (!viewport || !track) return;

    const items = Array.from(track.children);

    setupSnapCarousel({
      viewport,
      items,
      prevBtn,
      nextBtn
    });
  });

  // ===============================
  // 2) Carouseles externos (Projects / Experience)
  // ===============================
  document.querySelectorAll('.section-slider-container').forEach(container => {
    const viewport = container.querySelector('.main-slider');
    const prevBtn = container.querySelector('.sec-prev');
    const nextBtn = container.querySelector('.sec-next');

    if (!viewport) return;

    const items = Array.from(viewport.querySelectorAll('.slider-item'));

    setupSnapCarousel({
      viewport,
      items,
      prevBtn,
      nextBtn
    });
  });

  // ===============================
  // 3) Smooth scroll navbar (igual que antes)
  // ===============================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

});
