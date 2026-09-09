import { initLayout } from './layout.ctrl.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = initLayout('inicio');
    if (!user) return; // Si no hay sesión, layout ya redirige a '/'

    // Lógica exclusiva de la página de Inicio...
});