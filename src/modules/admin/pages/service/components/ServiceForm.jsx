import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './serviceForm.module.scss';
import { InputField } from '@/components/form/inputField/InputField';
import { TextareaField } from '@/components/form/textareaField/TextareaField';
import { FileDropzone } from '@/components/data-display/fileDropZone/FileDropzone';
import { Button } from '@/components/ui/button/Button';
import { createService, updateService } from '@/modules/admin/services/services.service';
import { useToast } from '@/context/ToastContext';

export const ServiceForm = ({ onSuccess, initialData }) => {
  const [form, setForm] = useState({ 
    name: '', 
    description: '',
    image: null,
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        image: null,
        status: initialData.status || 'active',
        id: initialData.id || undefined
      });
      setPreviewImage(initialData.image_url || null);
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
    
    // Crear preview de la imagen
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!form.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!form.id && !form.image) newErrors.image = 'La imagen es requerida';
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
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status
      };

      if (form.image) {
        submitData.image = form.image;
      }

      if (form.id) {
        await updateService(form.id, submitData);
      } else {
        await createService(submitData);
        setForm({ name: '', description: '', image: null, status: 'active' });
        setPreviewImage(null);
      }
      setErrors({});
      if (onSuccess) onSuccess();
    } catch (error) {
      let message = 'Error al guardar el servicio';
      let fieldErrors = {};
      if (error?.response?.data) {
        const data = error.response.data;
        if (data.message) message = data.message;
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, msgs]) => {
            fieldErrors[field] = Array.isArray(msgs) ? msgs[0] : msgs;
          });
        }
      }
      setErrors(fieldErrors);
      showToast(message, 'error', 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.formContainer}>
      <div className={styles.formGroup}>
        <InputField
          label="Nombre"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          isRequired
          error={errors.name}
          placeholder="Ej: Hosting Premium"
          size="md"
        />
      </div>
      <div className={styles.formGroup}>
        <TextareaField
          label="Descripción"
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          isRequired
          error={errors.description}
          placeholder="Describe el servicio..."
          size="md"
          rows={4}
        />
      </div>
      <div className={styles.formGroup}>
        <div className={styles.imageSection}>
          <label className={styles.imageLabel}>
            Imagen del servicio {!form.id && <span className={styles.required}>*</span>}
          </label>
          {previewImage && (
            <div className={styles.imagePreview}>
              <img src={previewImage} alt="Preview" className={styles.previewImg} />
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
          {errors.image && <span className={styles.errorText}>{errors.image}</span>}
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button type="submit" variant="primary" size="md" isLoading={loading} fullWidth>
          {form.id ? 'Guardar cambios' : 'Crear servicio'}
        </Button>
      </div>
    </form>
  );
};

ServiceForm.propTypes = {
  onSuccess: PropTypes.func,
  initialData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    image_url: PropTypes.string,
    status: PropTypes.string
  })
};

