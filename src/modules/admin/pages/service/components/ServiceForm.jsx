import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './serviceForm.module.scss';
import { InputField } from '@/components/form/inputField/InputField';
import { TextareaField } from '@/components/form/textareaField/TextareaField';
import { SelectField } from '@/components/form/selectField/SelectField';
import { FileDropzone } from '@/components/data-display/fileDropZone/FileDropzone';
import { Button } from '@/components/ui/button/Button';
import { createService, updateService } from '@/modules/admin/services/services.service';
import { useToast } from '@/context/ToastContext';
import { MdAdd, MdDelete, MdArrowUpward, MdArrowDownward } from 'react-icons/md';

const CARD_THEME_OPTIONS = [
  { value: 'purple', label: 'Purple' },
  { value: 'gold', label: 'Gold' },
  { value: 'cyan', label: 'Cyan' },
];

const FEATURE_TYPE_OPTIONS = [
  { value: 'simple_list', label: 'Lista simple (bullet)' },
  { value: 'spec_list', label: 'Lista técnica (nombre + valor)' },
  { value: 'metric_grid', label: 'Métrica (valor grande + texto)' },
];

const FEATURE_COLOR_OPTIONS = [
  { value: '', label: 'Automático (según tema)' },
  { value: 'gold', label: 'Gold' },
  { value: 'purple', label: 'Purple' },
  { value: 'cyan', label: 'Cyan' },
];

const emptyFeature = (type = 'simple_list') => ({
  type,
  label: '',
  value: '',
  color: '',
  sort_order: 0,
});

export const ServiceForm = ({ onSuccess, initialData }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: null,
    status: 'active',
    card_theme: 'purple',
    link_url: '',
    sort_order: 0,
    features: [],
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
        card_theme: initialData.card_theme || 'purple',
        link_url: initialData.link_url || '',
        sort_order: Number(initialData.sort_order || 0),
        features: Array.isArray(initialData.features) ? [...initialData.features] : [],
        id: initialData.id || undefined,
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
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const setFeature = (index, patch) => {
    setForm((prev) => {
      const features = prev.features.map((f, i) => (i === index ? { ...f, ...patch } : f));
      return { ...prev, features };
    });
  };

  const addFeature = () => {
    setForm((prev) => ({ ...prev, features: [...prev.features, emptyFeature()] }));
  };

  const removeFeature = (index) => {
    setForm((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const moveFeature = (index, dir) => {
    setForm((prev) => {
      const next = [...prev.features];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      return { ...prev, features: next };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!form.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!form.id && !form.image) newErrors.image = 'La imagen es requerida';

    form.features.forEach((f, i) => {
      if (!f.label || !String(f.label).trim()) {
        newErrors[`feature_${i}_label`] = 'Campo requerido';
      }
      if ((f.type === 'spec_list' || f.type === 'metric_grid') && (!f.value || !String(f.value).trim())) {
        newErrors[`feature_${i}_value`] = 'Campo requerido';
      }
    });

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
      const featuresPayload = form.features.map((f, i) => ({
        type: f.type,
        label: String(f.label || '').trim(),
        value: f.value ? String(f.value).trim() : null,
        color: f.color ? String(f.color).trim() : null,
        sort_order: i,
      }));

      const submitData = {
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        card_theme: form.card_theme,
        link_url: form.link_url?.trim() || '',
        sort_order: Number(form.sort_order || 0),
        features: featuresPayload,
      };

      if (form.image) submitData.image = form.image;

      if (form.id) {
        await updateService(form.id, submitData);
      } else {
        await createService(submitData);
        setForm({
          name: '',
          description: '',
          image: null,
          status: 'active',
          card_theme: 'purple',
          link_url: '',
          sort_order: 0,
          features: [],
        });
        setPreviewImage(null);
      }
      setErrors({});
      if (onSuccess) onSuccess();
    } catch (error) {
      let message = 'Error al guardar el servicio';
      const fieldErrors = {};
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
        <SelectField
          label="Tema de la tarjeta"
          id="card_theme"
          name="card_theme"
          value={form.card_theme}
          onChange={handleChange}
          options={CARD_THEME_OPTIONS}
          size="md"
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
          label="URL destino (opcional)"
          id="link_url"
          name="link_url"
          value={form.link_url}
          onChange={handleChange}
          size="md"
          placeholder="./catalog.html?category=lottery"
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

      <div className={styles.featuresSection}>
        <div className={styles.featuresHeader}>
          <h3 className={styles.featuresTitle}>Características</h3>
          <Button type="button" variant="secondary" size="sm" onClick={addFeature}>
            <MdAdd style={{ marginRight: 6 }} /> Agregar característica
          </Button>
        </div>

        {form.features.length === 0 && (
          <p className={styles.featuresEmpty}>
            No hay características aún. Usa “Agregar característica” para sumar elementos
            (lista simple, lista técnica o métrica).
          </p>
        )}

        {form.features.map((f, i) => (
          <div key={i} className={styles.featureCard}>
            <div className={styles.featureRow}>
              <SelectField
                label="Tipo"
                id={`feature_${i}_type`}
                name={`feature_${i}_type`}
                value={f.type}
                onChange={(e) => setFeature(i, { type: e.target.value })}
                options={FEATURE_TYPE_OPTIONS}
                size="md"
              />
              <div className={styles.featureActions}>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => moveFeature(i, -1)}
                  disabled={i === 0}
                  aria-label="Subir"
                >
                  <MdArrowUpward />
                </button>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => moveFeature(i, 1)}
                  disabled={i === form.features.length - 1}
                  aria-label="Bajar"
                >
                  <MdArrowDownward />
                </button>
                <button
                  type="button"
                  className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                  onClick={() => removeFeature(i)}
                  aria-label="Eliminar"
                >
                  <MdDelete />
                </button>
              </div>
            </div>

            {f.type === 'simple_list' && (
              <div className={styles.featureRow}>
                <InputField
                  label="Texto"
                  id={`feature_${i}_label`}
                  name={`feature_${i}_label`}
                  value={f.label}
                  onChange={(e) => setFeature(i, { label: e.target.value })}
                  error={errors[`feature_${i}_label`]}
                  placeholder="Ej: ASIC Industrial · BTC / LTC / KAS"
                  size="md"
                />
                <SelectField
                  label="Color"
                  id={`feature_${i}_color`}
                  name={`feature_${i}_color`}
                  value={f.color || ''}
                  onChange={(e) => setFeature(i, { color: e.target.value })}
                  options={FEATURE_COLOR_OPTIONS}
                  size="md"
                />
              </div>
            )}

            {f.type === 'spec_list' && (
              <div className={styles.featureRow}>
                <InputField
                  label="Nombre"
                  id={`feature_${i}_label`}
                  name={`feature_${i}_label`}
                  value={f.label}
                  onChange={(e) => setFeature(i, { label: e.target.value })}
                  error={errors[`feature_${i}_label`]}
                  placeholder="Ej: BTC Hashcard"
                  size="md"
                />
                <InputField
                  label="Valor"
                  id={`feature_${i}_value`}
                  name={`feature_${i}_value`}
                  value={f.value}
                  onChange={(e) => setFeature(i, { value: e.target.value })}
                  error={errors[`feature_${i}_value`]}
                  placeholder="Ej: 12.5 TH/s · 200W"
                  size="md"
                />
              </div>
            )}

            {f.type === 'metric_grid' && (
              <div className={styles.featureRow}>
                <InputField
                  label="Valor grande"
                  id={`feature_${i}_value`}
                  name={`feature_${i}_value`}
                  value={f.value}
                  onChange={(e) => setFeature(i, { value: e.target.value })}
                  error={errors[`feature_${i}_value`]}
                  placeholder="Ej: 0.088"
                  size="md"
                />
                <InputField
                  label="Texto pequeño"
                  id={`feature_${i}_label`}
                  name={`feature_${i}_label`}
                  value={f.label}
                  onChange={(e) => setFeature(i, { label: e.target.value })}
                  error={errors[`feature_${i}_label`]}
                  placeholder="Ej: USD / kWh"
                  size="md"
                />
              </div>
            )}
          </div>
        ))}
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
    status: PropTypes.string,
    card_theme: PropTypes.string,
    link_url: PropTypes.string,
    sort_order: PropTypes.number,
    features: PropTypes.array,
  }),
};
