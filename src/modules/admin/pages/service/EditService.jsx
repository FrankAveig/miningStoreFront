import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getService } from '@/modules/admin/services/services.service';
import { serviceAdapterGet } from '@/modules/admin/pages/service/adapters/service.adapter.get';
import { ServiceForm } from '@/modules/admin/pages/service/components/ServiceForm';
import { BreadCrumb } from '@/components/data-display/breadCrumb/BreadCrumb';
import { FaRegListAlt } from 'react-icons/fa';
import { useToast } from '@/context/ToastContext';
import { FormSkeleton } from '../../../../components/form/FormSkeleton';

export const EditService = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const response = await getService(id);
        setService(serviceAdapterGet(response));
      } catch(error) {
        showToast(error.response?.data?.message || 'Error al cargar el servicio', 'error', 'Error');
        navigate('/admin/servicios');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id, showToast, navigate]);

  const handleSuccess = () => {
    showToast('Servicio editado exitosamente.', 'success', '¡Éxito!');
    setTimeout(() => {
      navigate('/admin/servicios');
    }, 200);
  };

  return (
    <div>
      <BreadCrumb items={[
        { label: 'Servicios', to: '/admin/servicios', icon: <FaRegListAlt /> },
        { label: 'Editar servicio' }
      ]} />
      <h2>Editar servicio</h2>
      {loading ? (
        <FormSkeleton />
      ) : service ? (
        <ServiceForm initialData={service} onSuccess={handleSuccess} />
      ) : null}
    </div>
  );
};

