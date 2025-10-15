import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PaginatedTable } from '@/components/data-display/paginatedTable/PaginatedTable'
import { getFaqs, toggleFaqStatus } from '@/modules/admin/services/faq.service'
import { faqTableColumns } from './constants/faqConstants'
import { faqAdapterList } from './adapters/faq.adapter.list'
import { MdModeEdit } from 'react-icons/md';
import { usePaginatedFetch } from '@/hooks/usePaginatedFetch';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button/Button';
import { ConfirmationModal } from '@/components/data-display/confirmationModal/ConfirmationModal';
import { FilterBar } from '@/components/data-display/FilterBar/FilterBar';
import styles from './faqs.module.scss';

export const Faqs = () => {
    const navigate = useNavigate();
    const [loading2, setLoading2] = React.useState(false);
    const [showConfirmModal, setShowConfirmModal] = React.useState(false);
    const [selectedFaq, setSelectedFaq] = React.useState(null);
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
            const response = await getFaqs(page, limit, filters.term || '', filters.status || '');
            return {
                data: faqAdapterList(response),
                pagination: response.data?.pagination
            };
        },
        { term: '', status: '' }
    );

    const handleEdit = (faq) => {
        navigate(`/admin/preguntas-frecuentes/${faq.id}`)
    }

    const handleToggleStatus = async (faq) => {
        setSelectedFaq(faq);
        setShowConfirmModal(true);
    }

    const confirmToggleStatus = async () => {
        if (!selectedFaq) return;
        
        setLoading2(true);
        try {
            await toggleFaqStatus(selectedFaq.id);
            forceRefetch();
            showToast(
                `Pregunta ${selectedFaq.status === 'Activo' ? 'desactivada' : 'activada'} exitosamente.`,
                'success',
                '¡Éxito!'
            );
        } catch (error) {
            showToast(error.response?.data?.message || 'Error al cambiar estado', 'error', 'Error');
        } finally {
            setLoading2(false);
            setShowConfirmModal(false);
            setSelectedFaq(null);
        }
    }

    const closeConfirmModal = () => {
        setShowConfirmModal(false);
        setSelectedFaq(null);
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
      <h2>Preguntas Frecuentes</h2>
      <div className="wrapperTableIndex">
      <div className={styles.filterBarContainer}>
        <Button variant="primary" size="md" onClick={() => navigate('/admin/nueva-pregunta-frecuente')}>
          Nueva pregunta frecuente
        </Button>
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
        columns={faqTableColumns}
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
        message={`¿Estás seguro de que deseas ${selectedFaq?.status === 'Activo' ? 'desactivar' : 'activar'} la pregunta "${selectedFaq?.question}"?`}
        confirmText={selectedFaq?.status === 'Activo' ? 'Desactivar' : 'Activar'}
        cancelText="Cancelar"
        type="warning"
        loading={loading2}
      />
    </div>
  )
}

