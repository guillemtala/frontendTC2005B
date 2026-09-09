import { initLayout } from './layout.ctrl.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = initLayout('gamificacion');
    if (!user) return;

    // Lógica exclusiva de gamificación...
});
