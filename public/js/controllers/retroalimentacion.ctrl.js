import { initLayout } from './layout.ctrl.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = initLayout('retroalimentacion');
    if (!user) return;

    // Lógica exclusiva de retroalimentación...
});