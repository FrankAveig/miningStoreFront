import React from 'react';
import PropTypes from 'prop-types';
import { FormControl } from '../formControl/FormControl';
import { Radio } from '@/components/ui/radio/Radio';
import styles from './radioField.module.scss';

export const RadioField = ({
  // FormControl props
  label,
  id,
  isRequired = false,
  error = '',
  hint = '',
  help = '',
  orientation = 'vertical',
  hideLabel = false,
  className = '',

  // Radio group props
  name,
  value,
  onChange,
  disabled = false,
  size = 'md',

  // Opciones: array directo o función asíncrona
  options,                   // [{ value, label, disabled? }, ...]
  optionsLoader,             // async () => array
  valueKey = 'value',        // cuando los objetos no vienen como {value,label}
  labelKey = 'label',
  mapOption,                 // (item) => ({ value, label, disabled? })
  reloadKey,                 // cualquier cosa; si cambia, recarga opciones (ver más abajo)

  // UX
  loadingText = 'Cargando…',
  emptyText = 'Sin opciones',
}) => {
  const [items, setItems] = React.useState(Array.isArray(options) ? options : []);
const [loading, setLoading] = React.useState(false);
const [loadErr, setLoadErr] = React.useState('');

  // Mapeo flexible de cada opción a {value,label,disabled}
  const normalize = React.useCallback(
    (arr = []) => {
      if (!Array.isArray(arr)) return [];
      return arr.map((it) => {
        if (typeof mapOption === 'function') return mapOption(it);
        return {
          value: it?.[valueKey],
          label: it?.[labelKey],
          disabled: Boolean(it?.disabled),
        };
      }).filter(op => op && op.value !== undefined && op.label !== undefined);
    },
    [mapOption, valueKey, labelKey]
  );

  React.useEffect(() => {
  if (Array.isArray(options)) {
    setItems(normalize(options));
  }
}, [options, normalize]);

  // Carga inicial
 React.useEffect(() => {
  let cancelled = false;
  if (typeof optionsLoader !== 'function') return;

  const load = async () => {
    try {
      setLoading(true);
      setLoadErr('');
      const res = await optionsLoader();
      if (!cancelled) setItems(normalize(res));
    } catch (e) {
      if (!cancelled) {
        setItems([]);
        setLoadErr(e?.message || 'Error cargando opciones');
      }
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  load();                    
  return () => { cancelled = true; };
}, []);

React.useEffect(() => {
  let cancelled = false;
  if (typeof optionsLoader !== 'function') return;
  if (typeof reloadKey === 'undefined') return;

  const load = async () => {
    try {
      setLoading(true);
      setLoadErr('');
      const res = await optionsLoader();
      if (!cancelled) setItems(normalize(res));
    } catch (e) {
      if (!cancelled) {
        setItems([]);
        setLoadErr(e?.message || 'Error cargando opciones');
      }
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  load();
  return () => { cancelled = true; };
}, [reloadKey]);

  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedby = [hintId, errorId].filter(Boolean).join(' ') || undefined;

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
      {loading ? (
        <div className={styles.metaText}>{loadingText}</div>
      ) : loadErr ? (
        <div className={styles.metaText} aria-live="polite">{loadErr}</div>
      ) : items.length === 0 ? (
        <div className={styles.metaText}>{emptyText}</div>
      ) : (
        <div
          className={styles.group}
          data-orientation={orientation}
          role="radiogroup"
          aria-describedby={describedby}
        >
          {items.map((opt, idx) => (
            <Radio
              key={`${opt.value}-${idx}`}
              id={`${id}-${opt.value}`}
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={onChange}
              disabled={disabled || opt.disabled}
              required={isRequired}
              error={!!error}
              size={size}
              aria-describedby={describedby}
            >
              {opt.label}
            </Radio>
          ))}
        </div>
      )}
    </FormControl>
  );
};

RadioField.propTypes = {
  // FormControl
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  error: PropTypes.string,
  hint: PropTypes.string,
  help: PropTypes.string,
  orientation: PropTypes.oneOf(['vertical', 'horizontal']),
  hideLabel: PropTypes.bool,
  className: PropTypes.string,

  // Radio group
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),

  // Opciones
  options: PropTypes.array,             // arreglo de opciones (sincrónico)
  optionsLoader: PropTypes.func,        // async () => array
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  mapOption: PropTypes.func,
  reloadKey: PropTypes.any,              // si cambia, recarga opciones

  // UX
  loadingText: PropTypes.string,
  emptyText: PropTypes.string,
};

export default RadioField;
