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