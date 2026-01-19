document.addEventListener('DOMContentLoaded', () => {
    // 1. Botones INTERIORES (Fotos dentro de un proyecto)
    const carouselContainers = document.querySelectorAll('.carousel-container');
    carouselContainers.forEach(container => {
        const track = container.querySelector('.media-carousel');
        const nextBtn = container.querySelector('.next-btn');
        const prevBtn = container.querySelector('.prev-btn');

        if (nextBtn && prevBtn && track) {
            nextBtn.addEventListener('click', () => {
                track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
            });
            prevBtn.addEventListener('click', () => {
                track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
            });
        }
    });

    // 2. Botones EXTERIORES (Cambiar de Proyecto/Experiencia)
    // FIX: Ahora sumamos el GAP (40px) para que el scroll sea exacto
    const sectionContainers = document.querySelectorAll('.section-slider-container');
    sectionContainers.forEach(container => {
        const mainSlider = container.querySelector('.main-slider');
        const nextSec = container.querySelector('.sec-next');
        const prevSec = container.querySelector('.sec-prev');

        if (nextSec && prevSec && mainSlider) {
            const gap = 40; // El espacio definido en el CSS

            nextSec.addEventListener('click', () => {
                // Scroll = Ancho de la tarjeta visible + el espacio entre ellas
                const scrollAmount = mainSlider.clientWidth + gap;
                mainSlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });

            prevSec.addEventListener('click', () => {
                const scrollAmount = mainSlider.clientWidth + gap;
                mainSlider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }
    });

    // 3. Smooth scroll para Navbar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
});