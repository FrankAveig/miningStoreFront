import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './userForm.module.scss';
import { InputField } from '@/components/form/inputField/InputField';
import { Button } from '@/components/ui/button/Button';
import { createUser, updateUser } from '@/modules/admin/services/users.service';
import { useToast } from '@/context/ToastContext';

export const UserForm = ({ onSuccess, initialData }) => {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        email: initialData.email || '',
        password: '',
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
    if (!form.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!form.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!form.id && !form.password) newErrors.password = 'La contraseña es requerida';
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
        full_name: form.name.trim(),
        email: form.email,
        role: 'admin', // Todos los usuarios son admin
        status: form.status
      };

      if (!form.id || form.password) {
        submitData.password = form.password;
      }

      if (form.id) {
        await updateUser(form.id, submitData);
      } else {
        await createUser(submitData);
        setForm({ name: '', email: '', password: '', status: 'active' });
      }
      setErrors({});
      if (onSuccess) onSuccess();
    } catch (error) {
      let message = 'Error al guardar el usuario';
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
          label="Nombre completo"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          isRequired
          error={errors.name}
          placeholder="Ej: Juan Pérez"
          size="md"
        />
        <InputField
          label="Email"
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          isRequired
          error={errors.email}
          placeholder="Ej: juan@ejemplo.com"
          size="md"
        />
      </div>
      <div className={styles.formGroup}>
        <InputField
          label="Contraseña"
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          isRequired={!form.id}
          error={errors.password}
          placeholder={form.id ? "Dejar vacío para mantener la actual" : "Ingrese la contraseña"}
          size="md"
        />
      </div>
      <div className={styles.buttonContainer}>
        <Button type="submit" variant="primary" size="md" isLoading={loading} fullWidth>
          {form.id ? 'Guardar cambios' : 'Crear usuario'}
        </Button>
      </div>
    </form>
  );
};

UserForm.propTypes = {
  onSuccess: PropTypes.func,
  initialData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    email: PropTypes.string,
    status: PropTypes.string
  })
}; 