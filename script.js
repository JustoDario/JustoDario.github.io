// Opcional: Puedes añadir botones de flechas para los sliders si quieres, 
// pero por ahora funcionan con scroll lateral (táctil o ratón).
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});