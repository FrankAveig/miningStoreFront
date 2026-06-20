import { HeroSlideForm } from '@/modules/admin/pages/heroSlide/components/HeroSlideForm';
import { useToast } from '@/context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { BreadCrumb } from '@/components/data-display/breadCrumb/BreadCrumb';
import { FaImages } from 'react-icons/fa';

export const NewHeroSlide = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSuccess = () => {
    showToast('Slide creado exitosamente.', 'success', '¡Éxito!');
    setTimeout(() => {
      navigate('/admin/banners-hero');
    }, 200);
  };

  return (
    <div>
      <BreadCrumb items={[
        { label: 'Banners del Hero', to: '/admin/banners-hero', icon: <FaImages /> },
        { label: 'Nuevo slide' }
      ]} />
      <h2>Nuevo slide de imagen</h2>
      <HeroSlideForm onSuccess={handleSuccess} />
    </div>
  );
};
