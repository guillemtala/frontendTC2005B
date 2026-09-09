import { initLayout } from './layout.ctrl.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = initLayout('vacaciones');
    if (!user) return;

    // Lógica exclusiva de vacaciones...
});
