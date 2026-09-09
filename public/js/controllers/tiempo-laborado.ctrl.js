import { initLayout } from './layout.ctrl.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = initLayout('tiempo-laborado');
    if (!user) return;

    // Lógica exclusiva de tiempo laborado...
});