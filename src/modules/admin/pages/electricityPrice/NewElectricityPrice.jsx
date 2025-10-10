import { ElectricityPriceForm } from '@/modules/admin/pages/electricityPrice/components/ElectricityPriceForm';
import { useToast } from '@/context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { BreadCrumb } from '@/components/data-display/breadCrumb/BreadCrumb';
import { FaRegListAlt } from 'react-icons/fa';

export const NewElectricityPrice = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSuccess = () => {
    showToast(
      'Precio creado exitosamente.',
      'success',
      '¡Éxito!'
    );
    setTimeout(() => {
      navigate('/admin/precios-electricidad');
    }, 200);
  };

  return (
    <div>
      <BreadCrumb items={[
        { label: 'Precios de Electricidad', to: '/admin/precios-electricidad', icon: <FaRegListAlt /> },
        { label: 'Nuevo precio' }
      ]} />
      <h2>Nuevo precio de electricidad</h2>
      <ElectricityPriceForm onSuccess={handleSuccess} />
    </div>
  );
};

