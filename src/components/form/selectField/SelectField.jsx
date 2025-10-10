import React from 'react';
import PropTypes from 'prop-types';
import { FormControl } from '../formControl/FormControl';
import { Select } from '@/components/ui/select/Select';

export const SelectField = React.forwardRef((props, ref) => {
  const {
    label,
    id,
    isRequired,
    error,
    hint,
    help,
    orientation,
    hideLabel,
    className,
    children,
    // Select props
    value,
    onChange,
    disabled,
    size,
    name,
    options = [], // Agregar soporte para options
    placeholder, // Agregar soporte para placeholder
    ...rest
  } = props;

  // Generar las opciones del select
  const renderOptions = () => {
    if (children) {
      return children; // Si hay children personalizados, usarlos
    }

    if (options && options.length > 0) {
      return (
        <>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option, index) => (
            <option key={option.value || index} value={option.value}>
              {option.label}
            </option>
          ))}
        </>
      );
    }

    return null;
  };

  // Asegurar que el valor sea una cadena vacía si es undefined/null
  const selectValue = value === undefined || value === null ? '' : value;

  return (
    <FormControl
      label={label}
      id={id}
      isRequired={isRequired}
      error={error}
      hint={hint}
      help={help}
      orientation={orientation}
      hideLabel={hideLabel}
      className={className}
    >
      <Select
        ref={ref}
        id={id}
        name={name}
        value={selectValue}
        onChange={onChange}
        disabled={disabled}
        required={isRequired}
        error={!!error}
        size={size}
        {...rest}
      >
        {renderOptions()}
      </Select>
    </FormControl>
  );
});

SelectField.displayName = 'SelectField';

SelectField.propTypes = {
  // FormControl props
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  error: PropTypes.string,
  hint: PropTypes.string,
  help: PropTypes.string,
  orientation: PropTypes.oneOf(['vertical', 'horizontal']),
  hideLabel: PropTypes.bool,
  className: PropTypes.string,
  // Select props
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  name: PropTypes.string,
  children: PropTypes.node,
  // Nuevas props para options
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired
  })),
  placeholder: PropTypes.string
}; 