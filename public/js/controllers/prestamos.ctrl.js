import { initLayout } from './layout.ctrl.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = initLayout('prestamos');
    if (!user) return;

    // Lógica exclusiva de préstamos y créditos...
});
