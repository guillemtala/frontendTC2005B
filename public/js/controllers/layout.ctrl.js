import { AuthModel } from '../models/auth.model.js';
import { renderSidebar } from '../views/sidebar.view.js';

export function initLayout(activeRoute) {
    const user = AuthModel.getCurrentUser();
    if (!user) {
        window.location.replace('/');
        return null;
    }

    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = renderSidebar(activeRoute);
    }

    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            AuthModel.logout();
            window.location.replace('/');
        });
    }

    initNavigationEvents();
    return user;
}

function initNavigationEvents() {
    const bellBtn = document.getElementById('btn-notifications');
    const dropdownMenu = document.getElementById('dropdown-notifications');

    if (bellBtn && dropdownMenu) {
        bellBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });

        document.addEventListener('click', (event) => {
            if (dropdownMenu.classList.contains('show')
                && !dropdownMenu.contains(event.target)
                && event.target !== bellBtn) {
                dropdownMenu.classList.remove('show');
            }
        });
    }

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
