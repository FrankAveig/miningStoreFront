import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getElectricityPrice } from '@/modules/admin/services/electricityPrices.service';
import { electricityPriceAdapterGet } from '@/modules/admin/pages/electricityPrice/adapters/electricityPrice.adapter.get';
import { ElectricityPriceForm } from '@/modules/admin/pages/electricityPrice/components/ElectricityPriceForm';
import { BreadCrumb } from '@/components/data-display/breadCrumb/BreadCrumb';
import { FaRegListAlt } from 'react-icons/fa';
import { useToast } from '@/context/ToastContext';
import { FormSkeleton } from '../../../../components/form/FormSkeleton';

export const EditElectricityPrice = () => {
  const { id } = useParams();
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrice = async () => {
      setLoading(true);
      try {
        const response = await getElectricityPrice(id);
        setPrice(electricityPriceAdapterGet(response));
      } catch(error) {
        showToast(error.response?.data?.message || 'Error al cargar el precio', 'error', 'Error');
        navigate('/admin/precios-electricidad');
      } finally {
        setLoading(false);
      }
    };
    fetchPrice();
  }, [id, showToast, navigate]);

  const handleSuccess = () => {
    showToast('Precio editado exitosamente.', 'success', '¡Éxito!');
    setTimeout(() => {
      navigate('/admin/precios-electricidad');
    }, 200);
  };

  return (
    <div>
      <BreadCrumb items={[
        { label: 'Precios de Electricidad', to: '/admin/precios-electricidad', icon: <FaRegListAlt /> },
        { label: 'Editar precio' }
      ]} />
      <h2>Editar precio de electricidad</h2>
      {loading ? (
        <FormSkeleton />
      ) : price ? (
        <ElectricityPriceForm initialData={price} onSuccess={handleSuccess} />
      ) : null}
    </div>
  );
};

