import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './catalogCategoryForm.module.scss';
import { InputField } from '@/components/form/inputField/InputField';
import { TextareaField } from '@/components/form/textareaField/TextareaField';
import { CheckboxField } from '@/components/form/checkboxField/CheckboxField';
import { Button } from '@/components/ui/button/Button';
import { createCatalogCategory, updateCatalogCategory } from '@/modules/admin/services/catalogCategories.service';
import { useToast } from '@/context/ToastContext';

export const CatalogCategoryForm = ({ onSuccess, initialData }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'active',
    show_prices: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        status: initialData.status || 'active',
        show_prices:
          initialData.show_prices !== undefined && initialData.show_prices !== null
            ? Boolean(initialData.show_prices)
            : true,
        id: initialData.id || undefined,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleShowPricesChange = (e) => {
    setForm((prev) => ({ ...prev, show_prices: e.target.checked }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!form.description.trim()) newErrors.description = 'La descripción es requerida';
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
        status: form.status,
        show_prices: form.show_prices ? 1 : 0,
      };

      if (form.id) {
        await updateCatalogCategory(form.id, submitData);
      } else {
        await createCatalogCategory(submitData);
        setForm({ name: '', description: '', status: 'active', show_prices: true });
      }
      setErrors({});
      if (onSuccess) onSuccess();
    } catch (error) {
      let message = 'Error al guardar la categoría';
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
          placeholder="Ej: ASIC Miners"
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
          placeholder="Describe la categoría..."
          size="md"
          rows={4}
        />
      </div>
      <div className={styles.formGroup}>
        <CheckboxField
          id="show_prices"
          name="show_prices"
          label="Precios en la tienda"
          checkboxLabel="Mostrar precios USD de los productos de esta categoría en el catálogo y fichas"
          checked={form.show_prices}
          onChange={handleShowPricesChange}
          hint="Si está desactivado, los clientes verán «Consultar» salvo que otra regla global aplique."
        />
      </div>
      <div className={styles.buttonContainer}>
        <Button type="submit" variant="primary" size="md" isLoading={loading} fullWidth>
          {form.id ? 'Guardar cambios' : 'Crear categoría'}
        </Button>
      </div>
    </form>
  );
};

CatalogCategoryForm.propTypes = {
  onSuccess: PropTypes.func,
  initialData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    show_prices: PropTypes.bool,
  }),
};

