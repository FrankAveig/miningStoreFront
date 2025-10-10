import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PaginatedTable } from '@/components/data-display/paginatedTable/PaginatedTable'
import { getServices, toggleServiceStatus } from '@/modules/admin/services/services.service'
import { servicesTableColumns } from './constants/serviceConstants'
import { serviceAdapterList } from './adapters/service.adapter.list'
import { MdModeEdit } from 'react-icons/md';
import { usePaginatedFetch } from '@/hooks/usePaginatedFetch';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button/Button';
import { ConfirmationModal } from '@/components/data-display/confirmationModal/ConfirmationModal';
import { FilterBar } from '@/components/data-display/FilterBar/FilterBar';
import styles from './services.module.scss';

export const Services = () => {
    const navigate = useNavigate();
    const [loading2, setLoading2] = React.useState(false);
    const [showConfirmModal, setShowConfirmModal] = React.useState(false);
    const [selectedService, setSelectedService] = React.useState(null);
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
            const response = await getServices(page, limit, filters.term || '');
            return {
                data: serviceAdapterList(response),
                pagination: response.data?.pagination
            };
        },
        { term: '' }
    );

    const handleEdit = (service) => {
        navigate(`/admin/servicios/${service.id}`)
    }

    const handleToggleStatus = async (service) => {
        setSelectedService(service);
        setShowConfirmModal(true);
    }

    const confirmToggleStatus = async () => {
        if (!selectedService) return;
        
        setLoading2(true);
        try {
            await toggleServiceStatus(selectedService.id);
            forceRefetch();
            showToast(
                `Servicio ${selectedService.status === 'Activo' ? 'desactivado' : 'activado'} exitosamente.`,
                'success',
                '¡Éxito!'
            );
        } catch (error) {
            showToast(error.response?.data?.message || 'Error al cambiar estado', 'error', 'Error');
        } finally {
            setLoading2(false);
            setShowConfirmModal(false);
            setSelectedService(null);
        }
    }

    const closeConfirmModal = () => {
        setShowConfirmModal(false);
        setSelectedService(null);
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
      <h2>Servicios</h2>
      <div className="wrapperTableIndex">
      <div className={styles.filterBarContainer}>
        <Button variant="primary" size="md" onClick={() => navigate('/admin/nuevo-servicio')}>Nuevo servicio</Button>
        <FilterBar
          fields={[
            { name: 'term', label: 'Buscar', type: 'string' },
          ]}
          onFilter={setFilters}
          initialValues={filters}
        />
      </div>
      <PaginatedTable
        dataToPresent={data}
        columns={servicesTableColumns}
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
        message={`¿Estás seguro de que deseas ${selectedService?.status === 'Activo' ? 'desactivar' : 'activar'} el servicio "${selectedService?.name}"?`}
        confirmText={selectedService?.status === 'Activo' ? 'Desactivar' : 'Activar'}
        cancelText="Cancelar"
        type="warning"
        loading={loading2}
      />
    </div>
  )
}

