import { CryptocurrencyForm } from '@/modules/admin/pages/cryptocurrency/components/CryptocurrencyForm';
import { useToast } from '@/context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { BreadCrumb } from '@/components/data-display/breadCrumb/BreadCrumb';
import { FaRegListAlt } from 'react-icons/fa';

export const NewCryptocurrency = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSuccess = () => {
    showToast(
      'Criptomoneda creada exitosamente.',
      'success',
      '¡Éxito!'
    );
    setTimeout(() => {
      navigate('/admin/criptomonedas');
    }, 200);
  };

  return (
    <div>
      <BreadCrumb items={[
        { label: 'Criptomonedas', to: '/admin/criptomonedas', icon: <FaRegListAlt /> },
        { label: 'Nueva criptomoneda' }
      ]} />
      <h2>Nueva criptomoneda</h2>
      <CryptocurrencyForm onSuccess={handleSuccess} />
    </div>
  );
};

