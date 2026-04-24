import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import { Button } from '@/components/ui/button/Button';
import { ConfirmationModal } from '@/components/data-display/confirmationModal/ConfirmationModal';
import { useToast } from '@/context/ToastContext';
import {
    getShippingPricesByCatalog,
    createShippingPrice,
    updateShippingPrice,
    deleteShippingPrice,
} from '@/modules/admin/services/shippingPrices.service';
import { SHIPPING_COUNTRIES } from '../constants/shippingConstants';
import styles from './catalogShippingPrices.module.scss';

/**
 * Editor inline de precios de envio por producto.
 * Cada fila se guarda de forma independiente:
 *  - Fila nueva: POST al pulsar "Guardar".
 *  - Fila existente: PUT al pulsar "Guardar" (solo se habilita si hay cambios).
 *  - Boton eliminar: si es nueva, la quita del estado local; si esta guardada, dispara
 *    un soft-delete (DELETE ?hard=1) tras confirmar.
 *  - Toggle estado (active/inactive) se hace dentro de la misma edicion: el usuario
 *    cambia el select y guarda.
 */
export const CatalogShippingPrices = ({ catalogId }) => {
    const { showToast } = useToast();
    const [rows, setRows] = useState([]);
    const [savingId, setSavingId] = useState(null); // id (string) de la fila siendo guardada
    const [loading, setLoading] = useState(false);
    const [confirmRow, setConfirmRow] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const buildRow = (row) => ({
        // tempId solo para keys de React; el id real (server) va en `id`
        tempId: row?.id ? `srv-${row.id}` : `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        id: row?.id ?? null,
        country_code: row?.country_code ?? '',
        price_usd: row?.price_usd != null ? String(row.price_usd) : '',
        status: row?.status ?? 'active',
        // snapshot del valor servidor para detectar dirty
        _orig: row
            ? {
                  country_code: row.country_code,
                  price_usd: String(row.price_usd),
                  status: row.status,
              }
            : null,
    });

    const load = useCallback(async () => {
        if (!catalogId) return;
        setLoading(true);
        try {
            const response = await getShippingPricesByCatalog(catalogId);
            const items = response?.data?.data || [];
            setRows(items.map(buildRow));
        } catch (e) {
            showToast(
                e?.response?.data?.message || 'Error al cargar precios de envio',
                'error',
                'Error'
            );
        } finally {
            setLoading(false);
        }
    }, [catalogId, showToast]);

    useEffect(() => {
        load();
    }, [load]);

    const isDirty = (row) => {
        if (!row.id) return true; // nueva fila, siempre dirty
        if (!row._orig) return false;
        return (
            row._orig.country_code !== row.country_code ||
            String(row._orig.price_usd) !== String(row.price_usd) ||
            row._orig.status !== row.status
        );
    };

    const usedCountries = rows
        .filter((r) => r.country_code)
        .map((r) => r.country_code);

    const updateRow = (tempId, field, value) => {
        setRows((prev) =>
            prev.map((r) => (r.tempId === tempId ? { ...r, [field]: value } : r))
        );
    };

    const addRow = () => {
        setRows((prev) => [...prev, buildRow(null)]);
    };

    const validate = (row) => {
        if (!row.country_code) return 'Selecciona un país';
        // Bloquear duplicados activos en el mismo producto
        const dup = rows.some(
            (r) => r.tempId !== row.tempId && r.country_code === row.country_code
        );
        if (dup) return `Ya hay otra fila con país "${row.country_code}". Edita la existente.`;
        if (row.price_usd === '' || row.price_usd === null) return 'Ingresa un precio';
        const n = Number(row.price_usd);
        if (Number.isNaN(n) || n < 0) return 'Precio inválido (debe ser >= 0)';
        return null;
    };

    const handleSave = async (row) => {
        const err = validate(row);
        if (err) {
            showToast(err, 'warning', 'Aviso');
            return;
        }

        setSavingId(row.tempId);
        const payload = {
            catalog_id: Number(catalogId),
            country_code: row.country_code,
            price_usd: Number(row.price_usd),
            status: row.status,
        };

        try {
            let saved;
            if (row.id) {
                const resp = await updateShippingPrice(row.id, payload);
                saved = resp?.data?.data;
                showToast('Precio de envío actualizado', 'success', '¡Éxito!');
            } else {
                const resp = await createShippingPrice(payload);
                saved = resp?.data?.data;
                showToast('Precio de envío creado', 'success', '¡Éxito!');
            }
            // Reemplazo la fila por el snapshot del server (limpio dirty)
            if (saved) {
                setRows((prev) =>
                    prev.map((r) => (r.tempId === row.tempId ? buildRow(saved) : r))
                );
            }
        } catch (e) {
            showToast(
                e?.response?.data?.message || 'Error al guardar el precio de envío',
                'error',
                'Error'
            );
        } finally {
            setSavingId(null);
        }
    };

    const handleRemoveClick = (row) => {
        if (!row.id) {
            // Solo en memoria
            setRows((prev) => prev.filter((r) => r.tempId !== row.tempId));
            return;
        }
        setConfirmRow(row);
    };

    const confirmRemove = async () => {
        if (!confirmRow) return;
        setDeleting(true);
        try {
            await deleteShippingPrice(confirmRow.id);
            setRows((prev) => prev.filter((r) => r.tempId !== confirmRow.tempId));
            showToast('Precio de envío eliminado', 'success', '¡Éxito!');
            setConfirmRow(null);
        } catch (e) {
            showToast(
                e?.response?.data?.message || 'Error al eliminar el precio de envío',
                'error',
                'Error'
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Precios de Envío</h3>
                <Button variant="primary" size="sm" onClick={addRow}>
                    <FaPlus /> Agregar precio
                </Button>
            </div>
            <p className={styles.subtitle}>
                Define el costo de envío en USD por unidad para este producto, según el país del
                cliente. Usa <strong>“Todos los países”</strong> como fallback global cuando no
                exista una regla específica.
            </p>

            {loading ? (
                <p className={styles.empty}>Cargando precios...</p>
            ) : rows.length === 0 ? (
                <p className={styles.empty}>
                    No hay precios de envío configurados para este producto.
                </p>
            ) : (
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>País</th>
                                <th className={styles.priceCell}>Precio (USD)</th>
                                <th className={styles.statusColumn}>Estado</th>
                                <th className={styles.actionsColumn}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => {
                                const dirty = isDirty(row);
                                const isSaving = savingId === row.tempId;
                                return (
                                    <tr key={row.tempId} className={dirty ? styles.dirty : ''}>
                                        <td>
                                            <select
                                                className={styles.select}
                                                value={row.country_code}
                                                onChange={(e) =>
                                                    updateRow(
                                                        row.tempId,
                                                        'country_code',
                                                        e.target.value
                                                    )
                                                }
                                                disabled={isSaving}
                                            >
                                                <option value="" disabled>
                                                    -- Seleccionar --
                                                </option>
                                                {SHIPPING_COUNTRIES.map((c) => {
                                                    const taken =
                                                        usedCountries.includes(c.value) &&
                                                        row.country_code !== c.value;
                                                    return (
                                                        <option
                                                            key={c.value}
                                                            value={c.value}
                                                            disabled={taken}
                                                        >
                                                            {c.label}
                                                            {taken ? ' (ya en uso)' : ''}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </td>
                                        <td className={styles.priceCell}>
                                            <input
                                                type="number"
                                                className={styles.input}
                                                step="0.01"
                                                min="0"
                                                value={row.price_usd}
                                                onChange={(e) =>
                                                    updateRow(
                                                        row.tempId,
                                                        'price_usd',
                                                        e.target.value
                                                    )
                                                }
                                                disabled={isSaving}
                                                placeholder="0.00"
                                            />
                                        </td>
                                        <td className={styles.statusColumn}>
                                            <select
                                                className={styles.select}
                                                value={row.status}
                                                onChange={(e) =>
                                                    updateRow(
                                                        row.tempId,
                                                        'status',
                                                        e.target.value
                                                    )
                                                }
                                                disabled={isSaving}
                                            >
                                                <option value="active">Activo</option>
                                                <option value="inactive">Inactivo</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div className={styles.actionsCell}>
                                                <button
                                                    type="button"
                                                    className={`${styles.iconBtn} ${styles.saveBtn}`}
                                                    title={
                                                        row.id
                                                            ? 'Guardar cambios'
                                                            : 'Crear precio'
                                                    }
                                                    onClick={() => handleSave(row)}
                                                    disabled={!dirty || isSaving}
                                                >
                                                    <FaSave />
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`${styles.iconBtn} ${styles.removeBtn}`}
                                                    title="Eliminar precio"
                                                    onClick={() => handleRemoveClick(row)}
                                                    disabled={isSaving}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmationModal
                isOpen={!!confirmRow}
                onClose={() => setConfirmRow(null)}
                onConfirm={confirmRemove}
                title="Eliminar precio de envío"
                message={`¿Eliminar el precio de envío para "${
                    confirmRow?.country_code === 'ALL'
                        ? 'Todos los países'
                        : confirmRow?.country_code
                }"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                type="danger"
                loading={deleting}
            />
        </div>
    );
};

CatalogShippingPrices.propTypes = {
    catalogId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
