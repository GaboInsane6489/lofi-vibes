document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Solo una vez
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.video-card').forEach(card => {
        observer.observe(card);
    });
});

/* ============================================
    📜 Scroll narrativo: Historias lofi
    Descripción: IntersectionObserver para animar
    cada bloque de historia al entrar en pantalla
    y botones flotantes para navegar entre bloques
============================================ */

document.addEventListener("DOMContentLoaded", () => {
    // Animación al hacer scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });

    const frames = Array.from(document.querySelectorAll('.story-frame'));
    frames.forEach(frame => observer.observe(frame));

});

