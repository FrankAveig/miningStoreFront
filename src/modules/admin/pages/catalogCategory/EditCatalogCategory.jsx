import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCatalogCategory } from '@/modules/admin/services/catalogCategories.service';
import { catalogCategoryAdapterGet } from '@/modules/admin/pages/catalogCategory/adapters/catalogCategory.adapter.get';
import { CatalogCategoryForm } from '@/modules/admin/pages/catalogCategory/components/CatalogCategoryForm';
import { BreadCrumb } from '@/components/data-display/breadCrumb/BreadCrumb';
import { FaRegListAlt } from 'react-icons/fa';
import { useToast } from '@/context/ToastContext';
import { FormSkeleton } from '../../../../components/form/FormSkeleton';

export const EditCatalogCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const response = await getCatalogCategory(id);
        setCategory(catalogCategoryAdapterGet(response));
      } catch(error) {
        showToast(error.response?.data?.message || 'Error al cargar la categoría', 'error', 'Error');
        navigate('/admin/categorias');
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id, showToast, navigate]);

  const handleSuccess = () => {
    showToast('Categoría editada exitosamente.', 'success', '¡Éxito!');
    setTimeout(() => {
      navigate('/admin/categorias');
    }, 200);
  };

  return (
    <div>
      <BreadCrumb items={[
        { label: 'Categorías', to: '/admin/categorias', icon: <FaRegListAlt /> },
        { label: 'Editar categoría' }
      ]} />
      <h2>Editar categoría</h2>
      {loading ? (
        <FormSkeleton />
      ) : category ? (
        <CatalogCategoryForm initialData={category} onSuccess={handleSuccess} />
      ) : null}
    </div>
  );
};

