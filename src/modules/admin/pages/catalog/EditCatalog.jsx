import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCatalogItem } from '@/modules/admin/services/catalog.service';
import { catalogAdapterGet } from '@/modules/admin/pages/catalog/adapters/catalog.adapter.get';
import { CatalogForm } from '@/modules/admin/pages/catalog/components/CatalogForm';
import { CatalogCryptocurrencies } from '@/modules/admin/pages/catalog/components/CatalogCryptocurrencies';
import { CatalogShippingPrices } from '@/modules/admin/pages/catalog/components/CatalogShippingPrices';
import { BreadCrumb } from '@/components/data-display/breadCrumb/BreadCrumb';
import { FaRegListAlt } from 'react-icons/fa';
import { useToast } from '@/context/ToastContext';
import { FormSkeleton } from '../../../../components/form/FormSkeleton';

export const EditCatalog = () => {
  const { id } = useParams();
  const [catalogItem, setCatalogItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCatalogItem = async () => {
      setLoading(true);
      try {
        const response = await getCatalogItem(id);
        setCatalogItem(catalogAdapterGet(response));
      } catch(error) {
        showToast(error.response?.data?.message || 'Error al cargar el producto', 'error', 'Error');
        navigate('/admin/catalogo');
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogItem();
  }, [id, showToast, navigate]);

  const handleSuccess = () => {
    showToast('Producto editado exitosamente.', 'success', '¡Éxito!');
    setTimeout(() => {
      navigate('/admin/catalogo');
    }, 200);
  };

  return (
    <div>
      <BreadCrumb items={[
        { label: 'Catálogo', to: '/admin/catalogo', icon: <FaRegListAlt /> },
        { label: 'Editar producto' }
      ]} />
      <h2>Editar producto</h2>
      {loading ? (
        <FormSkeleton />
      ) : catalogItem ? (
        <>
          <CatalogForm initialData={catalogItem} onSuccess={handleSuccess} />
          <CatalogCryptocurrencies catalogId={id} />
          <CatalogShippingPrices catalogId={id} />
        </>
      ) : null}
    </div>
  );
};

