import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './electricityPriceForm.module.scss';
import { InputField } from '@/components/form/inputField/InputField';
import { DateField } from '@/components/form/dateField/DateField';
import { Button } from '@/components/ui/button/Button';
import { createElectricityPrice, updateElectricityPrice } from '@/modules/admin/services/electricityPrices.service';
import { useToast } from '@/context/ToastContext';

export const ElectricityPriceForm = ({ onSuccess, initialData }) => {
  const [form, setForm] = useState({ 
    price_kwh_usd: '', 
    valid_from: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (initialData) {
      setForm({
        price_kwh_usd: initialData.price_kwh_usd || '',
        valid_from: initialData.valid_from || '',
        status: initialData.status || 'active',
        id: initialData.id || undefined
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.price_kwh_usd) {
      newErrors.price_kwh_usd = 'El precio es requerido';
    } else if (isNaN(form.price_kwh_usd) || Number(form.price_kwh_usd) <= 0) {
      newErrors.price_kwh_usd = 'Debe ser un número válido mayor a 0';
    }
    if (!form.valid_from) newErrors.valid_from = 'La fecha de inicio es requerida';
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
        price_kwh_usd: Number(form.price_kwh_usd),
        valid_from: form.valid_from,
        status: form.status
        // NO enviamos valid_to
      };

      if (form.id) {
        await updateElectricityPrice(form.id, submitData);
      } else {
        await createElectricityPrice(submitData);
        setForm({ price_kwh_usd: '', valid_from: '', status: 'active' });
      }
      setErrors({});
      if (onSuccess) onSuccess();
    } catch (error) {
      let message = 'Error al guardar el precio';
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
          label="Precio por kWh (USD)"
          id="price_kwh_usd"
          name="price_kwh_usd"
          type="number"
          step="0.0001"
          value={form.price_kwh_usd}
          onChange={handleChange}
          isRequired
          error={errors.price_kwh_usd}
          placeholder="Ej: 0.0850"
          size="md"
        />
        <DateField
          label="Válido desde"
          id="valid_from"
          name="valid_from"
          value={form.valid_from}
          onChange={handleChange}
          isRequired
          error={errors.valid_from}
          size="md"
        />
      </div>
      <div className={styles.infoBox}>
        <p>ℹ️ La fecha de fin de validez se gestiona automáticamente por el sistema.</p>
      </div>
      <div className={styles.buttonContainer}>
        <Button type="submit" variant="primary" size="md" isLoading={loading} fullWidth>
          {form.id ? 'Guardar cambios' : 'Crear precio'}
        </Button>
      </div>
    </form>
  );
};

ElectricityPriceForm.propTypes = {
  onSuccess: PropTypes.func,
  initialData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price_kwh_usd: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    valid_from: PropTypes.string,
    status: PropTypes.string
  })
};

