import { AuthModel } from '../models/auth.model.js';
import { renderSidebar } from '../views/sidebar.view.js';
import { renderNavbar } from '../views/navbar.view.js';

const THEME_KEY = 'eslabon_theme_preference';

export function initLayout(activeRoute = 'inicio') {
    
    const currentUser = AuthModel.getCurrentUser();
    if (!currentUser) {
        window.location.replace('/');
        return null;
    }

    const is2FA = localStorage.getItem('eslabon_2fa_verified') === 'true';
    if (!is2FA) {
        window.location.replace('/pages/2fa.html');
        return null;
    }

    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = renderSidebar(activeRoute);
    }

    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        if (navbarContainer.tagName === 'NAV') {
            navbarContainer.innerHTML = renderNavbar(currentUser);
        } else {
            const tempWrapper = document.createElement('div');
            tempWrapper.innerHTML = renderNavbar(currentUser).trim();
            navbarContainer.replaceWith(tempWrapper.firstElementChild);
        }
    }

    bindGlobalEvents();

    return currentUser;
}

function bindGlobalEvents() {
    applyThemePreference();

    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.documentElement.classList.toggle('dark-mode');
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
            updateThemeIcon(isDark);
        });
    }

    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            AuthModel.logout();
            window.location.replace('/');
        });
    }

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

function applyThemePreference() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const isDark = savedTheme === 'dark';
    if (isDark) {
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
    } else {
        document.documentElement.classList.remove('dark-mode');
        document.body.classList.remove('dark-mode');
    }
    updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
    const iconEl = document.getElementById('theme-toggle-icon');
    if (!iconEl) return;
    if (isDark) {
        iconEl.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
        iconEl.setAttribute('stroke', '#FBBF24');
    } else {
        iconEl.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
        iconEl.setAttribute('stroke', 'var(--primary-dark)');
    }
}