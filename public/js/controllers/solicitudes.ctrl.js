import { initLayout } from './layout.ctrl.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = initLayout('solicitudes');
    if (!user) return;

    // Lógica exclusiva de solicitudes...
});
