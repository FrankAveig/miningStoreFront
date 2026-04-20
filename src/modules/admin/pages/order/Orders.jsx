import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PaginatedTable } from '@/components/data-display/paginatedTable/PaginatedTable'
import { getOrders, deleteOrder } from '@/modules/admin/services/orders.service'
import { orderTableColumns } from './constants/orderConstants'
import { orderAdapterList } from './adapters/order.adapter.list'
import { MdVisibility } from 'react-icons/md';
import { FaTrashAlt, FaWhatsapp } from 'react-icons/fa';
import { usePaginatedFetch } from '@/hooks/usePaginatedFetch';
import { useToast } from '@/context/ToastContext';
import { FilterBar } from '@/components/data-display/FilterBar/FilterBar';
import { ConfirmationModal } from '@/components/data-display/confirmationModal/ConfirmationModal';
import styles from './orders.module.scss';

export const Orders = () => {
    const navigate = useNavigate();
    const [loading2, setLoading2] = React.useState(false);
    const [showConfirmModal, setShowConfirmModal] = React.useState(false);
    const [selectedOrder, setSelectedOrder] = React.useState(null);
    const { showToast } = useToast();

    const {
        data,
        pagination,
        loading,
        fetchPage,
        setLimit,
        setFilters,
        filters,
        forceRefetch
    } = usePaginatedFetch(
        async (page, limit, filters) => {
            const response = await getOrders(page, limit, filters.term || '', filters.status || '');
            return {
                data: orderAdapterList(response),
                pagination: response.data?.pagination
            };
        },
        { term: '', status: '' }
    );

    const handleView = (order) => {
        navigate(`/admin/pedidos/${order.id}`)
    }

    const handleWhatsApp = (order) => {
        const digits = order.whatsapp_phone;
        if (!digits || String(digits).replace(/\D/g, '').length < 8) {
            showToast('No hay un número de teléfono válido para WhatsApp.', 'error', 'Error');
            return;
        }
        const clean = String(digits).replace(/\D/g, '');
        window.open(`https://wa.me/${clean}`, '_blank', 'noopener,noreferrer');
    };

    const handleDelete = (order) => {
        setSelectedOrder(order);
        setShowConfirmModal(true);
    }

    const confirmDelete = async () => {
        if (!selectedOrder) return;

        setLoading2(true);
        try {
            await deleteOrder(selectedOrder.id);
            forceRefetch();
            showToast('Pedido eliminado exitosamente.', 'success', '¡Éxito!');
        } catch (error) {
            showToast(error.response?.data?.message || 'Error al eliminar pedido', 'error', 'Error');
        } finally {
            setLoading2(false);
            setShowConfirmModal(false);
            setSelectedOrder(null);
        }
    }

    const closeConfirmModal = () => {
        setShowConfirmModal(false);
        setSelectedOrder(null);
    }

    const actions = [
        {
            icon: MdVisibility,
            tooltip: 'Ver detalle',
            onClick: handleView,
            className: 'action-button'
        },
        {
            tooltip: 'Contactar por WhatsApp',
            render: (item) => (
                <button
                    type="button"
                    className={`paginated-table__action-button ${styles.whatsappAction}`}
                    onClick={() => handleWhatsApp(item)}
                    title="Contactar por WhatsApp"
                    aria-label="Contactar por WhatsApp"
                >
                    <FaWhatsapp className="paginated-table__action-icon" />
                </button>
            ),
        },
        {
            icon: FaTrashAlt,
            tooltip: 'Eliminar',
            onClick: handleDelete,
            className: 'action-button action-button--danger'
        },
    ];

    return (
        <div>
            <h2>Pedidos</h2>
            <div className="wrapperTableIndex">
                <div className={styles.filterBarContainer}>
                    <FilterBar
                        fields={[
                            { name: 'term', label: 'Buscar', type: 'string' },
                            {
                                name: 'status', label: 'Estado', type: 'select',
                                options: [
                                    { value: '', label: 'Todos' },
                                    { value: 'pending', label: 'Pendiente' },
                                    { value: 'contacted', label: 'Contactado' },
                                    { value: 'confirmed', label: 'Confirmado' },
                                    { value: 'shipped', label: 'Enviado' },
                                    { value: 'delivered', label: 'Entregado' },
                                    { value: 'cancelled', label: 'Cancelado' },
                                ]
                            },
                        ]}
                        onFilter={setFilters}
                        initialValues={filters}
                    />
                </div>
                <PaginatedTable
                    dataToPresent={data}
                    columns={orderTableColumns}
                    pagination={pagination}
                    onPageChange={fetchPage}
                    onLimitChange={setLimit}
                    actions={actions}
                    loading={loading}
                />
            </div>
            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={closeConfirmModal}
                onConfirm={confirmDelete}
                title="Confirmar eliminación"
                message={`¿Estás seguro de que deseas eliminar el pedido #${selectedOrder?.id} de ${selectedOrder?.customer}?`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                type="danger"
                loading={loading2}
            />
        </div>
    )
}
