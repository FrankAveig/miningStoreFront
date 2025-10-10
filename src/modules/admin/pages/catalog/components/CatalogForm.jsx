import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './catalogForm.module.scss';
import { InputField } from '@/components/form/inputField/InputField';
import { SelectField } from '@/components/form/selectField/SelectField';
import { CheckboxField } from '@/components/form/checkboxField/CheckboxField';
import { FileDropzone } from '@/components/data-display/fileDropZone/FileDropzone';
import { Button } from '@/components/ui/button/Button';
import { createCatalogItem, updateCatalogItem } from '@/modules/admin/services/catalog.service';
import { getCatalogCategories } from '@/modules/admin/services/catalogCategories.service';
import { useToast } from '@/context/ToastContext';

const HASHRATE_UNITS = [
  { value: 'H/s', label: 'H/s' },
  { value: 'KH/s', label: 'KH/s' },
  { value: 'MH/s', label: 'MH/s' },
  { value: 'GH/s', label: 'GH/s' },
  { value: 'TH/s', label: 'TH/s' }
];

export const CatalogForm = ({ onSuccess, initialData }) => {
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    hashrate: '',
    hashrate_unit: 'TH/s',
    algorithm: '',
    power_consumption_w: '',
    price_usd: '',
    manufacturer: '',
    model: '',
    hosting_available: false,
    connection: '',
    dimensions_mm: '',
    weight_kg: '',
    noise_db: '',
    input_voltage_v: '',
    operating_temperature_c: '',
    status: 'active',
    images: [null, null, null, null]
  });
  
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([null, null, null, null]);
  const { showToast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        category_id: initialData.category_id || '',
        hashrate: initialData.hashrate || '',
        hashrate_unit: initialData.hashrate_unit || 'TH/s',
        algorithm: initialData.algorithm || '',
        power_consumption_w: initialData.power_consumption_w || '',
        price_usd: initialData.price_usd || '',
        manufacturer: initialData.manufacturer || '',
        model: initialData.model || '',
        hosting_available: initialData.hosting_available || false,
        connection: initialData.connection || '',
        dimensions_mm: initialData.dimensions_mm || '',
        weight_kg: initialData.weight_kg || '',
        noise_db: initialData.noise_db || '',
        input_voltage_v: initialData.input_voltage_v || '',
        operating_temperature_c: initialData.operating_temperature_c || '',
        status: initialData.status || 'active',
        images: [null, null, null, null],
        id: initialData.id || undefined
      });
      
      // Cargar previews de imágenes existentes
      const previews = [
        initialData.main_image_url,
        initialData.image_2_url,
        initialData.image_3_url,
        initialData.image_4_url
      ];
      setPreviewImages(previews);
    }
  }, [initialData]);

  const loadCategories = async () => {
    try {
      const response = await getCatalogCategories(1, 100);
      const cats = response.data?.data || [];
      setCategories(cats.filter(c => c.status === 'active').map(c => ({ 
        value: c.id, 
        label: c.name 
      })));
    } catch (error) {
      showToast('Error al cargar categorías', 'error', 'Error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCheckboxChange = (checked) => {
    setForm((prev) => ({ ...prev, hosting_available: checked }));
  };

  const handleImageChange = (file, index) => {
    const newImages = [...form.images];
    newImages[index] = file;
    setForm((prev) => ({ ...prev, images: newImages }));
    setErrors((prev) => ({ ...prev, [`image_${index}`]: '' }));
    
    // Crear preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...previewImages];
        newPreviews[index] = reader.result;
        setPreviewImages(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!form.category_id) newErrors.category_id = 'La categoría es requerida';
    if (!form.hashrate) newErrors.hashrate = 'El hashrate es requerido';
    if (!form.algorithm.trim()) newErrors.algorithm = 'El algoritmo es requerido';
    if (!form.price_usd) newErrors.price_usd = 'El precio es requerido';
    if (!form.manufacturer.trim()) newErrors.manufacturer = 'El fabricante es requerido';
    if (!form.model.trim()) newErrors.model = 'El modelo es requerido';
    
    // Validar que al menos tenga la primera imagen (solo al crear)
    if (!form.id && !form.images[0]) {
      newErrors.image_0 = 'La imagen principal es requerida';
    }
    
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
        category_id: Number(form.category_id),
        hashrate: Number(form.hashrate),
        hashrate_unit: form.hashrate_unit,
        algorithm: form.algorithm.trim(),
        power_consumption_w: Number(form.power_consumption_w) || 0,
        price_usd: Number(form.price_usd),
        manufacturer: form.manufacturer.trim(),
        model: form.model.trim(),
        hosting_available: form.hosting_available,
        connection: form.connection.trim(),
        dimensions_mm: form.dimensions_mm.trim(),
        weight_kg: Number(form.weight_kg) || 0,
        noise_db: Number(form.noise_db) || 0,
        input_voltage_v: form.input_voltage_v.trim(),
        operating_temperature_c: form.operating_temperature_c.trim(),
        status: form.status,
        images: form.images.filter(img => img !== null)
      };

      if (form.id) {
        await updateCatalogItem(form.id, submitData);
      } else {
        await createCatalogItem(submitData);
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      let message = 'Error al guardar el producto';
      if (error?.response?.data?.message) message = error.response.data.message;
      showToast(message, 'error', 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.formContainer}>
      <h3>Información General</h3>
      <div className={styles.formRow}>
        <InputField label="Nombre" name="name" value={form.name} onChange={handleChange} isRequired error={errors.name} size="md" />
        <SelectField label="Categoría" name="category_id" value={form.category_id} onChange={handleChange} isRequired error={errors.category_id} options={categories} size="md" />
      </div>
      
      <div className={styles.formRow}>
        <InputField label="Fabricante" name="manufacturer" value={form.manufacturer} onChange={handleChange} isRequired error={errors.manufacturer} size="md" />
        <InputField label="Modelo" name="model" value={form.model} onChange={handleChange} isRequired error={errors.model} size="md" />
      </div>

      <h3>Especificaciones Técnicas</h3>
      <div className={styles.formRow}>
        <InputField label="Hashrate" name="hashrate" type="number" value={form.hashrate} onChange={handleChange} isRequired error={errors.hashrate} size="md" />
        <SelectField label="Unidad" name="hashrate_unit" value={form.hashrate_unit} onChange={handleChange} options={HASHRATE_UNITS} size="md" />
      </div>

      <div className={styles.formRow}>
        <InputField label="Algoritmo" name="algorithm" value={form.algorithm} onChange={handleChange} isRequired error={errors.algorithm} size="md" />
        <InputField label="Consumo (W)" name="power_consumption_w" type="number" value={form.power_consumption_w} onChange={handleChange} size="md" />
      </div>

      <div className={styles.formRow}>
        <InputField label="Conexión" name="connection" value={form.connection} onChange={handleChange} size="md" />
        <InputField label="Dimensiones (mm)" name="dimensions_mm" value={form.dimensions_mm} onChange={handleChange} placeholder="370 x 195.5 x 290" size="md" />
      </div>

      <div className={styles.formRow}>
        <InputField label="Peso (kg)" name="weight_kg" type="number" step="0.1" value={form.weight_kg} onChange={handleChange} size="md" />
        <InputField label="Ruido (dB)" name="noise_db" type="number" value={form.noise_db} onChange={handleChange} size="md" />
      </div>

      <div className={styles.formRow}>
        <InputField label="Voltaje" name="input_voltage_v" value={form.input_voltage_v} onChange={handleChange} placeholder="220V" size="md" />
        <InputField label="Temperatura (°C)" name="operating_temperature_c" value={form.operating_temperature_c} onChange={handleChange} placeholder="5-45" size="md" />
      </div>

      <h3>Precio y Disponibilidad</h3>
      <div className={styles.formRow}>
        <InputField label="Precio (USD)" name="price_usd" type="number" step="0.01" value={form.price_usd} onChange={handleChange} isRequired error={errors.price_usd} size="md" />
        <div style={{ paddingTop: '28px' }}>
          <CheckboxField label="Hosting disponible" checked={form.hosting_available} onChange={handleCheckboxChange} />
        </div>
      </div>

      <h3>Imágenes</h3>
      <div className={styles.imagesGrid}>
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className={styles.imageSection}>
            <label className={styles.imageLabel}>
              Imagen {index + 1} {index === 0 && !form.id && <span className={styles.required}>*</span>}
            </label>
            {previewImages[index] && (
              <div className={styles.imagePreview}>
                <img src={previewImages[index]} alt={`Preview ${index + 1}`} className={styles.previewImg} />
              </div>
            )}
            <FileDropzone
              label={`Seleccionar imagen ${index + 1}`}
              accept=".png,.jpg,.jpeg,.webp"
              value={form.images[index]}
              onChange={(file) => handleImageChange(file, index)}
              enableCropper={true}
              aspectRatio={16 / 9}
            />
            {errors[`image_${index}`] && <span className={styles.errorText}>{errors[`image_${index}`]}</span>}
          </div>
        ))}
      </div>

      <div className={styles.buttonContainer}>
        <Button type="submit" variant="primary" size="md" isLoading={loading} fullWidth>
          {form.id ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>
    </form>
  );
};

CatalogForm.propTypes = {
  onSuccess: PropTypes.func,
  initialData: PropTypes.object
};

