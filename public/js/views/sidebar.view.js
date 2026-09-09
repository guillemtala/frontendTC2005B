export function renderSidebar(activeRoute = 'inicio') {
    const routes = [
        { id: 'inicio', name: 'Inicio', href: '/pages/main.html', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>' },
        { id: 'vacaciones', name: 'Vacaciones', href: '/pages/vacaciones.html', icon: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>' },
        { id: 'solicitudes', name: 'Solicitudes', href: '/pages/solicitudes.html', icon: '<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><polyline points="3 6 4 7 6 5"></polyline><polyline points="3 12 4 13 6 11"></polyline><polyline points="3 18 4 19 6 17"></polyline>' },
        { id: 'nomina', name: 'Recibos de Nómina', href: '/pages/nomina.html', icon: '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>' },
        { id: 'datos-generales', name: 'Datos Generales', href: '/pages/datos-generales.html', icon: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>' },
        { id: 'kardex', name: 'Kárdex de Asistencia', href: '/pages/kardex.html', icon: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>' },
        { id: 'tiempo-laborado', name: 'Tiempo Laborado', href: '/pages/tiempo-laborado.html', icon: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>' },
        { id: 'capacitacion', name: 'Capacitación', href: '/pages/capacitacion.html', icon: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>' },
        { id: 'prestamos', name: 'Préstamos y Créditos', href: '/pages/prestamos.html', icon: '<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>' },
        { id: 'noticias', name: 'Noticias', href: '/pages/noticias.html', icon: '<path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M2 15h10"></path><path d="M2 19h10"></path>' },
        { id: 'retroalimentacion', name: 'Retroalimentación', href: '/pages/retroalimentacion.html', icon: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>' },
        { id: 'gamificacion', name: 'Gamificación', href: '/pages/gamificacion.html', icon: '<polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon>' },
        { id: 'perfil', name: 'Perfil', href: '/pages/perfil.html', icon: '<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>' }
    ];

    return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <h2 style="color: var(--primary-dark); font-size: 1.1rem; display: flex; align-items: center; gap: 8px; margin-bottom: 0;">
          <span style="background: var(--primary-dark); color: white; padding: 4px; border-radius: 6px; display: flex;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.5 19c2.5 0 4.5-2 4.5-4.5a4.5 4.5 0 0 0-4-4.47A7 7 0 0 0 4 12.5c0 3.6 2.9 6.5 6.5 6.5h7z"></path></svg>
          </span>
          ESLABÓN CLOUD
        </h2>
        <small style="color: var(--text-muted); font-size: 0.65rem; letter-spacing: 0.5px; margin-left: 32px; display: block;">BY PEOPLETECH</small>
      </div>

      <div class="menu-label">MENÚ PRINCIPAL</div>

      <ul class="sidebar-menu">
        ${routes.map(item => `
          <li>
            <a href="${item.href}" class="sidebar-link ${activeRoute === item.id ? 'active' : ''}">
              <svg viewBox="0 0 24 24">${item.icon}</svg>
              ${item.name}
            </a>
          </li>
        `).join('')}
      </ul>
      
      <div style="margin-top: auto; padding: 1.5rem;">
        <button type="button" id="btn-logout" class="sidebar-link" style="background: none; border: none; width: 100%; cursor: pointer; text-align: left; color: var(--text-muted); font-family: inherit;">
            <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Cerrar Sesión
        </button>
        </div>
    </aside>
  `;
}