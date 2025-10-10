import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCryptocurrency } from '@/modules/admin/services/cryptocurrencies.service';
import { cryptocurrencyAdapterGet } from '@/modules/admin/pages/cryptocurrency/adapters/cryptocurrency.adapter.get';
import { CryptocurrencyForm } from '@/modules/admin/pages/cryptocurrency/components/CryptocurrencyForm';
import { BreadCrumb } from '@/components/data-display/breadCrumb/BreadCrumb';
import { FaRegListAlt } from 'react-icons/fa';
import { useToast } from '@/context/ToastContext';
import { FormSkeleton } from '../../../../components/form/FormSkeleton';

export const EditCryptocurrency = () => {
  const { id } = useParams();
  const [cryptocurrency, setCryptocurrency] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCryptocurrency = async () => {
      setLoading(true);
      try {
        const response = await getCryptocurrency(id);
        setCryptocurrency(cryptocurrencyAdapterGet(response));
      } catch(error) {
        showToast(error.response?.data?.message || 'Error al cargar la criptomoneda', 'error', 'Error');
        navigate('/admin/criptomonedas');
      } finally {
        setLoading(false);
      }
    };
    fetchCryptocurrency();
  }, [id, showToast, navigate]);

  const handleSuccess = () => {
    showToast('Criptomoneda editada exitosamente.', 'success', '¡Éxito!');
    setTimeout(() => {
      navigate('/admin/criptomonedas');
    }, 200);
  };

  return (
    <div>
      <BreadCrumb items={[
        { label: 'Criptomonedas', to: '/admin/criptomonedas', icon: <FaRegListAlt /> },
        { label: 'Editar criptomoneda' }
      ]} />
      <h2>Editar criptomoneda</h2>
      {loading ? (
        <FormSkeleton />
      ) : cryptocurrency ? (
        <CryptocurrencyForm initialData={cryptocurrency} onSuccess={handleSuccess} />
      ) : null}
    </div>
  );
};

