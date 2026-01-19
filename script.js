document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica para los botones de los carruseles
    const carouselContainers = document.querySelectorAll('.carousel-container');

    carouselContainers.forEach(container => {
        const track = container.querySelector('.media-carousel');
        const nextBtn = container.querySelector('.next-btn');
        const prevBtn = container.querySelector('.prev-btn');

        if (nextBtn && prevBtn && track) {
            nextBtn.addEventListener('click', () => {
                const width = track.clientWidth;
                track.scrollBy({ left: width, behavior: 'smooth' });
            });

            prevBtn.addEventListener('click', () => {
                const width = track.clientWidth;
                track.scrollBy({ left: -width, behavior: 'smooth' });
            });
        }
    });

    // 2. Smooth scroll para los enlaces del Navbar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});