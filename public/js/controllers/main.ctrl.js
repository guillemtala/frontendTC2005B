import { initLayout } from './layout.ctrl.js';
import { SolicitudesModel } from '../models/solicitudes.model.js';

document.addEventListener('DOMContentLoaded', async () => {
    const user = initLayout('inicio');
    if (!user) return;

    const nombre = document.getElementById('bienvenida-text');
    if (nombre) {
        nombre.textContent = `¡Bienvenido de vuelta, ${user.name}!`;
    }

    const btnSolicitar = document.getElementById('solicitar-dia');
    if (btnSolicitar) {
        btnSolicitar.addEventListener('click', () => {
            window.location.href = '/pages/solicitudes.html?tab=vacaciones';
        });
    }

    const cardMap = {
        'card-action-solicitudes': '/pages/solicitudes.html',
        'card-action-nomina': '/pages/nomina.html',
        'card-action-kardex': '/pages/kardex.html',
        'card-action-noticias': '/pages/noticias.html',
        'card-action-gamificacion': '/pages/gamificacion.html',
        'card-action-perfil': '/pages/perfil.html'
    };

    Object.entries(cardMap).forEach(([id, href]) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', () => {
                window.location.href = href;
            });
        }
    });

    const solicitudes = await SolicitudesModel.getAllSolicitudes();
    const count = Array.isArray(solicitudes) ? solicitudes.length : 0;
    const numSolEl = document.getElementById('num-sol');

    if (numSolEl) {
        numSolEl.textContent = `${count} solicitud${count !== 1 ? 'es' : ''}`;
    }
});