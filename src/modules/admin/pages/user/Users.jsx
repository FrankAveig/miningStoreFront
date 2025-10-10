import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PaginatedTable } from '@/components/data-display/paginatedTable/PaginatedTable'
import { getUsers, toggleUserStatus } from '@/modules/admin/services/users.service'
import { usersTableColumns } from './constants/userConstants'
import { userAdapterList } from './adapters/user.adapter.list'
import { MdModeEdit } from 'react-icons/md';
import { usePaginatedFetch } from '@/hooks/usePaginatedFetch';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button/Button';
import { ConfirmationModal } from '@/components/data-display/confirmationModal/ConfirmationModal';
import styles from './users.module.scss';

export const Users = () => {
    const navigate = useNavigate();
    const [loading2, setLoading2] = React.useState(false);
    const [showConfirmModal, setShowConfirmModal] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState(null);
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
            const response = await getUsers(page, limit);
            return {
                data: userAdapterList(response),
                pagination: response.data?.pagination
            };
        }
    );

    const handleEdit = (user) => {
        navigate(`/admin/usuarios/${user.id}`)
    }



    const handleToggleStatus = async (user) => {
        setSelectedUser(user);
        setShowConfirmModal(true);
    }

    const confirmToggleStatus = async () => {
        if (!selectedUser) return;
        
        setLoading2(true);
        try {
            await toggleUserStatus(selectedUser.id);
            forceRefetch();
            showToast(
                `Usuario ${selectedUser.status === 'Activo' ? 'desactivado' : 'activado'} exitosamente.`,
                'success',
                '¡Éxito!'
            );
        } catch (error) {
            showToast(error.response.data.message, 'error', 'Error');
        } finally {
            setLoading2(false);
            setShowConfirmModal(false);
            setSelectedUser(null);
        }
    }

    const closeConfirmModal = () => {
        setShowConfirmModal(false);
        setSelectedUser(null);
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
      <h2>Usuarios</h2>
      <div className="wrapperTableIndex">
      <div className={styles.filterBarContainer}>
        <Button variant="primary" size="md" onClick={() => navigate('/admin/nuevo-usuario')}>Nuevo usuario</Button>
      </div>
      <PaginatedTable
        dataToPresent={data}
        columns={usersTableColumns}
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
        message={`¿Estás seguro de que deseas ${selectedUser?.status === 'Activo' ? 'desactivar' : 'activar'} al usuario "${selectedUser?.name}"?`}
        confirmText={selectedUser?.status === 'Activo' ? 'Desactivar' : 'Activar'}
        cancelText="Cancelar"
        type="warning"
        loading={loading2}
      />
    </div>
  )
}
