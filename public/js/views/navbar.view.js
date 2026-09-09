export function renderNavbar(user) {
    let avatarSrc;
    let userName;
    let userRole;
    if (user) {
        avatarSrc = user.avatar || '/assets/default-user.png?id=default';
        userName = user.name || 'Colaborador';
        userRole = `Nómina: #${user.id} • ${user.role}`;
    } else {
        avatarSrc = '/assets/default-user.png?id=default';
        userName = 'Colaborador';
        userRole = 'Cargando...';
    }

    return `
    <nav class="top-navbar">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <button class="btn-menu-mobile" id="btn-menu" type="button" aria-label="Abrir menú">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <div class="mobile-logo">
          <h2 style="color: var(--primary-dark); font-size: 1.1rem; display: flex; align-items: center; gap: 8px; margin-bottom: 0;">
            <span style="background: var(--primary-dark); color: white; padding: 4px; border-radius: 6px; display: flex;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.5 19c2.5 0 4.5-2 4.5-4.5a4.5 4.5 0 0 0-4-4.47A7 7 0 0 0 4 12.5c0 3.6 2.9 6.5 6.5 6.5h7z"></path></svg>
            </span>
            ESLABÓN
          </h2>
        </div>
      </div>

      <div class="header-actions">
        <div class="dropdown">
          <button class="btn-icon" id="btn-notifications" type="button" aria-label="Notificaciones">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-dark)" stroke-width="2" stroke-linecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span class="badge-dot"></span>
          </button>
          <div class="dropdown-menu" id="dropdown-notifications">
            <div class="dropdown-header">Notificaciones (2)</div>
            <a href="/pages/vacaciones.html" class="dropdown-item">
              <span class="notif-title"> Solicitud de vacaciones aprobada</span>
              <span class="notif-time">Hoy, 09:30 AM</span>
            </a>
            <a href="/pages/nomina.html" class="dropdown-item">
              <span class="notif-title"> Nuevo recibo de nómina (Q2 Ago) </span>
              <span class="notif-time">Ayer, 03:15 PM</span>
            </a>
          </div>
        </div>

        <div class="user-profile">
          <div class="user-info">
            <span class="user-name" id="user-display-name" style="font-size: 1.1rem; font-weight: 700;">${userName}</span>
            <span class="user-role" id="user-display-role" style="font-size: 0.8rem;">${userRole}</span>
          </div>
          <img id="user-display-avatar" src="${avatarSrc}" alt="Foto de perfil de ${userName}" class="avatar">
        </div>
      </div>
    </nav>
  `;
}