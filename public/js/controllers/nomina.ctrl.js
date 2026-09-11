import { initLayout } from './layout.ctrl.js';
import { NominaModel } from '../models/nomina.model.js';

document.addEventListener('DOMContentLoaded', async () => {
    const user = initLayout('nomina');
    if (!user) return;

    const empleado = NominaModel.getEmpleadoDatos(user);

    let currentAnio = 'all';
    let currentMes = 'all';
    let currentSearch = '';
    let currentReciboModal = null;

    const kpiUltimoPago = document.getElementById('kpi-ultimo-pago');
    const kpiFechaPago = document.getElementById('kpi-fecha-pago');
    const kpiPercepciones = document.getElementById('kpi-percepciones');
    const kpiDeducciones = document.getElementById('kpi-deducciones');

    const selectAnio = document.getElementById('select-filter-anio');
    const selectMes = document.getElementById('select-filter-mes');
    const inputSearch = document.getElementById('input-filter-search');
    const tableBody = document.getElementById('nomina-table-body');
    const recordCounter = document.getElementById('record-counter');

    const modalBackdrop = document.getElementById('modal-cfdi-backdrop');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCancelModal = document.getElementById('btn-cancel-modal');
    const btnPrintModal = document.getElementById('btn-print-modal');
    const btnDownloadModal = document.getElementById('btn-download-modal');

    await renderKPIs();
    await renderTable();

    // Filtros
    if (selectAnio) {
        selectAnio.addEventListener('change', async (e) => {
            currentAnio = e.target.value;
            await renderTable();
        });
    }

    if (selectMes) {
        selectMes.addEventListener('change', async (e) => {
            currentMes = e.target.value;
            await renderTable();
        });
    }

    if (inputSearch) {
        inputSearch.addEventListener('input', async (e) => {
            currentSearch = e.target.value.toLowerCase().trim();
            await renderTable();
        });
    }

    // Modal de recibo
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('show')) {
            closeModal();
        }
    });

    if (btnPrintModal) {
        btnPrintModal.addEventListener('click', () => {
            window.print();
        });
    }

    if (btnDownloadModal) {
        btnDownloadModal.addEventListener('click', () => {
            if (currentReciboModal) {
                descargarPDF(currentReciboModal);
            }
        });
    }

    async function renderKPIs() {
        const stats = await NominaModel.getResumenStats();

        if (kpiUltimoPago) kpiUltimoPago.textContent = formatCurrency(stats.ultimoPagoNeto);
        if (kpiFechaPago) kpiFechaPago.textContent = `Pago del ${stats.fechaUltimoPago}`;
        if (kpiPercepciones) kpiPercepciones.textContent = formatCurrency(stats.percepcionesAcumuladas);
        if (kpiDeducciones) kpiDeducciones.textContent = formatCurrency(stats.deduccionesAcumuladas);
    }

    async function renderTable() {
        let recibos = await NominaModel.getRecibos(currentAnio, currentMes);

        if (currentSearch) {
            recibos = recibos.filter(r =>
                (r.periodoNombre && r.periodoNombre.toLowerCase().includes(currentSearch)) ||
                (r.folio && r.folio.toLowerCase().includes(currentSearch))
            );
        }

        if (recordCounter) {
            recordCounter.textContent = `${recibos.length} recibos encontrados`;
        }

        if (!tableBody) return;

        if (recibos.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center" style="padding: 2.5rem; color: var(--text-muted);">
                        <p>No se encontraron recibos de nómina para los filtros seleccionados.</p>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = recibos.map(recibo => `
            <tr>
                <td>
                    <div style="font-weight: 700; color: var(--primary-dark);">${recibo.periodoNombre || ''}</div>
                    <div class="font-mono" style="font-size: 0.78rem; color: var(--text-muted);">${recibo.folio || ''}</div>
                </td>
                <td style="white-space: nowrap;">${recibo.fechaPago || ''}</td>
                <td class="text-center font-mono">${formatCurrency(recibo.sueldoDiario)}</td>
                <td class="text-right amount-positive">${formatCurrency(recibo.totalPercepciones)}</td>
                <td class="text-right amount-negative">${formatCurrency(recibo.totalDeducciones)}</td>
                <td class="text-right amount-net">${formatCurrency(recibo.netoPagado)}</td>
                <td class="text-center">
                    <span class="badge badge-success">
                        ${recibo.estatus || 'Pagado'}
                    </span>
                </td>
                <td class="text-right">
                    <div class="action-buttons">
                        <button class="btn-table-action btn-view-nomina" data-id="${recibo.id}" title="Ver detalle de recibo">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            Ver nómina
                        </button>
                        <button class="btn-table-action btn-download btn-download-pdf" data-id="${recibo.id}" title="Descargar recibo en PDF">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            PDF
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        document.querySelectorAll('.btn-view-nomina').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const recibo = await NominaModel.getReciboById(id);
                if (recibo) openModal(recibo);
            });
        });

        document.querySelectorAll('.btn-download-pdf').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const recibo = await NominaModel.getReciboById(id);
                if (recibo) descargarPDF(recibo);
            });
        });
    }

    function openModal(recibo) {
        currentReciboModal = recibo;
        const container = document.getElementById('cfdi-paper-content');
        if (!container) return;

        const empresa = recibo.empresa || {
            nombre: 'ATLAS SOLUTIONS S.A. DE C.V.',
            rfc: 'ASO180412H89',
            registroPatronal: 'B9283746109'
        };

        const empData = recibo.empleado ? {
            nombre: recibo.empleado.nombre || empleado.nombre || '',
            noEmpleado: recibo.empleado.no_empleado || recibo.empleado.noEmpleado || empleado.noEmpleado || '',
            rfc: recibo.empleado.rfc || empleado.rfc || '',
            curp: recibo.empleado.curp || empleado.curp || '',
            imss: recibo.empleado.imss || empleado.imss || '',
            departamento: recibo.empleado.departamento || empleado.departamento || '',
            puesto: recibo.empleado.puesto || empleado.puesto || '',
            fechaIngreso: recibo.empleado.fecha_ingreso || recibo.empleado.fechaIngreso || empleado.fechaIngreso || '',
            reportaA: recibo.empleado.reporta_a || recibo.empleado.reportaA || empleado.reportaA || '',
            abonoCuenta: recibo.empleado.abono_cuenta || recibo.empleado.abonoCuenta || empleado.abonoCuenta || ''
        } : empleado;

        const percepciones = recibo.percepciones || [];
        const deducciones = recibo.deducciones || [];
        const saldosInformativos = recibo.saldosInformativos || [];

        const diasTrab = Number(recibo.diasTrabajados !== undefined ? recibo.diasTrabajados : 15).toFixed(1);
        const horasTrab = Number(recibo.horasTrabajadas !== undefined ? recibo.horasTrabajadas : 120).toFixed(1);

        container.innerHTML = `
            <div class="cfdi-paper">
                <!-- Empresa -->
                <div class="cfdi-header">
                    <div class="cfdi-company-info">
                        <h2>${empresa.nombre || empresa.razon_social || ''}</h2>
                        <p><strong>RFC Compañía:</strong> ${empresa.rfc || ''}</p>
                        <p><strong>Registro Patronal:</strong> ${empresa.registroPatronal || empresa.registro_patronal || ''}</p>
                    </div>
                    <div class="cfdi-badge-box">
                        <div class="cfdi-voucher-title">RECIBO DE NÓMINA</div>
                        <div class="cfdi-folio">${recibo.folio || ''}</div>
                    </div>
                </div>

                <!-- Datos del Trabajador y Periodo -->
                <div class="cfdi-grid-details">
                    <div class="cfdi-box-section">
                        <h4>DATOS DEL TRABAJADOR</h4>
                        <div class="cfdi-detail-row">
                            <span class="cfdi-detail-label">Nombre:</span>
                            <span class="cfdi-detail-value">${empData.nombre || ''}</span>
                        </div>
                        <div class="cfdi-detail-row">
                            <span class="cfdi-detail-label">No. de Empleado:</span>
                            <span class="cfdi-detail-value">${empData.noEmpleado || ''}</span>
                        </div>
                        <div class="cfdi-detail-row">
                            <span class="cfdi-detail-label">RFC:</span>
                            <span class="cfdi-detail-value">${empData.rfc || ''}</span>
                        </div>
                        <div class="cfdi-detail-row">
                            <span class="cfdi-detail-label">CURP:</span>
                            <span class="cfdi-detail-value">${empData.curp || ''}</span>
                        </div>
                        <div class="cfdi-detail-row">
                            <span class="cfdi-detail-label">IMSS:</span>
                            <span class="cfdi-detail-value">${empData.imss || ''}</span>
                        </div>
                        <div class="cfdi-detail-row">
                            <span class="cfdi-detail-label">Departamento:</span>
                            <span class="cfdi-detail-value">${empData.departamento || ''}</span>
                        </div>
                        <div class="cfdi-detail-row">
                            <span class="cfdi-detail-label">Puesto:</span>
                            <span class="cfdi-detail-value">${empData.puesto || ''}</span>
                        </div>
                        <div class="cfdi-detail-row">
                            <span class="cfdi-detail-label">Fecha de Ingreso:</span>
                            <span class="cfdi-detail-value">${empData.fechaIngreso || ''}</span>
                        </div>
                        <div class="cfdi-detail-row">
                            <span class="cfdi-detail-label">Reporta a:</span>
                            <span class="cfdi-detail-value">${empData.reportaA || ''}</span>
                        </div>
                        <div class="cfdi-detail-row">
                            <span class="cfdi-detail-label">Abono a cuenta:</span>
                            <span class="cfdi-detail-value">${empData.abonoCuenta || ''}</span>
                        </div>
                    </div>

                    <div class="cfdi-box-section">
                        <h4>DATOS DEL PERIODO Y CONDICIONES</h4>
                        <div class="cfdi-detail-row">
                            <span class="cfdi-detail-label">Sueldo Diario:</span>
                            <span class="cfdi-detail-value">${formatCurrency(recibo.sueldoDiario)}</span>
                        </div>
                        <div class="cfdi-detail-row">
                            <span class="cfdi-detail-label">Días Trabajados:</span>
                            <span class="cfdi-detail-value">${diasTrab} días</span>
                        </div>
                        <div class="cfdi-detail-row">
                            <span class="cfdi-detail-label">Horas Trabajadas:</span>
                            <span class="cfdi-detail-value">${horasTrab} hrs</span>
                        </div>
                        <div class="cfdi-detail-row">
                            <span class="cfdi-detail-label">Periodo de Pago:</span>
                            <span class="cfdi-detail-value">${recibo.periodoPago || ''}</span>
                        </div>
                        <div class="cfdi-detail-row">
                            <span class="cfdi-detail-label">Fecha de Pago:</span>
                            <span class="cfdi-detail-value">${recibo.fechaPago || ''}</span>
                        </div>
                        <div class="cfdi-detail-row">
                            <span class="cfdi-detail-label">Turno:</span>
                            <span class="cfdi-detail-value">${recibo.turno || ''}</span>
                        </div>
                        <div class="cfdi-detail-row">
                            <span class="cfdi-detail-label">Jornada:</span>
                            <span class="cfdi-detail-value">${recibo.jornada || ''}</span>
                        </div>
                        <div class="cfdi-detail-row">
                            <span class="cfdi-detail-label">Semana (o Quincena):</span>
                            <span class="cfdi-detail-value">${recibo.quincenaSemana || ''}</span>
                        </div>
                    </div>
                </div>

                <!-- Conceptos -->
                <div class="cfdi-tables-grid-3">
                    <!-- Percepciones -->
                    <div class="cfdi-table-wrapper">
                        <div class="cfdi-table-title">PERCEPCIONES</div>
                        <table class="cfdi-mini-table">
                            <thead>
                                <tr>
                                    <th>Concepto</th>
                                    <th class="text-right">Importe</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${percepciones.length > 0 ? percepciones.map(p => `
                                    <tr>
                                        <td>${p.concepto}</td>
                                        <td class="text-right amount-positive">${formatCurrency(p.importe)}</td>
                                    </tr>
                                `).join('') : `
                                    <tr>
                                        <td colspan="2" class="text-center" style="color: var(--text-muted); padding: 0.6rem;">Sin percepciones</td>
                                    </tr>
                                `}
                            </tbody>
                        </table>
                    </div>

                    <!-- Deducciones -->
                    <div class="cfdi-table-wrapper">
                        <div class="cfdi-table-title deducciones">DEDUCCIONES</div>
                        <table class="cfdi-mini-table">
                            <thead>
                                <tr>
                                    <th>Concepto</th>
                                    <th class="text-right">Importe</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${deducciones.length > 0 ? deducciones.map(d => `
                                    <tr>
                                        <td>${d.concepto}</td>
                                        <td class="text-right amount-negative">${formatCurrency(d.importe)}</td>
                                    </tr>
                                `).join('') : `
                                    <tr>
                                        <td colspan="2" class="text-center" style="color: var(--text-muted); padding: 0.6rem;">Sin deducciones</td>
                                    </tr>
                                `}
                            </tbody>
                        </table>
                    </div>

                    <!-- Saldos e Informativos -->
                    <div class="cfdi-table-wrapper">
                        <div class="cfdi-table-title informativos">SALDOS O INFORMATIVOS</div>
                        <table class="cfdi-mini-table">
                            <thead>
                                <tr>
                                    <th>Concepto</th>
                                    <th class="text-right">Valor / Importe</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${saldosInformativos.length > 0 ? saldosInformativos.map(s => `
                                    <tr>
                                        <td>${s.concepto}</td>
                                        <td class="text-right font-mono">${typeof s.importe === 'number' ? formatCurrency(s.importe) : (s.importe || s.valor || '-')}</td>
                                    </tr>
                                `).join('') : `
                                    <tr>
                                        <td colspan="2" class="text-center" style="color: var(--text-muted); padding: 0.6rem;">Sin datos adicionales</td>
                                    </tr>
                                `}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Totales -->
                <div class="cfdi-summary-banner">
                    <div class="cfdi-summary-item">
                        <span class="cfdi-summary-label">Total Percepciones:</span>
                        <span class="cfdi-summary-val">${formatCurrency(recibo.totalPercepciones)}</span>
                    </div>
                    <div class="cfdi-summary-item">
                        <span class="cfdi-summary-label">Total Deducciones:</span>
                        <span class="cfdi-summary-val">${formatCurrency(recibo.totalDeducciones)}</span>
                    </div>
                    <div class="cfdi-net-box">
                        <div class="cfdi-summary-label" style="color: #E2E8F0;">PERCEPCIÓN NETA (NETO A PAGAR):</div>
                        <div class="cfdi-net-val">${formatCurrency(recibo.netoPagado)} MXN</div>
                    </div>
                </div>
            </div>
        `;

        if (modalBackdrop) modalBackdrop.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (modalBackdrop) modalBackdrop.classList.remove('show');
        document.body.style.overflow = '';
        currentReciboModal = null;
    }

    function descargarPDF(recibo) {
        const fileName = `Recibo_Nomina_${recibo.folio || 'REC'}_${empleado.nombre.replace(/\s+/g, '_')}.pdf`;

        if (window.html2pdf) {
            const wasOpen = modalBackdrop && modalBackdrop.classList.contains('show');
            if (!wasOpen) openModal(recibo);

            const element = document.getElementById('cfdi-paper-content');

            const opt = {
                margin:       [0.15, 0.15, 0.15, 0.15],
                filename:     fileName,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, logging: false, scrollY: 0 },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
                pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
            };

            window.html2pdf().set(opt).from(element).save().then(() => {
                if (!wasOpen) closeModal();
            }).catch((err) => {
                console.warn('Impresión nativa fallback:', err);
                fallbackImpresionPDF(recibo);
            });
        } else {
            fallbackImpresionPDF(recibo);
        }
    }

    function fallbackImpresionPDF(recibo) {
        openModal(recibo);
        setTimeout(() => {
            window.print();
        }, 300);
    }

    function formatCurrency(amount) {
        const num = Number(amount);
        if (isNaN(num)) return '$0.00';
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2
        }).format(num);
    }
});
