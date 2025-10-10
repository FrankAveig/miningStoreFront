import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import styles from './select.module.scss';

export const Select = forwardRef(({
  value,
  onChange,
  disabled = false,
  required = false,
  error = false,
  size = 'md', // sm, md, lg
  name,
  id,
  className = '',
  children,
  'aria-describedby': ariaDescribedby,
  ...rest
}, ref) => {
  const selectClass = [
    styles['select'],
    styles[`select--${size}`],
    error ? styles['select--error'] : '',
    disabled ? styles['select--disabled'] : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <select
      ref={ref}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={selectClass}
      disabled={disabled}
      required={required}
      aria-invalid={error}
      aria-describedby={ariaDescribedby}
      {...rest}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';

Select.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  name: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  'aria-describedby': PropTypes.string
}; 