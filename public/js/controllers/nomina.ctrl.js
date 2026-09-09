import { initLayout } from './layout.ctrl.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = initLayout('nomina');
    if (!user) return;

    // Lógica exclusiva de nómina...
});
