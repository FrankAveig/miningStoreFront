import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './cryptocurrencyForm.module.scss';
import { InputField } from '@/components/form/inputField/InputField';
import { FileDropzone } from '@/components/data-display/fileDropZone/FileDropzone';
import { Button } from '@/components/ui/button/Button';
import { createCryptocurrency, updateCryptocurrency } from '@/modules/admin/services/cryptocurrencies.service';
import { useToast } from '@/context/ToastContext';

export const CryptocurrencyForm = ({ onSuccess, initialData }) => {
  const [form, setForm] = useState({ 
    name: '', 
    symbol: '', 
    algorithm: '',
    market_cap_usd: '',
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
        symbol: initialData.symbol || '',
        algorithm: initialData.algorithm || '',
        market_cap_usd: initialData.market_cap_usd || '',
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
    if (!form.symbol.trim()) newErrors.symbol = 'El símbolo es requerido';
    if (!form.algorithm.trim()) newErrors.algorithm = 'El algoritmo es requerido';
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
        symbol: form.symbol.trim(),
        algorithm: form.algorithm.trim(),
        market_cap_usd: Number(form.market_cap_usd),
        status: form.status
      };

      if (form.image) {
        submitData.image = form.image;
      }

      if (form.id) {
        await updateCryptocurrency(form.id, submitData);
      } else {
        await createCryptocurrency(submitData);
        setForm({ name: '', symbol: '', algorithm: '', market_cap_usd: '', image: null, status: 'active' });
        setPreviewImage(null);
      }
      setErrors({});
      if (onSuccess) onSuccess();
    } catch (error) {
      let message = 'Error al guardar la criptomoneda';
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
          placeholder="Ej: Bitcoin"
          size="md"
        />
        <InputField
          label="Símbolo"
          id="symbol"
          name="symbol"
          value={form.symbol}
          onChange={handleChange}
          isRequired
          error={errors.symbol}
          placeholder="Ej: BTC"
          size="md"
        />
      </div>
      <div className={styles.formGroup}>
        <InputField
          label="Algoritmo"
          id="algorithm"
          name="algorithm"
          value={form.algorithm}
          onChange={handleChange}
          isRequired
          error={errors.algorithm}
          placeholder="Ej: SHA-256"
          size="md"
        />
      </div>
      <div className={styles.formGroup}>
        <div className={styles.imageSection}>
          <label className={styles.imageLabel}>
            Imagen de la criptomoneda {!form.id && <span className={styles.required}>*</span>}
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
            aspectRatio={1}
          />
          {errors.image && <span className={styles.errorText}>{errors.image}</span>}
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button type="submit" variant="primary" size="md" isLoading={loading} fullWidth>
          {form.id ? 'Guardar cambios' : 'Crear criptomoneda'}
        </Button>
      </div>
    </form>
  );
};

CryptocurrencyForm.propTypes = {
  onSuccess: PropTypes.func,
  initialData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    symbol: PropTypes.string,
    algorithm: PropTypes.string,
    market_cap_usd: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    image_url: PropTypes.string,
    status: PropTypes.string
  })
};

