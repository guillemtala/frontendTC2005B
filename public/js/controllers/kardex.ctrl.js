import { AttendanceModel } from '../models/attendance.model.js';
import { initLayout } from './layout.ctrl.js';

// Fecha inicial fijada a Septiembre 2026 (mes 8 = septiembre)
let currentDate = new Date(2026, 8, 1);

document.addEventListener('DOMContentLoaded', () => {
    const user = initLayout('kardex');
    if (!user) return;

    // 5. Renderizar calendario y botones
    renderCalendar(currentDate);
    updateButtonStates();

    // 6. Controles de mes
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

    // 7. Eventos de marcado
    const checkInBtn = document.getElementById('btn-checkin');
    const checkOutBtn = document.getElementById('btn-checkout');

    if (checkInBtn) {
        checkInBtn.addEventListener('click', () => {
            const todayKey = getTodayKey();
            AttendanceModel.recordCheckIn(todayKey);
            renderCalendar(currentDate);
            updateButtonStates();
        });
    }

    if (checkOutBtn) {
        checkOutBtn.addEventListener('click', () => {
            const todayKey = getTodayKey();
            AttendanceModel.recordCheckOut(todayKey);
            updateButtonStates();
        });
    }
});

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

    // Cálculo del desfase de días de la semana (Lunes = 0, Domingo = 6)
    const firstDayIndex = new Date(year, month, 1).getDay();
    const startingDay = (firstDayIndex === 0 ? 6 : firstDayIndex - 1);

    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    // 1. Días del mes previo
    for (let i = startingDay - 1; i >= 0; i--) {
        const dayNum = prevMonthTotalDays - i;
        const prevDate = new Date(year, month - 1, dayNum);
        const key = formatDateKey(prevDate);
        container.appendChild(createDayCell(dayNum, records[key] || 'default other-month'));
    }

    // 2. Días del mes en curso
    for (let day = 1; day <= totalDays; day++) {
        const thisDate = new Date(year, month, day);
        const key = formatDateKey(thisDate);
        container.appendChild(createDayCell(day, records[key] || 'default'));
    }

    // 3. Casillas sobrantes para completar la cuadrícula (hasta 35 o 42 casillas)
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

function updateButtonStates() {
    const checkInBtn = document.getElementById('btn-checkin');
    const checkOutBtn = document.getElementById('btn-checkout');
    if (!checkInBtn || !checkOutBtn) return;

    const todayKey = getTodayKey();
    const todayStatus = AttendanceModel.getTodayStatus(todayKey);

    if (!todayStatus) {
        checkInBtn.disabled = false;
        checkInBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      Marcar asistencia
    `;
        checkOutBtn.disabled = true;
        checkOutBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
      Marcar hora de salida
    `;
    } else if (!todayStatus.checkOutTime) {
        checkInBtn.disabled = true;
        checkInBtn.textContent = `Entrada: ${todayStatus.checkInTime}`;
        checkOutBtn.disabled = false;
    } else {
        checkInBtn.disabled = true;
        checkInBtn.textContent = `Entrada: ${todayStatus.checkInTime}`;
        checkOutBtn.disabled = true;
        checkOutBtn.textContent = `Salida: ${todayStatus.checkOutTime}`;
    }
}
