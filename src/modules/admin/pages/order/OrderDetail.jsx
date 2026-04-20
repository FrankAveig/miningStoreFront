import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, updateOrder } from '@/modules/admin/services/orders.service';
import { orderAdapterGet } from './adapters/order.adapter.get';
import { BreadCrumb } from '@/components/data-display/breadCrumb/BreadCrumb';
import { FaClipboardList, FaUser, FaBox, FaCog } from 'react-icons/fa';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button/Button';
import { FormSkeleton } from '@/components/form/FormSkeleton';
import styles from './orderDetail.module.scss';

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'contacted', label: 'Contactado' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'shipped', label: 'Enviado' },
    { value: 'delivered', label: 'Entregado' },
    { value: 'cancelled', label: 'Cancelado' },
];

const STATUS_CLASS_MAP = {
    pending: styles.statusPending,
    contacted: styles.statusContacted,
    confirmed: styles.statusConfirmed,
    shipped: styles.statusShipped,
    delivered: styles.statusDelivered,
    cancelled: styles.statusCancelled,
};

export const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState('');
    const [adminNotes, setAdminNotes] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getOrder(id);
                const adapted = orderAdapterGet(response);
                setOrder(adapted);
                setStatus(adapted.status);
                setAdminNotes(adapted.admin_notes || '');
            } catch (error) {
                showToast(error.response?.data?.message || 'Error al cargar el pedido', 'error', 'Error');
                navigate('/admin/pedidos');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, showToast, navigate]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await updateOrder(id, { status, admin_notes: adminNotes });
            const adapted = orderAdapterGet(response);
            setOrder(adapted);
            setStatus(adapted.status);
            setAdminNotes(adapted.admin_notes || '');
            showToast('Pedido actualizado exitosamente.', 'success', '¡Éxito!');
        } catch (error) {
            showToast(error.response?.data?.message || 'Error al actualizar', 'error', 'Error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div>
                <BreadCrumb items={[
                    { label: 'Pedidos', to: '/admin/pedidos', icon: <FaClipboardList /> },
                    { label: 'Cargando...' }
                ]} />
                <FormSkeleton />
            </div>
        );
    }

    if (!order) return null;

    const formatDate = (d) => d ? new Date(d).toLocaleString('es-CL') : '—';

    return (
        <div className={styles.orderDetail}>
            <BreadCrumb items={[
                { label: 'Pedidos', to: '/admin/pedidos', icon: <FaClipboardList /> },
                { label: `Pedido #${order.id}` }
            ]} />

            <h2>Pedido #{order.id} <span className={`${styles.statusBadge} ${STATUS_CLASS_MAP[order.status] || ''}`}>{order.status_label}</span></h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Creado: {formatDate(order.created_at)} · Actualizado: {formatDate(order.updated_at)}
            </p>

            <div className={styles.grid}>
                {/* Customer Info */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}><FaUser /> Datos del cliente</div>
                    <div className={styles.field}>
                        <span className={styles.fieldLabel}>Nombre</span>
                        <span className={styles.fieldValue}>{order.first_name} {order.last_name}</span>
                    </div>
                    {order.rut && (
                        <div className={styles.field}>
                            <span className={styles.fieldLabel}>RUT / ID</span>
                            <span className={styles.fieldValue}>{order.rut}</span>
                        </div>
                    )}
                    <div className={styles.field}>
                        <span className={styles.fieldLabel}>Email</span>
                        <span className={styles.fieldValue}>{order.email}</span>
                    </div>
                    <div className={styles.field}>
                        <span className={styles.fieldLabel}>Teléfono</span>
                        <span className={styles.fieldValue}>{order.phone_code} {order.phone}</span>
                    </div>
                    <div className={styles.field}>
                        <span className={styles.fieldLabel}>País / Ciudad</span>
                        <span className={styles.fieldValue}>{order.country}, {order.city}</span>
                    </div>
                    <div className={styles.field}>
                        <span className={styles.fieldLabel}>Dirección</span>
                        <span className={styles.fieldValue}>{order.address}</span>
                    </div>
                    {order.building && (
                        <div className={styles.field}>
                            <span className={styles.fieldLabel}>Edificio / Torre</span>
                            <span className={styles.fieldValue}>{order.building}</span>
                        </div>
                    )}
                    {order.notes && (
                        <div className={styles.field}>
                            <span className={styles.fieldLabel}>Notas del cliente</span>
                            <span className={styles.fieldValue}>{order.notes}</span>
                        </div>
                    )}
                </div>

                {/* Status Management */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}><FaCog /> Gestión del pedido</div>
                    <div className={styles.statusForm}>
                        <div>
                            <span className={styles.fieldLabel}>Estado</span>
                            <select
                                className={styles.statusSelect}
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                {STATUS_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <span className={styles.fieldLabel}>Notas del administrador</span>
                            <textarea
                                className={styles.adminNotesTextarea}
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Notas internas sobre este pedido..."
                            />
                        </div>
                        <div className={styles.statusActions}>
                            <Button variant="primary" size="md" onClick={handleSave} disabled={saving}>
                                {saving ? 'Guardando...' : 'Guardar cambios'}
                            </Button>
                            <Button variant="secondary" size="md" onClick={() => navigate('/admin/pedidos')}>
                                Volver
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className={styles.card}>
                <div className={styles.cardTitle}><FaBox /> Productos ({order.items.length})</div>
                <table className={styles.itemsTable}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Producto</th>
                            <th>Hashrate</th>
                            <th>Cantidad</th>
                            <th>Precio USD</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map(item => (
                            <tr key={item.id}>
                                <td>
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.product_name} className={styles.itemImg} />
                                    ) : '—'}
                                </td>
                                <td>{item.product_name}</td>
                                <td>{item.hashrate && item.hashrate_unit ? `${item.hashrate} ${item.hashrate_unit}` : '—'}</td>
                                <td>{item.quantity}</td>
                                <td>${item.price_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td>${(item.price_usd * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'right', fontWeight: 600 }}>Total</td>
                            <td style={{ fontWeight: 700 }}>
                                ${order.items.reduce((sum, it) => sum + it.price_usd * it.quantity, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};
