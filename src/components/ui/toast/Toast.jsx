import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import './toast.scss';

export const Toast = ({ title, message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="toast__icon" />;
      case 'error':
        return <FaExclamationCircle className="toast__icon" />;
      default:
        return <FaInfoCircle className="toast__icon" />;
    }
  };

  return (
    <div className={`toast toast--${type}`}>
      <div className="toast__content">
        {getIcon()}
        <div className="toast__text">
          {title && <h5 className="toast__title">{title}</h5>}
          {message && <p className="toast__message">{message}</p>}
        </div>
        <button 
          type="button" 
          className="toast__close" 
          onClick={onClose}
          aria-label="Cerrar"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};
