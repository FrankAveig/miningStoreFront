import { useState } from 'react';
import { adminLogin } from '../../../../services/auth.service';
import './login.scss';
import logo2 from '@/assets/images/logos/logo.avif';
import { useAuth } from '../../../../context/AuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import background from '@/assets/images/backgrounds/home2.mp4';
export const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let tempErrors = {
      email: '',
      password: '',
      general: ''
    };
    let isValid = true;

    if (!formData.email) {
      tempErrors.email = 'El correo electrónico es requerido';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      tempErrors.email = 'Ingrese un correo electrónico válido';
      isValid = false;
    }

    if (!formData.password) {
      tempErrors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (formData.password.length < 8) {
      tempErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await adminLogin({
        email: formData.email,
        password: formData.password
      });
      console.log(response.data);
      login(response.data);
    } catch (error) {
      console.log(error);
      let msg = 'Error al iniciar sesión';
      if (error.response && error.response.data && error.response.data.message) {
        msg = error.response.data.message;
      }
      setErrors(prev => ({ ...prev, general: msg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="logo">
          <img src={logo2} alt="Montesori Logo" />
        </div>
        
        {errors.general && <div className="error-message" style={{textAlign:'center', marginBottom:'10px'}}>{errors.general}</div>}

        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="Ingrese su correo electrónico"
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group" style={{position:'relative'}}>
          <label htmlFor="password">Contraseña</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            placeholder="Ingrese su contraseña"
            autoComplete="current-password"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(v => !v)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '38px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <FiEyeOff size={22} color="#888" /> : <FiEye size={22} color="#888" />}
          </button>
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};
