import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './FilterBar.module.scss';
import { InputField } from '@/components/form/inputField/InputField';
import { Button } from '@/components/ui/button/Button';
import { VscSettings } from "react-icons/vsc";
import { Input } from '@/components/ui/input/input';

export const FilterBar = ({ fields, onFilter, initialValues = {} }) => {
  const [values, setValues] = useState(() => {
    const vals = {};
    fields.forEach(f => { vals[f.name] = initialValues[f.name] || ''; });
    return vals;
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const debounceRef = useRef();
  const filterBarRef = useRef();

  // Campo principal de búsqueda (por defecto el primero)
  const mainField = fields[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  // Debounce para búsqueda automática
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onFilter(values);
    }, 1000);
    return () => clearTimeout(debounceRef.current);
  }, [values]);

  // Event listener para cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterBarRef.current && !filterBarRef.current.contains(event.target)) {
        setShowAdvanced(false);
      }
    };

    if (showAdvanced) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAdvanced]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // No hace nada, la búsqueda es automática
  };

  const handleClear = () => {
    const cleared = {};
    fields.forEach(f => { cleared[f.name] = ''; });
    setValues(cleared);
    onFilter(cleared);
  };

  return (
    <form className={styles.filterBar} onSubmit={handleSubmit} autoComplete="off" ref={filterBarRef}>
      <div className={styles.mainSearch}>
        <Input
          key={mainField.name}
          type={mainField.type || 'text'}
          name={mainField.name}
          value={values[mainField.name]}
          onChange={handleChange}
          placeholder={mainField.placeholder || `Buscar por ${mainField.label.toLowerCase()}`}
          size="md"
        />
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => setShowAdvanced(v => !v)}
          title={showAdvanced ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados'}
        >
          <VscSettings />
        </button>
      </div>
      {showAdvanced && (
        <div className={styles.advancedFields}>
          {fields.slice(1).map((field) => (
            <InputField
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type || 'text'}
              value={values[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder || ''}
              className={styles.advancedField}
              size="md"
            />
          ))}
          <Button type="button" variant="secondary" size="md" onClick={handleClear} className={styles.clearButton}>
            Restablecer
          </Button>
        </div>
      )}
    </form>
  );
};

FilterBar.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string, // Por ahora solo 'string'
    placeholder: PropTypes.string
  })).isRequired,
  onFilter: PropTypes.func.isRequired,
  initialValues: PropTypes.object
}; 