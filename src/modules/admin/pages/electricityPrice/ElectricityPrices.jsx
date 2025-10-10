import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PaginatedTable } from '@/components/data-display/paginatedTable/PaginatedTable'
import { getElectricityPrices, toggleElectricityPriceStatus } from '@/modules/admin/services/electricityPrices.service'
import { electricityPricesTableColumns } from './constants/electricityPriceConstants'
import { electricityPriceAdapterList } from './adapters/electricityPrice.adapter.list'
import { MdModeEdit } from 'react-icons/md';
import { usePaginatedFetch } from '@/hooks/usePaginatedFetch';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button/Button';
import { ConfirmationModal } from '@/components/data-display/confirmationModal/ConfirmationModal';
import styles from './electricityPrices.module.scss';

export const ElectricityPrices = () => {
    const navigate = useNavigate();
    const [loading2, setLoading2] = React.useState(false);
    const [showConfirmModal, setShowConfirmModal] = React.useState(false);
    const [selectedPrice, setSelectedPrice] = React.useState(null);
    const { showToast } = useToast();

    const {
        data,
        pagination,
        loading,
        fetchPage,
        setLimit,
        forceRefetch
    } = usePaginatedFetch(
        async (page, limit) => {
            const response = await getElectricityPrices(page, limit);
            return {
                data: electricityPriceAdapterList(response),
                pagination: response.data?.pagination
            };
        }
    );

    const handleEdit = (price) => {
        navigate(`/admin/precios-electricidad/${price.id}`)
    }

    const handleToggleStatus = async (price) => {
        setSelectedPrice(price);
        setShowConfirmModal(true);
    }

    const confirmToggleStatus = async () => {
        if (!selectedPrice) return;
        
        setLoading2(true);
        try {
            await toggleElectricityPriceStatus(selectedPrice.id);
            forceRefetch();
            showToast(
                `Precio ${selectedPrice.status === 'Activo' ? 'desactivado' : 'activado'} exitosamente.`,
                'success',
                '¡Éxito!'
            );
        } catch (error) {
            showToast(error.response?.data?.message || 'Error al cambiar estado', 'error', 'Error');
        } finally {
            setLoading2(false);
            setShowConfirmModal(false);
            setSelectedPrice(null);
        }
    }

    const closeConfirmModal = () => {
        setShowConfirmModal(false);
        setSelectedPrice(null);
    }

    const actions = [
        {
          icon: MdModeEdit,
          tooltip: 'Editar',
          onClick: handleEdit,
          className: 'action-button'
        },

        {
          type: 'switch',
          isChecked: (item) => item.status === 'Activo',
          onChange: (item) => {
            handleToggleStatus(item)
          },
          disabled: loading2,
          color: (item) => item.is_active ? 'success' : 'error'
        }
      ];

  return (
    <div>
      <h2>Precios de Electricidad</h2>
      <div className="wrapperTableIndex">
      <div className={styles.filterBarContainer}>
        <Button variant="primary" size="md" onClick={() => navigate('/admin/nuevo-precio-electricidad')}>Nuevo precio</Button>
      </div>
      <PaginatedTable
        dataToPresent={data}
        columns={electricityPricesTableColumns}
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
        onConfirm={confirmToggleStatus}
        title="Confirmar cambio de estado"
        message={`¿Estás seguro de que deseas ${selectedPrice?.status === 'Activo' ? 'desactivar' : 'activar'} este precio?`}
        confirmText={selectedPrice?.status === 'Activo' ? 'Desactivar' : 'Activar'}
        cancelText="Cancelar"
        type="warning"
        loading={loading2}
      />
    </div>
  )
}

