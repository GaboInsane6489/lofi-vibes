/* ============================================
    🎧 Lofi Vibes – Controlador de Reproductor
    Autor: Gabriel González
    Descripción: Controla la reproducción de audio,
    barra de progreso y visualización de tiempo.
============================================ */

/* ============================================
    🎧 Contexto de audio global
============================================ */

/* 🔗 Referencias a elementos del DOM */
const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('play-pause');
const currentTime = document.getElementById('current-time');
const duration = document.getElementById('duration');
const seekBar = document.getElementById('seek-bar');

/* 🕒 Formatear segundos a mm:ss */
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
}

/* 📦 Cargar metadatos del audio */
audio.addEventListener('loadedmetadata', () => {
    duration.textContent = formatTime(audio.duration);
    seekBar.max = audio.duration;
});

/* 🔄 Actualizar tiempo y barra de progreso */
audio.addEventListener('timeupdate', () => {
    currentTime.textContent = formatTime(audio.currentTime);
    seekBar.value = audio.currentTime;
});

/* 🎚️ Permitir al usuario adelantar/retroceder */
seekBar.addEventListener('input', () => {
    audio.currentTime = seekBar.value;
});

/* ▶️⏸️ Alternar reproducción/pausa */
playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = '⏸️';
    } else {
        audio.pause();
        playPauseBtn.textContent = '▶️';
    }
});

/* ============================================
    🌌 Visualizador de audio con Canvas
============================================ */

const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

// 🎧 Crear contexto de audio global
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// 🔊 Fuente principal (música lofi)
const source = audioCtx.createMediaElementSource(audio);
const mainAnalyser = audioCtx.createAnalyser();
mainAnalyser.fftSize = 256;
source.connect(mainAnalyser);
mainAnalyser.connect(audioCtx.destination);

// 📦 Datos de visualización
const bufferLength = mainAnalyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// 🎨 Estilo del canvas
canvas.width = canvas.offsetWidth;
canvas.height = 300;

// 🌈 Colores para cada fuente
const ambienceSources = {
    rain: { file: 'assets/audio/rain.mp3', color: '#8be9fd' },
    cafe: { file: 'assets/audio/cafe.mp3', color: '#ffb86c' },
    forest: { file: 'assets/audio/forest.mp3', color: '#50fa7b' },
};

const ambiencePlayers = {};
const analysers = { main: mainAnalyser };

    // 🔁 Configurar cada sonido ambiental
    for (const key in ambienceSources) {
        const audio = new Audio(ambienceSources[key].file);
        audio.loop = true;
        audio.volume = 0.4;

        const source = audioCtx.createMediaElementSource(audio);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;

        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        ambiencePlayers[key] = audio;
        analysers[key] = analyser;
    }

// 🎛️ Control de botones ambientales
document.querySelectorAll('#ambience button').forEach(btn => {
    btn.addEventListener('click', () => {
        const sound = btn.dataset.sound;
        const audio = ambiencePlayers[sound];

    if (audio.paused) {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        audio.play();
        btn.classList.add('active');
        } else {
            audio.pause();
            btn.classList.remove('active');
        }
    });
});

// 🖌️ Dibujar visuales combinados
function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;
    const amplitude = 100;
    const frequency = 0.02;

    // Fondo degradado
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e1e2f');
    gradient.addColorStop(1, '#2c2c3e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 🔄 Dibujar cada fuente activa
    for (const key in analysers) {
        const analyser = analysers[key];
        const color = ambienceSources[key]?.color || 'rgba(255, 184, 108, 0.8)';
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);

        ctx.beginPath();
        ctx.moveTo(0, centerY);

        for (let x = 0; x < canvas.width; x++) {
            const i = Math.floor((x / canvas.width) * data.length);
            const value = data[i] / 255;
            const y = centerY + Math.sin(x * frequency) * amplitude * value;
            ctx.lineTo(x, y);
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        console.log(key, data);
    }
}

// 🚀 Iniciar visualizador al reproducir música principal
audio.addEventListener('play', () => {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    drawVisualizer();
});


/* ============================================
    🎠 Inicializar Swiper.js para galería
============================================ */
const swiper = new Swiper('.mySwiper', {
    loop: true,
    spaceBetween: 20,
    centeredSlides: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

async function loadLofiImages() {
    const accessKey = 'TU_ACCESS_KEY_DE_UNSPLASH';
    const response = await fetch(`https://api.unsplash.com/search/photos?query=lofi&per_page=5&client_id=${accessKey}`);
    const data = await response.json();

    const swiperWrapper = document.querySelector('.swiper-wrapper');
    swiperWrapper.innerHTML = ''; // Limpia imágenes anteriores

    data.results.forEach(photo => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `<img src="${photo.urls.regular}" alt="${photo.alt_description || 'Imagen lofi'}" />`;
        swiperWrapper.appendChild(slide);
    });

    // Reinicia Swiper
    if (window.swiper) window.swiper.destroy(true, true);
    window.swiper = new Swiper('.mySwiper', {
        loop: true,
        spaceBetween: 20,
        centeredSlides: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
        el: '.swiper-pagination',
        clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}

document.addEventListener('DOMContentLoaded', loadLofiImages);

document.querySelectorAll('#ambience button').forEach(btn => {
    btn.addEventListener('click', () => {
        const sound = btn.dataset.sound;
        const audio = ambiencePlayers[sound];
        if (audio.paused) {
            audio.play();
            btn.classList.add('active');
        } else {
            audio.pause();
            btn.classList.remove('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const hour = new Date().getHours();
    if (hour >= 19 || hour < 6) {
        document.body.classList.add('night-mode');
    }
});


/* ============================================
    🖼️ Galería dinámica con Unsplash API
    Autor: Gabriel González
    Descripción: Carga imágenes lofi desde Unsplash
    y las integra al carrusel Swiper.js
============================================ */

async function loadLofiImages() {
    const accessKey = 'bTNeZ1RzdsdjJ0bfV72nQ9aImFatOcaA-Xdg_m6wt9o'; // 🔐 

    try {
        // 📡 Solicitud a la API de Unsplash
        const response = await fetch(`https://api.unsplash.com/search/photos?query=lofi&per_page=5&client_id=${accessKey}`);
        const data = await response.json();

        // 🎯 Selecciona el contenedor del carrusel
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        swiperWrapper.innerHTML = ''; // 🧹 Limpia imágenes anteriores

        // 🖼️ Crea y agrega cada imagen como slide
        data.results.forEach(photo => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
            <img src="${photo.urls.regular}" 
                alt="${photo.alt_description || 'Imagen lofi'}" 
                loading="lazy" />
            `;
        swiperWrapper.appendChild(slide);
        });

        // 🔄 Reinicia Swiper para que reconozca los nuevos slides
        if (window.swiper) window.swiper.destroy(true, true);
            window.swiper = new Swiper('.mySwiper', {
            loop: true,
            spaceBetween: 20,
            centeredSlides: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

    } catch (error) {
        console.error('❌ Error al cargar imágenes desde Unsplash:', error);
    }
}

// 🚀 Ejecutar al cargar el DOM
document.addEventListener('DOMContentLoaded', loadLofiImages);

/* ============================================
    🌧️ Sonidos ambientales (lluvia, café, bosque)
============================================ */

const AmbiencePlayers = {
    rain: new Audio('assets/audio/rain.mp3'),
    cafe: new Audio('assets/audio/cafe.mp3'),
    forest: new Audio('assets/audio/forest.mp3'),
};

Object.values(AmbiencePlayers).forEach(audio => {
    audio.loop = true;
    audio.volume = 0.4;
});

document.querySelectorAll('#ambience button').forEach(btn => {
    btn.addEventListener('click', () => {
    const sound = btn.dataset.sound;
    const audio = AmbiencePlayers[sound];

    if (audio.paused) {
        audio.play();
        btn.classList.add('active');
    } else {
        audio.pause();
        btn.classList.remove('active');
    }
    });
});

/* ============================================
    🌌 Cielo estrellado animado
============================================ */

const starsCanvas = document.getElementById('stars-canvas');
const starsCtx = starsCanvas.getContext('2d');

let stars = [];
let shootingStars = [];

function resizeCanvas() {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * starsCanvas.width,
            y: Math.random() * starsCanvas.height,
            radius: Math.random() * 1.2,
            alpha: Math.random(),
            speed: Math.random() * 0.2 + 0.05,
        });
    }
}

function createShootingStar() {
    shootingStars.push({
        x: Math.random() * starsCanvas.width,
        y: Math.random() * starsCanvas.height * 0.5,
        length: Math.random() * 80 + 100,
        speed: Math.random() * 10 + 6,
        alpha: 1,
    });
}

function drawStars() {
    starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);

    // Fondo transparente
    starsCtx.fillStyle = 'rgba(0, 0, 0, 0)';
    starsCtx.fillRect(0, 0, starsCanvas.width, starsCanvas.height);

    // Estrellas fijas
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > starsCanvas.height) star.y = 0;

        starsCtx.beginPath();
        starsCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        starsCtx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        starsCtx.fill();
    });

    // Estrellas fugaces
    shootingStars.forEach((s, i) => {
        s.x += s.speed;
        s.y += s.speed * 0.3;
        s.alpha -= 0.01;

        starsCtx.strokeStyle = `rgba(255, 255, 255, ${s.alpha})`;
        starsCtx.lineWidth = 2;
        starsCtx.beginPath();
        starsCtx.moveTo(s.x, s.y);
        starsCtx.lineTo(s.x - s.length, s.y - s.length * 0.3);
        starsCtx.stroke();

        if (s.alpha <= 0) shootingStars.splice(i, 1);
    });

    requestAnimationFrame(drawStars);
}

createStars(150);
setInterval(createShootingStar, 5000);
drawStars();