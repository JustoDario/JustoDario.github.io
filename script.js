document.addEventListener('DOMContentLoaded', () => {
    // 1. Botones INTERIORES (Fotos dentro de un proyecto)
    const carouselContainers = document.querySelectorAll('.carousel-container');
    carouselContainers.forEach(container => {
        const track = container.querySelector('.media-carousel');
        const nextBtn = container.querySelector('.next-btn');
        const prevBtn = container.querySelector('.prev-btn');

        if (nextBtn && prevBtn && track) {
            nextBtn.addEventListener('click', () => {
                // Usamos scrollBy con el ancho exacto del track
                track.scrollBy({ left: track.offsetWidth, behavior: 'smooth' });
            });
            prevBtn.addEventListener('click', () => {
                track.scrollBy({ left: -track.offsetWidth, behavior: 'smooth' });
            });
        }
    });

    // 2. Botones EXTERIORES (Cambiar de Proyecto/Experiencia)
    const sectionContainers = document.querySelectorAll('.section-slider-container');
    sectionContainers.forEach(container => {
        const mainSlider = container.querySelector('.main-slider');
        const nextSec = container.querySelector('.sec-next');
        const prevSec = container.querySelector('.sec-prev');

        if (nextSec && prevSec && mainSlider) {
            const gap = 40; 

            nextSec.addEventListener('click', () => {
                // Obtenemos el ancho real de una tarjeta (slider-item)
                const itemWidth = mainSlider.querySelector('.slider-item').offsetWidth;
                mainSlider.scrollBy({ left: itemWidth + gap, behavior: 'smooth' });
            });

            prevSec.addEventListener('click', () => {
                const itemWidth = mainSlider.querySelector('.slider-item').offsetWidth;
                mainSlider.scrollBy({ left: -(itemWidth + gap), behavior: 'smooth' });
            });
        }
    });

    // 3. Smooth scroll para Navbar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80; // Ajuste para que no tape el título la navbar
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