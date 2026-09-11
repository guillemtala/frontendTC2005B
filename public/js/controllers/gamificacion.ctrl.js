import { initLayout } from './layout.ctrl.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = initLayout('gamificacion');
    if (!user) return;

    // Botón Jugar Ahora (Juego de Unity)
    const btnJugar = document.getElementById('btn-jugar-now');
    if (btnJugar) {
        btnJugar.addEventListener('click', () => {
            alert('🎮 Iniciando cargador del contenedor de Unity WebGL...\n\n¡El minijuego diario estará disponible en este espacio!');
        });
    }

    // Botón Reclamar Recompensa Diaria
    const btnReclamar = document.getElementById('btn-reclamar-recompensa');
    if (btnReclamar) {
        btnReclamar.addEventListener('click', () => {
            btnReclamar.disabled = true;
            btnReclamar.textContent = '✓ Recompensa de Hoy Reclamada (+50 Pts)';
            btnReclamar.className = 'btn btn-outline';
            btnReclamar.style.color = '#059669';
            btnReclamar.style.borderColor = '#059669';
            alert('🎉 ¡Felicidades! Has reclamado tus +50 puntos de racha diaria de acceso.');
        });
    }
});
