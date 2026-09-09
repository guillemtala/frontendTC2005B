import { AuthModel } from '../models/auth.model.js';
import { renderSidebar } from '../views/sidebar.view.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificación síncrona instantánea de sesión
    const currentUser = AuthModel.getCurrentUser();
    if (!currentUser) {
        window.location.replace('/');
        return;
    }

    // 2. Inyectar el menú lateral dinámicamente
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = renderSidebar('inicio');
    }

    // 3. Vincular el botón de Cerrar Sesión del sidebar
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            AuthModel.logout();
            window.location.replace('/');
        });
    }

    // 4. Inicializar eventos de la barra de navegación y notificaciones
    initNavigationEvents();
});

function initNavigationEvents() {
    // Notificaciones Dropdown
    const bellBtn = document.getElementById('btn-notifications');
    const dropdownMenu = document.getElementById('dropdown-notifications');

    if (bellBtn && dropdownMenu) {
        bellBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (dropdownMenu.classList.contains('show') && !dropdownMenu.contains(e.target) && e.target !== bellBtn) {
                dropdownMenu.classList.remove('show');
            }
        });
    }

    // Menú hamburguesa y overlay móvil
    const btnMenu = document.getElementById('btn-menu');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('menu-overlay');

    if (btnMenu && sidebar && overlay) {
        const toggleMenu = () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('show');
        };

        btnMenu.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
    }
}