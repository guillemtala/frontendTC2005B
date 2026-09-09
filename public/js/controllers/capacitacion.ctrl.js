import { initLayout } from './layout.ctrl.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = initLayout('capacitacion');
    if (!user) return;

    // Lógica exclusiva de capacitación...
});
