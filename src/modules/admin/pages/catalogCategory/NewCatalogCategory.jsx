import { CatalogCategoryForm } from '@/modules/admin/pages/catalogCategory/components/CatalogCategoryForm';
import { useToast } from '@/context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { BreadCrumb } from '@/components/data-display/breadCrumb/BreadCrumb';
import { FaRegListAlt } from 'react-icons/fa';

export const NewCatalogCategory = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSuccess = () => {
    showToast(
      'Categoría creada exitosamente.',
      'success',
      '¡Éxito!'
    );
    setTimeout(() => {
      navigate('/admin/categorias');
    }, 200);
  };

  return (
    <div>
      <BreadCrumb items={[
        { label: 'Categorías', to: '/admin/categorias', icon: <FaRegListAlt /> },
        { label: 'Nueva categoría' }
      ]} />
      <h2>Nueva categoría</h2>
      <CatalogCategoryForm onSuccess={handleSuccess} />
    </div>
  );
};

