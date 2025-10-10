import { ServiceForm } from '@/modules/admin/pages/service/components/ServiceForm';
import { useToast } from '@/context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { BreadCrumb } from '@/components/data-display/breadCrumb/BreadCrumb';
import { FaRegListAlt } from 'react-icons/fa';

export const NewService = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSuccess = () => {
    showToast(
      'Servicio creado exitosamente.',
      'success',
      '¡Éxito!'
    );
    setTimeout(() => {
      navigate('/admin/servicios');
    }, 200);
  };

  return (
    <div>
      <BreadCrumb items={[
        { label: 'Servicios', to: '/admin/servicios', icon: <FaRegListAlt /> },
        { label: 'Nuevo servicio' }
      ]} />
      <h2>Nuevo servicio</h2>
      <ServiceForm onSuccess={handleSuccess} />
    </div>
  );
};

