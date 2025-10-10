import { UserForm } from '@/modules/admin/pages/user/components/UserForm';
import { useToast } from '@/context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { BreadCrumb } from '@/components/data-display/breadCrumb/BreadCrumb';
import { FaRegListAlt } from 'react-icons/fa';

export const NewUser = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSuccess = () => {
    showToast(
      'Usuario creado exitosamente.',
      'success',
      '¡Éxito!'
    );
    setTimeout(() => {
      navigate('/admin/usuarios');
    }, 200);
  };

  return (
    <div>
      <BreadCrumb items={[
        { label: 'Usuarios', to: '/admin/usuarios', icon: <FaRegListAlt /> },
        { label: 'Nuevo usuario' }
      ]} />
      <h2>Nuevo usuario</h2>
      <UserForm onSuccess={handleSuccess} />
    </div>
  );
}; 