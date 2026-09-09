import { initLayout } from './layout.ctrl.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = initLayout('feedback');
    if (!user) return;

    // Lógica exclusiva de retroalimentación...
});
