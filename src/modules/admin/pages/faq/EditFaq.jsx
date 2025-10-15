import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFaq } from '@/modules/admin/services/faq.service';
import { faqAdapterGet } from '@/modules/admin/pages/faq/adapters/faq.adapter.get';
import { FaqForm } from '@/modules/admin/pages/faq/components/FaqForm';
import { BreadCrumb } from '@/components/data-display/breadCrumb/BreadCrumb';
import { FaRegListAlt } from 'react-icons/fa';
import { useToast } from '@/context/ToastContext';
import { FormSkeleton } from '../../../../components/form/FormSkeleton';

export const EditFaq = () => {
  const { id } = useParams();
  const [faq, setFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFaq = async () => {
      setLoading(true);
      try {
        const response = await getFaq(id);
        setFaq(faqAdapterGet(response));
      } catch(error) {
        showToast(error.response?.data?.message || 'Error al cargar la pregunta frecuente', 'error', 'Error');
        navigate('/admin/preguntas-frecuentes');
      } finally {
        setLoading(false);
      }
    };
    fetchFaq();
  }, [id, showToast, navigate]);

  const handleSuccess = () => {
    showToast('Pregunta frecuente editada exitosamente.', 'success', '¡Éxito!');
    setTimeout(() => {
      navigate('/admin/preguntas-frecuentes');
    }, 200);
  };

  return (
    <div>
      <BreadCrumb items={[
        { label: 'Preguntas Frecuentes', to: '/admin/preguntas-frecuentes', icon: <FaRegListAlt /> },
        { label: 'Editar pregunta frecuente' }
      ]} />
      <h2>Editar pregunta frecuente</h2>
      {loading ? (
        <FormSkeleton />
      ) : faq ? (
        <FaqForm initialData={faq} onSuccess={handleSuccess} />
      ) : null}
    </div>
  );
};

