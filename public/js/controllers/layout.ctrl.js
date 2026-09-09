import { AuthModel } from '../models/auth.model.js';
import { renderSidebar } from '../views/sidebar.view.js';
import { renderNavbar } from '../views/navbar.view.js';

export function initLayout(activeRoute = 'inicio') {
    // 1. Guardia de autenticación instantáneo
    const currentUser = AuthModel.getCurrentUser();
    if (!currentUser) {
        window.location.replace('/');
        return null;
    }

    // 2. Inyectar Menú Lateral
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = renderSidebar(activeRoute);
    }

    // 3. Inyectar Top Navbar respetando la jerarquía para sticky
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        // Si en el HTML dejaste <nav class="top-navbar" id="navbar-container">
        if (navbarContainer.tagName === 'NAV') {
            navbarContainer.innerHTML = renderNavbar(currentUser);
        } else {
            // Si dejaste un <div>, lo reemplazamos por el nodo real para no romper position: sticky
            const tempWrapper = document.createElement('div');
            tempWrapper.innerHTML = renderNavbar(currentUser).trim();
            navbarContainer.replaceWith(tempWrapper.firstElementChild);
        }
    }

    // 4. Configurar eventos globales
    bindGlobalEvents();

    // Devolvemos el usuario actual por si la página necesita su ID o rol
    return currentUser;
}

function bindGlobalEvents() {
    // Cerrar sesión
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            AuthModel.logout();
            window.location.replace('/');
        });
    }

    // Dropdown de Notificaciones
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

    // Menú Hamburguesa Móvil
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