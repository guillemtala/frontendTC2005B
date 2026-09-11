import { fetchWithAuth } from '../config.js';

const STORAGE_KEY = 'eslabon_nominas_db';

const defaultRecibos = [
    {
        id: 'FOL-2026-016',
        folio: 'FOL-2026-016',
        periodoNombre: '2ª Quincena de Agosto 2026',
        fechaPago: '31/08/2026',
        periodoPago: '16/08/2026 - 31/08/2026',
        sueldoDiario: 850,
        diasTrabajados: 15,
        horasTrabajadas: 120,
        turno: 'Matutino',
        jornada: 'Diurna (8 hrs)',
        quincenaSemana: 'Quincena 16',
        anio: 2026,
        mes: 8,
        estatus: 'Pagado',
        percepciones: [
            { concepto: '001 Sueldo Base Quincenal', importe: 12750.00 },
            { concepto: '038 Vales de Despensa', importe: 1500.00 },
            { concepto: '009 Premio de Puntualidad', importe: 1000.00 }
        ],
        deducciones: [
            { concepto: '001 Retención ISR', importe: 2145.00 },
            { concepto: '002 Cuota Obrera IMSS', importe: 975.00 }
        ],
        saldosInformativos: [
            { concepto: 'Subsidio al Empleo (Causado)', importe: '$0.00' },
            { concepto: 'Base Gravable ISR Quincenal', importe: '$13,750.00' },
            { concepto: 'Aportación Patronal AFORE', importe: '$1,275.00' },
            { concepto: 'Fondo de Vivienda INFONAVIT', importe: '$637.50' }
        ]
    },
    {
        id: 'FOL-2026-015',
        folio: 'FOL-2026-015',
        periodoNombre: '1ª Quincena de Agosto 2026',
        fechaPago: '15/08/2026',
        periodoPago: '01/08/2026 - 15/08/2026',
        sueldoDiario: 850,
        diasTrabajados: 15,
        horasTrabajadas: 120,
        turno: 'Matutino',
        jornada: 'Diurna (8 hrs)',
        quincenaSemana: 'Quincena 15',
        anio: 2026,
        mes: 8,
        estatus: 'Pagado',
        percepciones: [
            { concepto: '001 Sueldo Base Quincenal', importe: 12750.00 },
            { concepto: '038 Vales de Despensa', importe: 1500.00 },
            { concepto: '009 Premio de Puntualidad', importe: 800.00 }
        ],
        deducciones: [
            { concepto: '001 Retención ISR', importe: 2090.00 },
            { concepto: '002 Cuota Obrera IMSS', importe: 975.00 }
        ],
        saldosInformativos: [
            { concepto: 'Subsidio al Empleo (Causado)', importe: '$0.00' },
            { concepto: 'Base Gravable ISR Quincenal', importe: '$13,550.00' },
            { concepto: 'Aportación Patronal AFORE', importe: '$1,275.00' }
        ]
    },
    {
        id: 'FOL-2026-014',
        folio: 'FOL-2026-014',
        periodoNombre: '2ª Quincena de Julio 2026',
        fechaPago: '31/07/2026',
        periodoPago: '16/07/2026 - 31/07/2026',
        sueldoDiario: 850,
        diasTrabajados: 15,
        horasTrabajadas: 120,
        turno: 'Matutino',
        jornada: 'Diurna (8 hrs)',
        quincenaSemana: 'Quincena 14',
        anio: 2026,
        mes: 7,
        estatus: 'Pagado',
        percepciones: [
            { concepto: '001 Sueldo Base Quincenal', importe: 12750.00 },
            { concepto: '038 Vales de Despensa', importe: 1500.00 },
            { concepto: '010 Bono Desempeño Trimestral', importe: 3500.00 }
        ],
        deducciones: [
            { concepto: '001 Retención ISR', importe: 2850.00 },
            { concepto: '002 Cuota Obrera IMSS', importe: 975.00 }
        ],
        saldosInformativos: [
            { concepto: 'Subsidio al Empleo (Causado)', importe: '$0.00' },
            { concepto: 'Base Gravable ISR Quincenal', importe: '$16,250.00' },
            { concepto: 'Aportación Patronal AFORE', importe: '$1,275.00' }
        ]
    },
    {
        id: 'FOL-2026-012',
        folio: 'FOL-2026-012',
        periodoNombre: '2ª Quincena de Junio 2026',
        fechaPago: '30/06/2026',
        periodoPago: '16/06/2026 - 30/06/2026',
        sueldoDiario: 850,
        diasTrabajados: 15,
        horasTrabajadas: 120,
        turno: 'Matutino',
        jornada: 'Diurna (8 hrs)',
        quincenaSemana: 'Quincena 12',
        anio: 2026,
        mes: 6,
        estatus: 'Pagado',
        percepciones: [
            { concepto: '001 Sueldo Base Quincenal', importe: 12750.00 },
            { concepto: '038 Vales de Despensa', importe: 1500.00 }
        ],
        deducciones: [
            { concepto: '001 Retención ISR', importe: 1950.00 },
            { concepto: '002 Cuota Obrera IMSS', importe: 975.00 }
        ],
        saldosInformativos: [
            { concepto: 'Subsidio al Empleo (Causado)', importe: '$0.00' },
            { concepto: 'Base Gravable ISR Quincenal', importe: '$12,750.00' },
            { concepto: 'Aportación Patronal AFORE', importe: '$1,275.00' }
        ]
    },
    {
        id: 'FOL-2026-010',
        folio: 'FOL-2026-010',
        periodoNombre: 'Nómina Especial PTU (Mayo 2026)',
        fechaPago: '25/05/2026',
        periodoPago: '01/01/2025 - 31/12/2025',
        sueldoDiario: 850,
        diasTrabajados: 365,
        horasTrabajadas: 2920,
        turno: 'General',
        jornada: 'Diurna',
        quincenaSemana: 'Especial PTU',
        anio: 2026,
        mes: 5,
        estatus: 'Pagado',
        percepciones: [
            { concepto: '003 Reparto de Utilidades (PTU)', importe: 24500.00 }
        ],
        deducciones: [
            { concepto: '001 Retención ISR PTU (Art 96 LISR)', importe: 3820.00 }
        ],
        saldosInformativos: [
            { concepto: 'Exento PTU (15 UMA)', importe: '$1,628.55' },
            { concepto: 'Gravable PTU', importe: '$22,871.45' }
        ]
    },
    {
        id: 'FOL-2025-024',
        folio: 'FOL-2025-024',
        periodoNombre: '2ª Quincena de Diciembre 2025',
        fechaPago: '31/12/2025',
        periodoPago: '16/12/2025 - 31/12/2025',
        sueldoDiario: 800,
        diasTrabajados: 15,
        horasTrabajadas: 120,
        turno: 'Matutino',
        jornada: 'Diurna (8 hrs)',
        quincenaSemana: 'Quincena 24',
        anio: 2025,
        mes: 12,
        estatus: 'Pagado',
        percepciones: [
            { concepto: '001 Sueldo Base Quincenal', importe: 12000.00 },
            { concepto: '002 Aguinaldo Anual (15 días)', importe: 12000.00 },
            { concepto: '038 Vales de Despensa', importe: 1500.00 }
        ],
        deducciones: [
            { concepto: '001 Retención ISR Regular y Aguinaldo', importe: 3450.00 },
            { concepto: '002 Cuota Obrera IMSS', importe: 920.00 }
        ],
        saldosInformativos: [
            { concepto: 'Exento Aguinaldo (30 UMA)', importe: '$3,257.10' },
            { concepto: 'Base Gravable ISR Total', importe: '$20,742.90' }
        ]
    }
];

function getStoredRecibos() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRecibos));
            return defaultRecibos;
        }
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
        console.error('Error leyendo nominas de localStorage:', e);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRecibos));
    return defaultRecibos;
}

function normalizeConceptList(rawList, defaultType, sueldoDiario, totalTarget) {
    if (Array.isArray(rawList) && rawList.length > 0) {
        return rawList.map(item => {
            if (typeof item === 'string') {
                return { concepto: item, importe: 0 };
            }
            const concepto = item.concepto || item.descripcion || item.nombre || item.clave || (defaultType === 'p' ? 'Percepción' : 'Deducción');
            const rawVal = item.importe !== undefined ? item.importe : (item.monto !== undefined ? item.monto : (item.total !== undefined ? item.total : (item.valor !== undefined ? item.valor : 0)));
            const numericVal = typeof rawVal === 'number' ? rawVal : (parseFloat(String(rawVal).replace(/[^0-9.-]+/g, '')) || 0);
            return { concepto, importe: numericVal };
        });
    }

    if (defaultType === 'p') {
        const sueldoBase = (sueldoDiario || 850) * 15;
        const vales = 1500.00;
        const result = [
            { concepto: '001 Sueldo Base Quincenal', importe: sueldoBase },
            { concepto: '038 Vales de Despensa', importe: vales }
        ];
        if (totalTarget && totalTarget > (sueldoBase + vales)) {
            result.push({ concepto: '009 Bono Complementario', importe: totalTarget - (sueldoBase + vales) });
        }
        return result;
    }

    if (defaultType === 'd') {
        const total = totalTarget || 3120.00;
        const isr = Math.round(total * 0.68);
        const imss = Math.max(0, total - isr);
        return [
            { concepto: '001 Retención ISR', importe: isr },
            { concepto: '002 Cuota Obrera IMSS', importe: imss }
        ];
    }

    return [];
}

function normalizeSaldosInformativos(rawList, baseGravable) {
    if (Array.isArray(rawList) && rawList.length > 0) {
        return rawList.map(item => {
            if (typeof item === 'string') {
                return { concepto: item, importe: '-' };
            }
            const concepto = item.concepto || item.descripcion || item.nombre || item.clave || 'Informativo';
            const val = item.importe !== undefined ? item.importe : (item.valor !== undefined ? item.valor : (item.monto !== undefined ? item.monto : '-'));
            return { concepto, importe: val };
        });
    }

    return [
        { concepto: 'Subsidio al Empleo (Causado)', importe: '$0.00' },
        { concepto: 'Base Gravable ISR', importe: baseGravable ? `$${Number(baseGravable).toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : '$13,750.00' },
        { concepto: 'Aportación Patronal AFORE', importe: '$1,275.00' },
        { concepto: 'Fondo de Vivienda INFONAVIT', importe: '$637.50' }
    ];
}

function formatReciboItem(raw) {
    if (!raw) return null;

    const sueldoDiario = raw.sueldo_diario !== undefined ? Number(raw.sueldo_diario) : (raw.sueldoDiario || 850);
    const rawPercepciones = raw.percepciones || raw.percepcion || raw.percepcion_list;
    const rawDeducciones = raw.deducciones || raw.deduccion || raw.deduccion_list;
    const rawSaldos = raw.saldos_informativos || raw.saldosInformativos || raw.informativos;

    const rawTotalP = raw.total_percepciones !== undefined ? Number(raw.total_percepciones) : (raw.totalPercepciones !== undefined ? Number(raw.totalPercepciones) : undefined);
    const rawTotalD = raw.total_deducciones !== undefined ? Number(raw.total_deducciones) : (raw.totalDeducciones !== undefined ? Number(raw.totalDeducciones) : undefined);

    const percepciones = normalizeConceptList(rawPercepciones, 'p', sueldoDiario, rawTotalP);
    const deducciones = normalizeConceptList(rawDeducciones, 'd', sueldoDiario, rawTotalD);

    const totalPercepciones = rawTotalP !== undefined
        ? rawTotalP
        : percepciones.reduce((acc, curr) => acc + (Number(curr.importe) || 0), 0);

    const totalDeducciones = rawTotalD !== undefined
        ? rawTotalD
        : deducciones.reduce((acc, curr) => acc + (Number(curr.importe) || 0), 0);

    const netoPagado = raw.neto_pagado !== undefined
        ? Number(raw.neto_pagado)
        : (raw.netoPagado !== undefined ? Number(raw.netoPagado) : totalPercepciones - totalDeducciones);

    const saldosInformativos = normalizeSaldosInformativos(rawSaldos, totalPercepciones);

    return {
        id: raw.id || raw.folio || 'FOL-000',
        folio: raw.folio || raw.id || 'FOL-000',
        periodoNombre: raw.periodo_nombre || raw.periodoNombre || 'Quincena de Nómina',
        sueldoDiario,
        diasTrabajados: raw.dias_trabajados !== undefined ? Number(raw.dias_trabajados) : (raw.diasTrabajados || 15),
        horasTrabajadas: raw.horas_trabajadas !== undefined ? Number(raw.horas_trabajadas) : (raw.horasTrabajadas || 120),
        periodoPago: raw.periodo_pago || raw.periodoPago || '16/08/2026 - 31/08/2026',
        fechaPago: raw.fecha_pago || raw.fechaPago || '31/08/2026',
        turno: raw.turno || 'Matutino',
        jornada: raw.jornada || 'Diurna (8 hrs)',
        quincenaSemana: raw.quincena_semana || raw.quincenaSemana || 'Quincena 16',
        anio: raw.anio ? Number(raw.anio) : 2026,
        mes: raw.mes ? Number(raw.mes) : 8,
        estatus: raw.estatus || 'Pagado',
        empresa: raw.empresa || null,
        empleado: raw.empleado || null,
        percepciones,
        deducciones,
        saldosInformativos,
        totalPercepciones,
        totalDeducciones,
        netoPagado
    };
}

export const NominaModel = {
    async getRecibos(anioFilter = 'all', mesFilter = 'all') {
        const queryParams = new URLSearchParams();
        if (anioFilter !== 'all') queryParams.append('anio', anioFilter);
        if (mesFilter !== 'all') queryParams.append('mes', mesFilter);

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

        let rawList = null;

        try {
            const response = await fetchWithAuth(`/nominas${queryString}`);
            if (response.ok) {
                const data = await response.json();
                rawList = Array.isArray(data) ? data : (data.recibos || data.nominas || []);
            }
        } catch (error) {
            // API no disponible
        }

        if (!rawList || rawList.length === 0) {
            rawList = getStoredRecibos();
        }

        let filtered = rawList.map(formatReciboItem);

        if (anioFilter !== 'all') {
            filtered = filtered.filter(r => String(r.anio) === String(anioFilter));
        }

        if (mesFilter !== 'all') {
            filtered = filtered.filter(r => String(r.mes) === String(mesFilter));
        }

        return filtered;
    },

    async getReciboById(id) {
        try {
            const response = await fetchWithAuth(`/nominas/${id}`);
            if (response.ok) {
                const raw = await response.json();
                return formatReciboItem(raw);
            }
        } catch (error) {
            // API no disponible
        }

        const list = await this.getRecibos('all', 'all');
        return list.find(r => String(r.id) === String(id) || String(r.folio) === String(id)) || null;
    },

    getEmpleadoDatos(user) {
        if (!user) return {};
        return {
            nombre: user.nombre || user.name || '',
            noEmpleado: user.no_empleado || user.id || '',
            rfc: user.rfc || '',
            curp: user.curp || '',
            imss: user.imss || '',
            departamento: user.departamento || '',
            puesto: user.puesto || '',
            fechaIngreso: user.fecha_ingreso || '',
            reportaA: user.reporta_a || '',
            abonoCuenta: user.abono_cuenta || ''
        };
    },

    async getResumenStats() {
        const recibos = await this.getRecibos();
        if (!recibos || recibos.length === 0) {
            return {
                ultimoPagoNeto: 0,
                fechaUltimoPago: '-',
                percepcionesAcumuladas: 0,
                deduccionesAcumuladas: 0,
                totalRecibos: 0
            };
        }

        const ultimoRecibo = recibos[0];
        const percepcionesAcumuladas = recibos.reduce((acc, r) => acc + (r.totalPercepciones || 0), 0);
        const deduccionesAcumuladas = recibos.reduce((acc, r) => acc + (r.totalDeducciones || 0), 0);

        return {
            ultimoPagoNeto: ultimoRecibo.netoPagado || 0,
            fechaUltimoPago: ultimoRecibo.fechaPago || '-',
            percepcionesAcumuladas,
            deduccionesAcumuladas,
            totalRecibos: recibos.length
        };
    }
};
