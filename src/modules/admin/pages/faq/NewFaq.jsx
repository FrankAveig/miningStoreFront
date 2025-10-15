import { FaqForm } from '@/modules/admin/pages/faq/components/FaqForm';
import { useToast } from '@/context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { BreadCrumb } from '@/components/data-display/breadCrumb/BreadCrumb';
import { FaRegListAlt } from 'react-icons/fa';

export const NewFaq = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSuccess = () => {
    showToast(
      'Pregunta frecuente creada exitosamente.',
      'success',
      '¡Éxito!'
    );
    setTimeout(() => {
      navigate('/admin/preguntas-frecuentes');
    }, 200);
  };

  return (
    <div>
      <BreadCrumb items={[
        { label: 'Preguntas Frecuentes', to: '/admin/preguntas-frecuentes', icon: <FaRegListAlt /> },
        { label: 'Nueva pregunta frecuente' }
      ]} />
      <h2>Nueva pregunta frecuente</h2>
      <FaqForm onSuccess={handleSuccess} />
    </div>
  );
};

