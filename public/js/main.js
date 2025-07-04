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

    ctx.fillStyle = '#1e1e2f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        const r = 255;
        const g = 184;
        const b = 108;

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }
}

// Iniciar visualizador al reproducir
audio.addEventListener('play', () => {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    drawVisualizer();
});