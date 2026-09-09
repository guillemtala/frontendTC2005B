import { initLayout } from './layout.ctrl.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = initLayout('datos');
    if (!user) return;

    // Lógica exclusiva de datos generales...
});
