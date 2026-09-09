const STORAGE_KEY_ATTENDANCE = 'eslabon_attendance_db';
const STORAGE_KEY_LOGS = 'eslabon_daily_status';

// Semilla de datos inicial (Septiembre 2026)
const defaultData = {
    '2026-09-01': 'attended',
    '2026-09-02': 'attended',
    '2026-09-03': 'attended',
    '2026-09-04': 'missed',
    '2026-09-07': 'attended'
};

export const AttendanceModel = {
    // Obtener todos los registros del calendario
    getAllRecords() {
        const data = localStorage.getItem(STORAGE_KEY_ATTENDANCE);
        if (!data) {
            localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(defaultData));
            return {...defaultData };
        }
        return JSON.parse(data);
    },

    // Guardar un día como asistido
    recordCheckIn(dateKey) {
        const records = this.getAllRecords();
        records[dateKey] = 'attended';
        localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(records));

        // Guardar estado del día para controlar los botones
        const todayStatus = {
            date: dateKey,
            checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            checkOutTime: null
        };
        localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(todayStatus));
        return todayStatus;
    },

    // Registrar salida
    recordCheckOut(dateKey) {
        const logs = this.getTodayStatus(dateKey);
        if (logs) {
            logs.checkOutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
        }
        return logs;
    },

    // Consultar estado de los botones de hoy
    getTodayStatus(dateKey) {
        const data = localStorage.getItem(STORAGE_KEY_LOGS);
        if (!data) return null;
        const parsed = JSON.parse(data);
        return parsed.date === dateKey ? parsed : null;
    }
};