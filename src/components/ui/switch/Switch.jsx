import React from 'react';
import PropTypes from 'prop-types';
import './Switch.scss';

export const Switch = ({ 
  isChecked, 
  onChange, 
  label, 
  disabled = false,
  size = 'medium',
  color = 'primary'
}) => {
  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <label className={`switch switch--${size} switch--${color} ${disabled ? 'switch--disabled' : ''}`}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        className="switch__input"
      />
      <span className="switch__slider"></span>
      {label && <span className="switch__label">{label}</span>}
    </label>
  );
};

Switch.propTypes = {
  isChecked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'success', 'warning', 'danger'])
};

