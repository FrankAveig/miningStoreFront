import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './heroSlideForm.module.scss';
import { InputField } from '@/components/form/inputField/InputField';
import { SelectField } from '@/components/form/selectField/SelectField';
import { FileDropzone } from '@/components/data-display/fileDropZone/FileDropzone';
import { Button } from '@/components/ui/button/Button';
import { createHeroSlide, updateHeroSlide } from '@/modules/admin/services/heroSlides.service';
import { useToast } from '@/context/ToastContext';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
];

export const HeroSlideForm = ({ onSuccess, initialData }) => {
  const [form, setForm] = useState({
    title: '',
    link_url: '',
    sort_order: 0,
    status: 'active',
    image: null,
    image_mobile: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [previewImage, setPreviewImage] = useState(null);
  const [previewMobile, setPreviewMobile] = useState(null);
  const [removeMobile, setRemoveMobile] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        link_url: initialData.link_url || '',
        sort_order: Number(initialData.sort_order || 0),
        status: initialData.status || 'active',
        image: null,
        image_mobile: null,
        id: initialData.id || undefined,
      });
      setPreviewImage(initialData.image_url || null);
      setPreviewMobile(initialData.image_mobile_url || null);
      setRemoveMobile(false);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (file) => {
    setForm((prev) => ({ ...prev, image: file }));
    setErrors((prev) => ({ ...prev, image: '' }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleMobileChange = (file) => {
    setForm((prev) => ({ ...prev, image_mobile: file }));
    setRemoveMobile(false);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewMobile(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMobile = () => {
    setForm((prev) => ({ ...prev, image_mobile: null }));
    setPreviewMobile(null);
    setRemoveMobile(true);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.id && !form.image) newErrors.image = 'La imagen de escritorio es requerida';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const submitData = {
        title: form.title.trim(),
        link_url: form.link_url?.trim() || '',
        sort_order: Number(form.sort_order || 0),
        status: form.status,
      };
      if (form.image) submitData.image = form.image;
      if (form.image_mobile) submitData.image_mobile = form.image_mobile;
      if (removeMobile) submitData.remove_image_mobile = true;

      if (form.id) {
        await updateHeroSlide(form.id, submitData);
      } else {
        await createHeroSlide(submitData);
        setForm({ title: '', link_url: '', sort_order: 0, status: 'active', image: null, image_mobile: null });
        setPreviewImage(null);
        setPreviewMobile(null);
      }
      setErrors({});
      if (onSuccess) onSuccess();
    } catch (error) {
      const message = error?.response?.data?.message || 'Error al guardar el slide';
      showToast(message, 'error', 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.formContainer}>
      <div className={styles.formGroup}>
        <InputField
          label="Título / texto alternativo (opcional)"
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          size="md"
          placeholder="Ej: Promo mineros ASIC"
        />
        <InputField
          label="Orden"
          id="sort_order"
          name="sort_order"
          type="number"
          value={form.sort_order}
          onChange={handleChange}
          size="md"
          placeholder="0"
        />
      </div>

      <div className={styles.formGroup}>
        <InputField
          label="URL destino al hacer clic (opcional)"
          id="link_url"
          name="link_url"
          value={form.link_url}
          onChange={handleChange}
          size="md"
          placeholder="./catalog.html o https://..."
        />
        <SelectField
          label="Estado"
          id="status"
          name="status"
          value={form.status}
          onChange={handleChange}
          options={STATUS_OPTIONS}
          size="md"
        />
      </div>

      <div className={styles.formGroup}>
        <div className={styles.imageSection}>
          <label className={styles.imageLabel}>
            Imagen de escritorio {!form.id && <span className={styles.required}>*</span>}
          </label>
          {previewImage && (
            <div className={styles.imagePreview}>
              <img src={previewImage} alt="Preview escritorio" className={styles.previewImg} />
            </div>
          )}
          <FileDropzone
            label={form.id ? 'Cambiar imagen (opcional)' : 'Selecciona una imagen'}
            accept=".png,.jpg,.jpeg,.webp"
            value={form.image}
            onChange={handleImageChange}
            enableCropper={true}
            aspectRatio={16 / 9}
          />
          <p className={styles.hint}>Se muestra a pantalla completa (recomendado 16:9, horizontal).</p>
          {errors.image && <span className={styles.errorText}>{errors.image}</span>}
        </div>
      </div>

      <div className={styles.formGroup}>
        <div className={styles.imageSection}>
          <label className={styles.imageLabel}>Imagen para móvil (opcional)</label>
          {previewMobile && (
            <div className={styles.imagePreview}>
              <img src={previewMobile} alt="Preview móvil" className={styles.previewImg} />
            </div>
          )}
          <FileDropzone
            label="Selecciona una imagen para móvil"
            accept=".png,.jpg,.jpeg,.webp"
            value={form.image_mobile}
            onChange={handleMobileChange}
            enableCropper={true}
            aspectRatio={9 / 16}
          />
          <p className={styles.hint}>Si no la subes, se usará la imagen de escritorio en móvil.</p>
          {previewMobile && (
            <button type="button" className={styles.removeMobileBtn} onClick={handleRemoveMobile}>
              Quitar imagen móvil
            </button>
          )}
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <Button type="submit" variant="primary" size="md" isLoading={loading} fullWidth>
          {form.id ? 'Guardar cambios' : 'Crear slide'}
        </Button>
      </div>
    </form>
  );
};

HeroSlideForm.propTypes = {
  onSuccess: PropTypes.func,
  initialData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    image_url: PropTypes.string,
    image_mobile_url: PropTypes.string,
    link_url: PropTypes.string,
    sort_order: PropTypes.number,
    status: PropTypes.string,
  }),
};
