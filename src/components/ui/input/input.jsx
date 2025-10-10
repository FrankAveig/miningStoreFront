import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import styles from './input.module.scss'

export const Input = forwardRef(({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  disabled = false,
  required = false,
  error = false,
  size = 'md', // sm, md, lg
  name,
  id,
  className = '',
  'aria-describedby': ariaDescribedby,
  ...rest
}, ref) => {
  // Construir clases BEM
  const inputClass = [
    styles['input'],
    styles[`input--${size}`],
    error ? styles['input--error'] : '',
    disabled ? styles['input--disabled'] : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <input
      ref={ref}
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={inputClass}
      disabled={disabled}
      required={required}
      aria-invalid={error}
      aria-describedby={ariaDescribedby}
      {...rest}
    />
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  name: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  'aria-describedby': PropTypes.string
};