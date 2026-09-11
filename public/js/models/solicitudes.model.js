import { fetchWithAuth } from '../config.js';

const STORAGE_KEY = 'eslabon_solicitudes_db';

const defaultSolicitudes = [
    {
        id: 'SOL-2026-092',
        tipo: 'actualizacion_datos',
        tipoEtiqueta: 'Actualización de Datos',
        fechaSolicitud: '08/09/2026',
        resumen: 'Modificación de Cuenta CLABE (BBVA)',
        estatus: 'Pendiente',
        detalles: {
            campo: 'Cuenta CLABE',
            valorNuevo: '012180015987654321',
            motivo: 'Cambio de banco principal de nómina'
        }
    },
    {
        id: 'SOL-2026-089',
        tipo: 'vacaciones',
        tipoEtiqueta: 'Vacaciones',
        fechaSolicitud: '01/09/2026',
        resumen: 'Del 14/09/2026 al 18/09/2026 (5 días)',
        estatus: 'Aprobada',
        detalles: {
            fechaInicio: '2026-09-14',
            fechaFin: '2026-09-18',
            dias: 5,
            motivo: 'Vacaciones anuales familiares'
        }
    },
    {
        id: 'SOL-2026-074',
        tipo: 'prestamos',
        tipoEtiqueta: 'Préstamo',
        fechaSolicitud: '15/08/2026',
        resumen: '$15,000.00 MXN a 12 quincenas',
        estatus: 'Aprobada',
        detalles: {
            monto: 15000,
            plazoQuincenas: 12,
            motivo: 'Gastos de imprevistos médicos'
        }
    }
];

function getStoredSolicitudes() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSolicitudes));
            return [...defaultSolicitudes];
        }
        return JSON.parse(stored);
    } catch (e) {
        console.error('Error leyendo solicitudes de localStorage:', e);
        return [...defaultSolicitudes];
    }
}

function saveStoredSolicitudes(list) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
        console.error('Error guardando solicitudes en localStorage:', e);
    }
}

function formatSolicitud(raw) {
    if (!raw) return null;
    return {
        id: raw.id || raw.folio || 'SOL-000',
        tipo: raw.tipo || 'vacaciones',
        tipoEtiqueta: raw.tipo_etiqueta || raw.tipoEtiqueta || (raw.tipo === 'prestamos' ? 'Préstamo' : (raw.tipo === 'actualizacion_datos' ? 'Actualización de Datos' : 'Vacaciones')),
        fechaSolicitud: raw.fecha_solicitud || raw.fechaSolicitud || '',
        resumen: raw.resumen || '',
        detalles: raw.detalles || {},
        estatus: raw.estatus || 'Pendiente'
    };
}

export const SolicitudesModel = {
    async getAllSolicitudes() {
        try {
            const response = await fetchWithAuth('/solicitudes');
            if (response.ok) {
                const data = await response.json();
                const list = Array.isArray(data) ? data : (data.solicitudes || []);
                return list.map(formatSolicitud);
            }
        } catch (error) {
            
        }

        const stored = getStoredSolicitudes();
        return stored.map(formatSolicitud);
    },

    async getSolicitudById(id) {
        try {
            const response = await fetchWithAuth(`/solicitudes/${id}`);
            if (response.ok) {
                const raw = await response.json();
                return formatSolicitud(raw);
            }
        } catch (error) {
            
        }

        const list = await this.getAllSolicitudes();
        return list.find(s => s.id === id) || null;
    },

    async crearSolicitud(tipo, data) {
        let tipoEtiqueta = '';
        let resumen = '';

        if (tipo === 'vacaciones') {
            tipoEtiqueta = 'Vacaciones';
            resumen = `Del ${data.fechaInicio} al ${data.fechaFin} (${data.dias} días)`;
        } else if (tipo === 'prestamos') {
            tipoEtiqueta = 'Préstamo';
            resumen = `$${Number(data.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN a ${data.plazoQuincenas} quincenas`;
        } else if (tipo === 'actualizacion_datos') {
            tipoEtiqueta = 'Actualización de Datos';
            resumen = `Modificación de ${data.campo}`;
        }

        const today = new Date();
        const fechaStr = today.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const randomFolio = `SOL-2026-${Math.floor(100 + Math.random() * 900)}`;

        const newSolicitud = {
            id: randomFolio,
            tipo,
            tipoEtiqueta,
            fechaSolicitud: fechaStr,
            resumen,
            detalles: data,
            estatus: 'Pendiente'
        };

        try {
            const response = await fetchWithAuth('/solicitudes', {
                method: 'POST',
                body: JSON.stringify(newSolicitud)
            });

            if (response.ok) {
                const result = await response.json();
                return formatSolicitud(result);
            }
        } catch (error) {
            
        }

        const stored = getStoredSolicitudes();
        stored.unshift(newSolicitud);
        saveStoredSolicitudes(stored);

        return formatSolicitud(newSolicitud);
    }
};

