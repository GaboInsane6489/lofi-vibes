/* ============================================
    🎧 Lofi Vibes – Controlador de Reproductor
    Autor: Gabriel González
    Descripción: Controla la reproducción de audio,
    barra de progreso y visualización de tiempo.
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

// Crear contexto de audio y analizador
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const source = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();

source.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Estilo del canvas
canvas.width = window.innerWidth * 0.9;
canvas.height = 300;

function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;
    const amplitude = 100;
    const frequency = 0.02;

    ctx.beginPath();
    
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e1e2f');
    gradient.addColorStop(1, '#2c2c3e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    ctx.moveTo(0, centerY);

    for (let x = 0; x < canvas.width; x++) {
        const i = Math.floor((x / canvas.width) * bufferLength);
        const value = dataArray[i] / 255;
        const y = centerY + Math.sin(x * frequency) * amplitude * value;
        ctx.lineTo(x, y);
    }

    ctx.strokeStyle = 'rgba(255, 184, 108, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
}


// Iniciar visualizador al reproducir
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

const ambiencePlayers = {
    rain: new Audio('assets/audio/rain.mp3'),
    cafe: new Audio('assets/audio/cafe.mp3'),
    forest: new Audio('assets/audio/forest.mp3'),
};

Object.values(ambiencePlayers).forEach(audio => {
    audio.loop = true;
    audio.volume = 0.4;
});

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



