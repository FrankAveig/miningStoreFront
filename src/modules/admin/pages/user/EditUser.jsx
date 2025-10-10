import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser } from '@/modules/admin/services/users.service';
import { userAdapterGet } from '@/modules/admin/pages/user/adapters/user.adapter.get';
import { UserForm } from '@/modules/admin/pages/user/components/UserForm';
import { BreadCrumb } from '@/components/data-display/breadCrumb/BreadCrumb';
import { FaRegListAlt } from 'react-icons/fa';
import { useToast } from '@/context/ToastContext';
import { FormSkeleton } from '../../../../components/form/FormSkeleton';

export const EditUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await getUser(id);
        setUser(userAdapterGet(response));
      } catch(error) {
        showToast(error.response.data.message, 'error', 'Error');
        navigate('/admin/usuarios');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, showToast, navigate]);

  const handleSuccess = () => {
    showToast('Usuario editado exitosamente.', 'success', '¡Éxito!');
    setTimeout(() => {
      navigate('/admin/usuarios');
    }, 200);
  };

  return (
    <div>
      <BreadCrumb items={[
        { label: 'Usuarios', to: '/admin/usuarios', icon: <FaRegListAlt /> },
        { label: 'Editar usuario' }
      ]} />
      <h2>Editar usuario</h2>
      {loading ? (
        <FormSkeleton />
      ) : user ? (
        <UserForm initialData={user} onSuccess={handleSuccess} />
      ) : null}
    </div>
  );
}; 