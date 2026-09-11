import { initLayout } from './layout.ctrl.js';
import { AttendanceModel } from '../models/attendance.model.js';

let currentDate = new Date(2026, 8, 1);

document.addEventListener('DOMContentLoaded', () => {
    const user = initLayout('kardex');
    if (!user) return;

    // Reloj digital
    startLiveClock();

    // KPIs
    renderKPIs();

    // Calendario y bitácora
    renderCalendar(currentDate);
    renderDetailedTable();
    updateButtonStates();

    // Navegación de mes
    const prevBtn = document.getElementById('cal-prev-month');
    const nextBtn = document.getElementById('cal-next-month');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar(currentDate);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar(currentDate);
        });
    }

    // Botones entrada/salida (Clickeables demostrativos)
    const checkInBtn = document.getElementById('btn-checkin');
    const checkOutBtn = document.getElementById('btn-checkout');

    if (checkInBtn) {
        checkInBtn.addEventListener('click', () => {
            alert('¡Asistencia (Entrada) marcada exitosamente a las 08:00 AM!');
        });
    }

    if (checkOutBtn) {
        checkOutBtn.addEventListener('click', () => {
            alert('¡Salida marcada exitosamente a las 06:00 PM!');
        });
    }
});

function startLiveClock() {
    const clockTimeEl = document.getElementById('live-clock-time');
    const clockDateEl = document.getElementById('live-clock-date');

    const update = () => {
        const now = new Date();
        if (clockTimeEl) {
            clockTimeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }
        if (clockDateEl) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            clockDateEl.textContent = now.toLocaleDateString('es-MX', options);
        }
    };

    update();
    setInterval(update, 1000);
}

function renderKPIs() {
    const stats = AttendanceModel.getStatsTiempoLaborado();

    const kpiHoras = document.getElementById('kpi-horas-laboradas');
    const kpiTasa = document.getElementById('kpi-tasa-asistencia');
    const kpiExtra = document.getElementById('kpi-horas-extra');
    const kpiPromedio = document.getElementById('kpi-promedio-entrada');

    if (kpiHoras) kpiHoras.textContent = `${stats.horasTotales.toFixed(1)} hrs`;
    if (kpiTasa) kpiTasa.textContent = `${stats.tasaAsistencia}%`;
    if (kpiExtra) kpiExtra.textContent = `${stats.horasExtra.toFixed(1)} hrs`;
    if (kpiPromedio) kpiPromedio.textContent = stats.promedioEntrada;
}

function renderCalendar(date) {
    const container = document.getElementById('cal-days-container');
    const title = document.getElementById('cal-month-title');
    if (!container || !title) return;

    const records = AttendanceModel.getAllRecords() || {};
    const year = date.getFullYear();
    const month = date.getMonth();

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    title.textContent = `${monthNames[month]} ${year}`;

    container.innerHTML = '';

    const firstDayIndex = new Date(year, month, 1).getDay();
    const startingDay = (firstDayIndex === 0 ? 6 : firstDayIndex - 1);
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    for (let i = startingDay - 1; i >= 0; i--) {
        const dayNum = prevMonthTotalDays - i;
        const prevDate = new Date(year, month - 1, dayNum);
        const key = formatDateKey(prevDate);
        container.appendChild(createDayCell(dayNum, records[key] || 'default other-month'));
    }

    for (let day = 1; day <= totalDays; day++) {
        const thisDate = new Date(year, month, day);
        const key = formatDateKey(thisDate);
        container.appendChild(createDayCell(day, records[key] || 'default'));
    }

    const totalRendered = startingDay + totalDays;
    const targetTotal = totalRendered > 35 ? 42 : 35;
    const remainingCells = targetTotal - totalRendered;

    for (let day = 1; day <= remainingCells; day++) {
        const nextDate = new Date(year, month + 1, day);
        const key = formatDateKey(nextDate);
        container.appendChild(createDayCell(day, records[key] || 'default other-month'));
    }
}

function createDayCell(dayNumber, statusClass) {
    const cell = document.createElement('div');
    cell.className = `cal-day ${statusClass}`;
    cell.textContent = dayNumber;
    return cell;
}

function renderDetailedTable() {
    const tableBody = document.getElementById('detailed-attendance-table-body');
    if (!tableBody) return;

    const logs = AttendanceModel.getDetailedLogs();

    if (logs.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center" style="padding: 2rem; color: var(--text-muted);">
                    No hay registros de asistencia en la bitácora.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = logs.map(log => {
        let badgeClass = 'badge-success';
        if (log.estado === 'Retardo') badgeClass = 'badge-warning';
        if (log.estado === 'Falta') badgeClass = 'badge-danger';

        return `
            <tr>
                <td>
                    <div style="font-weight: 700; color: var(--primary-dark);">${log.dia} ${log.fecha}</div>
                </td>
                <td class="text-center font-mono">${log.entrada}</td>
                <td class="text-center font-mono">${log.salida}</td>
                <td class="text-center font-mono">${log.ordinarias ? log.ordinarias.toFixed(1) : '0.0'} hrs</td>
                <td class="text-center font-mono" style="color: #2563EB;">${log.extra ? log.extra.toFixed(1) : '0.0'} hrs</td>
                <td class="text-center font-mono" style="font-weight: 700;">${log.total ? log.total.toFixed(1) : '0.0'} hrs</td>
                <td style="font-size: 0.85rem; color: var(--text-muted);">${log.metodo}</td>
                <td class="text-center">
                    <span class="badge ${badgeClass}">
                        ${log.estado}
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

function updateButtonStates() {
    const checkInBtn = document.getElementById('btn-checkin');
    const checkOutBtn = document.getElementById('btn-checkout');
    const metaCheckIn = document.getElementById('time-meta-checkin');
    const metaCheckOut = document.getElementById('time-meta-checkout');
    const badgeTurno = document.getElementById('badge-turno-status');

    if (checkInBtn) {
        checkInBtn.disabled = false;
        checkInBtn.style.cursor = 'pointer';
    }

    if (checkOutBtn) {
        checkOutBtn.disabled = false;
        checkOutBtn.style.cursor = 'pointer';
    }

    if (metaCheckIn) metaCheckIn.textContent = '08:00 AM';
    if (metaCheckOut) metaCheckOut.textContent = '06:00 PM';
    if (badgeTurno) {
        badgeTurno.textContent = 'En Turno';
        badgeTurno.style.backgroundColor = '#10B981';
    }
}

function formatDateKey(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getTodayKey() {
    const now = new Date();
    return `2026-09-${String(now.getDate()).padStart(2, '0')}`;
}