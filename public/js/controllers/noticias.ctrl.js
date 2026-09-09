import { initLayout } from './layout.ctrl.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = initLayout('noticias');
    if (!user) return;

    // Lógica exclusiva de noticias...
});
