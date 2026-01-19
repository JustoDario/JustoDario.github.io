document.addEventListener('DOMContentLoaded', () => {
    // 1. Botones INTERIORES
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

    // 2. Botones EXTERIORES
    const sectionContainers = document.querySelectorAll('.section-slider-container');
    sectionContainers.forEach(container => {
        const mainSlider = container.querySelector('.main-slider');
        const nextSec = container.querySelector('.sec-next');
        const prevSec = container.querySelector('.sec-prev');

        if (nextSec && prevSec && mainSlider) {
            nextSec.addEventListener('click', () => {
                mainSlider.scrollBy({ left: mainSlider.clientWidth, behavior: 'smooth' });
            });
            prevSec.addEventListener('click', () => {
                mainSlider.scrollBy({ left: -mainSlider.clientWidth, behavior: 'smooth' });
            });
        }
    });

    // 3. Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
});