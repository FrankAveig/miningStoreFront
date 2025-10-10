import { CatalogForm } from '@/modules/admin/pages/catalog/components/CatalogForm';
import { useToast } from '@/context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { BreadCrumb } from '@/components/data-display/breadCrumb/BreadCrumb';
import { FaRegListAlt } from 'react-icons/fa';

export const NewCatalog = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSuccess = () => {
    showToast(
      'Producto creado exitosamente.',
      'success',
      '¡Éxito!'
    );
    setTimeout(() => {
      navigate('/admin/catalogo');
    }, 200);
  };

  return (
    <div>
      <BreadCrumb items={[
        { label: 'Catálogo', to: '/admin/catalogo', icon: <FaRegListAlt /> },
        { label: 'Nuevo producto' }
      ]} />
      <h2>Nuevo producto</h2>
      <CatalogForm onSuccess={handleSuccess} />
    </div>
  );
};

