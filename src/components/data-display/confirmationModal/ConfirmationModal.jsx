import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button/Button';
import styles from './confirmationModal.module.scss';

export const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmar acción',
  message = '¿Estás seguro de que deseas realizar esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  loading = false
}) => {
  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Cerrar al hacer click fuera del modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <FaExclamationTriangle className={styles.modal__icon} />;
      case 'warning':
        return <FaExclamationTriangle className={styles.modal__icon} />;
      case 'info':
        return <FaExclamationTriangle className={styles.modal__icon} />;
      default:
        return <FaExclamationTriangle className={styles.modal__icon} />;
    }
  };

  return (
    <div className={styles.modal} onClick={handleBackdropClick}>
      <div className={styles.modal__content}>
        <div className={styles.modal__header}>
          <div className={styles.modal__titleContainer}>
            {getIcon()}
            <h3 className={styles.modal__title}>{title}</h3>
          </div>
          <button
            type="button"
            className={styles.modal__closeButton}
            onClick={onClose}
            aria-label="Cerrar"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className={styles.modal__body}>
          <p className={styles.modal__message}>{message}</p>
        </div>
        
        <div className={styles.modal__footer}>
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={type === 'danger' ? 'danger' : 'primary'}
            size="md"
            onClick={onConfirm}
            isLoading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(['warning', 'danger', 'info']),
  loading: PropTypes.bool
}; 