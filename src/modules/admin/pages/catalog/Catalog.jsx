import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PaginatedTable } from '@/components/data-display/paginatedTable/PaginatedTable'
import { getCatalogItems, toggleCatalogItemStatus, deleteCatalogItemPermanent, updateCatalogItemStock } from '@/modules/admin/services/catalog.service'
import { catalogTableColumns } from './constants/catalogConstants'
import { catalogAdapterList } from './adapters/catalog.adapter.list'
import { MdModeEdit, MdDeleteForever, MdInventory } from 'react-icons/md';
import { usePaginatedFetch } from '@/hooks/usePaginatedFetch';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button/Button';
import { ConfirmationModal } from '@/components/data-display/confirmationModal/ConfirmationModal';
import { FilterBar } from '@/components/data-display/FilterBar/FilterBar';
import { Modal, useModal } from '@/components/ui/modal/Modal';
import { Switch } from '@/components/ui/switch/Switch';
import styles from './catalog.module.scss';

export const Catalog = () => {
    const navigate = useNavigate();
    const [loading2, setLoading2] = React.useState(false);
    const [loadingPermanentDelete, setLoadingPermanentDelete] = React.useState(false);
    const [showConfirmModal, setShowConfirmModal] = React.useState(false);
    const [showPermanentDeleteModal, setShowPermanentDeleteModal] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState(null);
    const [itemToDeletePermanent, setItemToDeletePermanent] = React.useState(null);
    const { showToast } = useToast();

    const { open: stockModalOpen, openModal: openStockModal, closeModal: closeStockModal } = useModal();
    const [stockItem, setStockItem] = React.useState(null);
    const [stockAvailable, setStockAvailable] = React.useState(false);
    const [loadingStock, setLoadingStock] = React.useState(false);

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
            const response = await getCatalogItems(
                page, 
                limit, 
                filters.term || '', 
                filters.categoryId || '', 
                filters.algorithm || ''
            );
            return {
                data: catalogAdapterList(response),
                pagination: response.data?.pagination
            };
        },
        { term: '', categoryId: '', algorithm: '' }
    );

    const handleEdit = (item) => {
        navigate(`/admin/catalogo/${item.id}`)
    }

    const handleToggleStatus = async (item) => {
        setSelectedItem(item);
        setShowConfirmModal(true);
    }

    const confirmToggleStatus = async () => {
        if (!selectedItem) return;
        
        setLoading2(true);
        try {
            await toggleCatalogItemStatus(selectedItem.id);
            forceRefetch();
            showToast(
                `Producto ${selectedItem.status === 'Activo' ? 'desactivado' : 'activado'} exitosamente.`,
                'success',
                '¡Éxito!'
            );
        } catch (error) {
            showToast(error.response?.data?.message || 'Error al cambiar estado', 'error', 'Error');
        } finally {
            setLoading2(false);
            setShowConfirmModal(false);
            setSelectedItem(null);
        }
    }

    const closePermanentDeleteModal = () => {
        if (loadingPermanentDelete) return;
        setShowPermanentDeleteModal(false);
        setItemToDeletePermanent(null);
    }

    const handlePermanentDeleteRequest = (item) => {
        setItemToDeletePermanent(item);
        setShowPermanentDeleteModal(true);
    }

    const confirmPermanentDelete = async () => {
        if (!itemToDeletePermanent) return;
        setLoadingPermanentDelete(true);
        try {
            await deleteCatalogItemPermanent(itemToDeletePermanent.id);
            forceRefetch();
            showToast(
                'El producto fue eliminado permanentemente de la base de datos.',
                'success',
                'Eliminado'
            );
        } catch (error) {
            showToast(
                error.response?.data?.message || 'Error al eliminar el producto',
                'error',
                'Error'
            );
        } finally {
            setLoadingPermanentDelete(false);
            setShowPermanentDeleteModal(false);
            setItemToDeletePermanent(null);
        }
    }

    const closeConfirmModal = () => {
        setShowConfirmModal(false);
        setSelectedItem(null);
    }

    const handleOpenStockModal = (item) => {
        setStockItem(item);
        setStockAvailable(Boolean(item.stock_available));
        openStockModal();
    }

    const handleCloseStockModal = () => {
        if (loadingStock) return;
        closeStockModal();
        setStockItem(null);
        setStockAvailable(false);
    }

    const handleSaveStock = async () => {
        if (!stockItem) return;
        setLoadingStock(true);
        try {
            await updateCatalogItemStock(stockItem.id, stockAvailable);
            forceRefetch();
            showToast(
                `Inventario de "${stockItem.name}" actualizado: ${stockAvailable ? 'Disponible' : 'Sin stock'}.`,
                'success',
                '¡Éxito!'
            );
            handleCloseStockModal();
        } catch (error) {
            showToast(error.response?.data?.message || 'Error al actualizar el inventario', 'error', 'Error');
        } finally {
            setLoadingStock(false);
        }
    }

    const actions = [
        {
          icon: MdModeEdit,
          tooltip: 'Editar',
          onClick: handleEdit,
          className: 'action-button'
        },
        {
          icon: MdInventory,
          tooltip: 'Actualizar inventario',
          onClick: handleOpenStockModal,
          className: 'action-button'
        },
        {
          icon: MdDeleteForever,
          tooltip: 'Eliminar permanentemente',
          onClick: handlePermanentDeleteRequest,
          className: 'action-button'
        },
        {
          type: 'switch',
          isChecked: (item) => item.status === 'Activo',
          onChange: (item) => {
            handleToggleStatus(item)
          },
          disabled: loading2 || loadingPermanentDelete,
          color: (item) => item.is_active ? 'success' : 'error'
        }
      ];

  return (
    <div>
      <h2>Catálogo de Productos</h2>
      <div className="wrapperTableIndex">
      <div className={styles.filterBarContainer}>
        <Button variant="primary" size="md" onClick={() => navigate('/admin/nuevo-producto')}>Nuevo producto</Button>
        <FilterBar
          fields={[
            { name: 'term', label: 'Buscar', type: 'string' },
            { name: 'categoryId', label: 'ID Categoría', type: 'string' },
            { name: 'algorithm', label: 'Algoritmo', type: 'string' },
          ]}
          onFilter={setFilters}
          initialValues={filters}
        />
      </div>
      <PaginatedTable
        dataToPresent={data}
        columns={catalogTableColumns}
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
        message={`¿Estás seguro de que deseas ${selectedItem?.status === 'Activo' ? 'desactivar' : 'activar'} el producto "${selectedItem?.name}"?`}
        confirmText={selectedItem?.status === 'Activo' ? 'Desactivar' : 'Activar'}
        cancelText="Cancelar"
        type="warning"
        loading={loading2}
      />
      <ConfirmationModal
        isOpen={showPermanentDeleteModal}
        onClose={closePermanentDeleteModal}
        onConfirm={confirmPermanentDelete}
        title="Eliminar producto permanentemente"
        message={
          itemToDeletePermanent
            ? `Vas a borrar de forma irreversible «${itemToDeletePermanent.name}» (ID ${itemToDeletePermanent.id}). Se quitarán relaciones, precios de envío asociados e imágenes en el servidor. Los pedidos antiguos se conservan, pero dejarán de enlazar a este producto. ¿Continuar?`
            : ''
        }
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
        loading={loadingPermanentDelete}
      />

      <Modal open={stockModalOpen} onClose={handleCloseStockModal} ariaTitleId="stock-modal-title">
        <Modal.Header onClose={handleCloseStockModal}>
          <Modal.Title id="stock-modal-title">Actualizar inventario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {stockItem && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ margin: 0 }}>
                <strong>Producto:</strong> {stockItem.name}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Estado actual:</strong> {stockItem.stock}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <span style={{ fontWeight: 600 }}>¿Producto disponible?</span>
                <Switch
                  isChecked={stockAvailable}
                  onChange={() => setStockAvailable((prev) => !prev)}
                  disabled={loadingStock}
                  size="medium"
                  color={stockAvailable ? 'success' : 'error'}
                />
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary, #666)' }}>
                {stockAvailable ? 'El producto se podrá agregar al carrito.' : 'El producto aparecerá como sin stock en la tienda.'}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="md" onClick={handleCloseStockModal} disabled={loadingStock}>
            Cancelar
          </Button>
          <Button variant="primary" size="md" onClick={handleSaveStock} disabled={loadingStock}>
            {loadingStock ? 'Guardando...' : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

