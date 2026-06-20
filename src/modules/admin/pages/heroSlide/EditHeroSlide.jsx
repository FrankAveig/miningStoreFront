import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHeroSlide } from '@/modules/admin/services/heroSlides.service';
import { heroSlideAdapterGet } from '@/modules/admin/pages/heroSlide/adapters/heroSlide.adapter.get';
import { HeroSlideForm } from '@/modules/admin/pages/heroSlide/components/HeroSlideForm';
import { BreadCrumb } from '@/components/data-display/breadCrumb/BreadCrumb';
import { FaImages } from 'react-icons/fa';
import { useToast } from '@/context/ToastContext';
import { FormSkeleton } from '../../../../components/form/FormSkeleton';

export const EditHeroSlide = () => {
  const { id } = useParams();
  const [slide, setSlide] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlide = async () => {
      setLoading(true);
      try {
        const response = await getHeroSlide(id);
        const adapted = heroSlideAdapterGet(response);
        if (adapted && (adapted.type === 'collab' || adapted.type === 'ms_pool')) {
          showToast('Los slides de código no se pueden editar.', 'error', 'Error');
          navigate('/admin/banners-hero');
          return;
        }
        setSlide(adapted);
      } catch (error) {
        showToast(error.response?.data?.message || 'Error al cargar el slide', 'error', 'Error');
        navigate('/admin/banners-hero');
      } finally {
        setLoading(false);
      }
    };
    fetchSlide();
  }, [id, showToast, navigate]);

  const handleSuccess = () => {
    showToast('Slide editado exitosamente.', 'success', '¡Éxito!');
    setTimeout(() => {
      navigate('/admin/banners-hero');
    }, 200);
  };

  return (
    <div>
      <BreadCrumb items={[
        { label: 'Banners del Hero', to: '/admin/banners-hero', icon: <FaImages /> },
        { label: 'Editar slide' }
      ]} />
      <h2>Editar slide de imagen</h2>
      {loading ? (
        <FormSkeleton />
      ) : slide ? (
        <HeroSlideForm initialData={slide} onSuccess={handleSuccess} />
      ) : null}
    </div>
  );
};
