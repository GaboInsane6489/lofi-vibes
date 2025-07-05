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
============================================ */


document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.story-frame').forEach(frame => {
        observer.observe(frame);
    });
});

/* ============================================
    🎛️ Controles de scroll narrativo
    Descripción: Botones flotantes para navegar
    entre bloques de historia lofi
============================================ */
document.addEventListener("DOMContentLoaded", () => {
    const frames = Array.from(document.querySelectorAll('.story-frame'));
    let currentIndex = 0;

    const scrollToFrame = (index) => {
        if (frames[index]) {
            frames[index].scrollIntoView({ behavior: 'smooth' });
            currentIndex = index;
        }
    };

    document.getElementById('scroll-up').addEventListener('click', () => {
        scrollToFrame(Math.max(currentIndex - 1, 0));
    });

    document.getElementById('scroll-down').addEventListener('click', () => {
        scrollToFrame(Math.min(currentIndex + 1, frames.length - 1));
    });
});


