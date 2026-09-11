import { initLayout } from './layout.ctrl.js';
import { fetchWithAuth } from '../config.js';
import { resolveLocalAvatar } from '../models/auth.model.js';

document.addEventListener('DOMContentLoaded', async () => {
    const sessionUser = initLayout('perfil');
    if (!sessionUser) return;

    const btnSolicitarCambio = document.getElementById('btn-solicitar-cambio-perfil');
    if (btnSolicitarCambio) {
        btnSolicitarCambio.addEventListener('click', () => {
            window.location.href = '/pages/solicitudes.html?tab=actualizacion_datos';
        });
    }

    try {
        const response = await fetchWithAuth('/perfil');
        if (response.ok) {
            const profileData = await response.json();
            renderProfile(profileData);
        } else {
            renderProfile(sessionUser);
        }
    } catch (error) {
        console.warn('Backend API no disponible para /perfil, usando datos de sesión local:', error);
        renderProfile(sessionUser);
    }
});

function renderProfile(data) {
    if (!data) return;

    const nameEl = document.getElementById('perfil-nombre');
    const subtitleEl = document.getElementById('perfil-puesto-dept');
    const avatarEl = document.getElementById('perfil-avatar-img');
    const idEl = document.getElementById('perf-id');
    const puestoEl = document.getElementById('perf-puesto');
    const deptEl = document.getElementById('perf-dept');
    const jefeEl = document.getElementById('perf-jefe');
    const ingresoEl = document.getElementById('perf-ingreso');
    const rfcEl = document.getElementById('perf-rfc');
    const curpEl = document.getElementById('perf-curp');
    const imssEl = document.getElementById('perf-imss');
    const emailEl = document.getElementById('perf-email');
    const rolEl = document.getElementById('perf-rol');
    const abonoEl = document.getElementById('perf-abono');

    const nombre = data.nombre || data.name || 'Juan Pérez';
    const puesto = data.puesto || 'Desarrollador Full Stack';
    const departamento = data.departamento || 'Tecnología e Innovación';

    if (nameEl) nameEl.textContent = nombre;
    if (subtitleEl) subtitleEl.textContent = `${puesto} • ${departamento}`;
    if (avatarEl) {
        const rawAvatar = data.avatar || data.foto;
        const idOrEmail = data.no_empleado || data.id || data.email || data.nombre;
        avatarEl.src = resolveLocalAvatar(rawAvatar, idOrEmail);
        avatarEl.onerror = () => { avatarEl.src = '/assets/default-user.png'; };
    }
    if (idEl) idEl.textContent = data.no_empleado || data.id || 'EP-4091';
    if (puestoEl) puestoEl.textContent = puesto;
    if (deptEl) deptEl.textContent = departamento;
    if (jefeEl) jefeEl.textContent = data.reporta_a || 'Ing. Carlos Mendoza (TI)';
    if (ingresoEl) ingresoEl.textContent = data.fecha_ingreso || '15/01/2022';
    if (rfcEl) rfcEl.textContent = data.rfc || 'PERJ920514HB8';
    if (curpEl) curpEl.textContent = data.curp || 'PERJ920514HDFRRN09';
    if (imssEl) imssEl.textContent = data.imss || '12948572019';
    if (emailEl) emailEl.textContent = data.email || 'juan.perez@eslabon.com';
    if (rolEl) rolEl.textContent = data.rol || data.role || 'Colaborador';
    if (abonoEl) abonoEl.textContent = data.abono_cuenta || 'BBVA - CLABE: 012180015928374910';
}
