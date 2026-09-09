import { initLayout } from './layout.ctrl.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = initLayout('perfil');
    if (!user) return;

    // Lógica exclusiva de perfil...
});
