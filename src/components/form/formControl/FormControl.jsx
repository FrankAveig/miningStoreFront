import React from 'react';
import PropTypes from 'prop-types';
import styles from './formControl.module.scss';

export const FormControl = ({
  label,
  id,
  isRequired = false,
  error = '',
  hint = '',
  help = '',
  orientation = 'vertical', // vertical | horizontal
  hideLabel = false,
  children,
  className = '',
  ...rest
}) => {
  // IDs para accesibilidad
  const describedByIds = [];
  if (error) describedByIds.push(`${id}-error`);
  if (hint) describedByIds.push(`${id}-hint`);
  if (help) describedByIds.push(`${id}-help`);

  // Clases BEM
  const formControlClass = [
    styles['form-control'],
    styles[`form-control--${orientation}`],
    error ? styles['form-control--error'] : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={formControlClass} {...rest}>
      {label && (
        <label
          htmlFor={id}
          className={hideLabel ? styles['form-control__label--sr-only'] : styles['form-control__label']}
        >
          {label}
          {isRequired && <span className={styles['form-control__asterisk']} aria-hidden="true">*</span>}
        </label>
      )}
      <div className={styles['form-control__control']}>
        {React.cloneElement(children, {
          id,
          'aria-describedby': describedByIds.join(' ') || undefined,
          'aria-invalid': !!error,
          'aria-required': isRequired || undefined
        })}
      </div>
      <div className={styles['form-control__feedback']}>
        {error && <div id={`${id}-error`} className={styles['form-control__error']} role="alert">{error}</div>}
        {hint && !error && <div id={`${id}-hint`} className={styles['form-control__hint']}>{hint}</div>}
        {help && !error && <div id={`${id}-help`} className={styles['form-control__help']}>{help}</div>}
      </div>
    </div>
  );
};

FormControl.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  error: PropTypes.string,
  hint: PropTypes.string,
  help: PropTypes.string,
  orientation: PropTypes.oneOf(['vertical', 'horizontal']),
  hideLabel: PropTypes.bool,
  children: PropTypes.element.isRequired,
  className: PropTypes.string
};
