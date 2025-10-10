import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PaginatedTable } from '@/components/data-display/paginatedTable/PaginatedTable'
import { getCatalogCategories, toggleCatalogCategoryStatus } from '@/modules/admin/services/catalogCategories.service'
import { catalogCategoriesTableColumns } from './constants/catalogCategoryConstants'
import { catalogCategoryAdapterList } from './adapters/catalogCategory.adapter.list'
import { MdModeEdit } from 'react-icons/md';
import { usePaginatedFetch } from '@/hooks/usePaginatedFetch';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button/Button';
import { ConfirmationModal } from '@/components/data-display/confirmationModal/ConfirmationModal';
import { FilterBar } from '@/components/data-display/FilterBar/FilterBar';
import styles from './catalogCategories.module.scss';

export const CatalogCategories = () => {
    const navigate = useNavigate();
    const [loading2, setLoading2] = React.useState(false);
    const [showConfirmModal, setShowConfirmModal] = React.useState(false);
    const [selectedCategory, setSelectedCategory] = React.useState(null);
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
            const response = await getCatalogCategories(page, limit, filters.term || '');
            return {
                data: catalogCategoryAdapterList(response),
                pagination: response.data?.pagination
            };
        },
        { term: '' }
    );

    const handleEdit = (category) => {
        navigate(`/admin/categorias/${category.id}`)
    }

    const handleToggleStatus = async (category) => {
        setSelectedCategory(category);
        setShowConfirmModal(true);
    }

    const confirmToggleStatus = async () => {
        if (!selectedCategory) return;
        
        setLoading2(true);
        try {
            await toggleCatalogCategoryStatus(selectedCategory.id);
            forceRefetch();
            showToast(
                `Categoría ${selectedCategory.status === 'Activo' ? 'desactivada' : 'activada'} exitosamente.`,
                'success',
                '¡Éxito!'
            );
        } catch (error) {
            showToast(error.response?.data?.message || 'Error al cambiar estado', 'error', 'Error');
        } finally {
            setLoading2(false);
            setShowConfirmModal(false);
            setSelectedCategory(null);
        }
    }

    const closeConfirmModal = () => {
        setShowConfirmModal(false);
        setSelectedCategory(null);
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
      <h2>Categorías de Catálogo</h2>
      <div className="wrapperTableIndex">
      <div className={styles.filterBarContainer}>
        <Button variant="primary" size="md" onClick={() => navigate('/admin/nueva-categoria')}>Nueva categoría</Button>
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
        columns={catalogCategoriesTableColumns}
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
        message={`¿Estás seguro de que deseas ${selectedCategory?.status === 'Activo' ? 'desactivar' : 'activar'} la categoría "${selectedCategory?.name}"?`}
        confirmText={selectedCategory?.status === 'Activo' ? 'Desactivar' : 'Activar'}
        cancelText="Cancelar"
        type="warning"
        loading={loading2}
      />
    </div>
  )
}

