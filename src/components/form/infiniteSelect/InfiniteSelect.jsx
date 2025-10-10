import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './infiniteSelect.module.scss';

export const InfiniteSelect = ({
  fetcher, // función async (page, search) => { data, pagination }
  displayField = 'name',
  value,
  onChange,
  placeholder = 'Selecciona...',
  disabled = false,
  formatOption,
  ...rest
}) => {
  const [options, setOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Cargar opciones
  const loadOptions = useCallback(async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);
    try {
      const { data, pagination } = await fetcher(reset ? 1 : page, search);
      setOptions(prev => reset ? data : [...prev, ...data]);
      setHasMore(pagination?.current_page < pagination?.last_page);
      setPage(reset ? 2 : page + 1);
    } finally {
      setLoading(false);
    }
  }, [fetcher, page, search, hasMore, loading]);

  // Inicial y cuando cambia search
  useEffect(() => {
    setOptions([]);
    setPage(1);
    setHasMore(true);
    loadOptions(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Scroll infinito
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight * 0.8 && hasMore && !loading) {
      loadOptions();
    }
  };

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.id === value);

  return (
    <div className={styles.infiniteSelect} ref={containerRef} {...rest}>
      <div
        className={styles.infiniteSelect__control}
        tabIndex={0}
        onClick={() => !disabled && setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-disabled={disabled}
      >
        <span className={styles.infiniteSelect__value}>
          {selectedOption ? selectedOption[displayField] : placeholder}
        </span>
        <span className={styles.infiniteSelect__arrow} />
      </div>
      {open && (
        <div
          className={styles.infiniteSelect__dropdown}
          onScroll={handleScroll}
          role="listbox"
        >
          <input
            className={styles.infiniteSelect__search}
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            disabled={disabled}
            autoFocus
          />
          <ul className={styles.infiniteSelect__options}>
            {options.map(opt => (
              <li
                key={opt.id}
                className={
                  value === opt.id
                    ? styles['infiniteSelect__option--selected']
                    : styles.infiniteSelect__option
                }
                role="option"
                aria-selected={value === opt.id}
                onClick={() => {
                  onChange && onChange({ id: opt.id, value: opt[displayField], option: opt });
                  setOpen(false);
                }}
              >
                {formatOption ? formatOption(opt) : opt[displayField]}
              </li>
            ))}
            {loading && <li className={styles.infiniteSelect__loading}>Cargando...</li>}
            {!loading && options.length === 0 && <li className={styles.infiniteSelect__noresults}>Sin resultados</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

InfiniteSelect.propTypes = {
  fetcher: PropTypes.func.isRequired,
  displayField: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  formatOption: PropTypes.func
}; 