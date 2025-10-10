import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PaginatedTable } from '@/components/data-display/paginatedTable/PaginatedTable'
import { getCryptocurrencies, toggleCryptocurrencyStatus } from '@/modules/admin/services/cryptocurrencies.service'
import { cryptocurrenciesTableColumns } from './constants/cryptocurrencyConstants'
import { cryptocurrencyAdapterList } from './adapters/cryptocurrency.adapter.list'
import { MdModeEdit } from 'react-icons/md';
import { usePaginatedFetch } from '@/hooks/usePaginatedFetch';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button/Button';
import { ConfirmationModal } from '@/components/data-display/confirmationModal/ConfirmationModal';
import { FilterBar } from '@/components/data-display/FilterBar/FilterBar';
import styles from './cryptocurrencies.module.scss';

export const Cryptocurrencies = () => {
    const navigate = useNavigate();
    const [loading2, setLoading2] = React.useState(false);
    const [showConfirmModal, setShowConfirmModal] = React.useState(false);
    const [selectedCrypto, setSelectedCrypto] = React.useState(null);
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
            const response = await getCryptocurrencies(page, limit, filters.term || '');
            return {
                data: cryptocurrencyAdapterList(response),
                pagination: response.data?.pagination
            };
        },
        { term: '' }
    );

    const handleEdit = (crypto) => {
        navigate(`/admin/criptomonedas/${crypto.id}`)
    }

    const handleToggleStatus = async (crypto) => {
        setSelectedCrypto(crypto);
        setShowConfirmModal(true);
    }

    const confirmToggleStatus = async () => {
        if (!selectedCrypto) return;
        
        setLoading2(true);
        try {
            await toggleCryptocurrencyStatus(selectedCrypto.id);
            forceRefetch();
            showToast(
                `Criptomoneda ${selectedCrypto.status === 'Activo' ? 'desactivada' : 'activada'} exitosamente.`,
                'success',
                '¡Éxito!'
            );
        } catch (error) {
            showToast(error.response?.data?.message || 'Error al cambiar estado', 'error', 'Error');
        } finally {
            setLoading2(false);
            setShowConfirmModal(false);
            setSelectedCrypto(null);
        }
    }

    const closeConfirmModal = () => {
        setShowConfirmModal(false);
        setSelectedCrypto(null);
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
      <h2>Criptomonedas</h2>
      <div className="wrapperTableIndex">
      <div className={styles.filterBarContainer}>
        <Button variant="primary" size="md" onClick={() => navigate('/admin/nueva-criptomoneda')}>Nueva criptomoneda</Button>
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
        columns={cryptocurrenciesTableColumns}
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
        message={`¿Estás seguro de que deseas ${selectedCrypto?.status === 'Activo' ? 'desactivar' : 'activar'} la criptomoneda "${selectedCrypto?.name}"?`}
        confirmText={selectedCrypto?.status === 'Activo' ? 'Desactivar' : 'Activar'}
        cancelText="Cancelar"
        type="warning"
        loading={loading2}
      />
    </div>
  )
}

