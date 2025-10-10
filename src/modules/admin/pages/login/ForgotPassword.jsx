import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '@/services/auth.service';
import './login.scss';
import logo2 from '@/assets/images/logos/logo_1-removebg-preview.png';
import { useToast } from '@/context/ToastContext';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('El correo electrónico es requerido');
      return;
    }
    if (!validateEmail(email)) {
      setError('Ingrese un correo electrónico válido');
      return;
    }
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      showToast('Si el correo existe, se enviaron instrucciones', 'success', 'Solicitud enviada');
      navigate('/login');
    } catch (e) {
      const msg = e?.response?.data?.message || 'No se pudo procesar la solicitud';
      setError(msg);
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
        <div style={{textAlign:'center'}}>
          <h3 style={{margin:0}}>Recuperar contraseña</h3>
          <p style={{marginTop:6, color:'#555'}}>Ingresa tu correo para enviar instrucciones</p>
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={error ? 'error' : ''}
            placeholder="Correo registrado"
          />
          {error && <div className="error-message">{error}</div>}
        </div>
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
        </button>
        <div className="forgot-password">
          <a href="/login">Volver al inicio de sesión</a>
        </div>
      </form>
    </div>
  );
};


