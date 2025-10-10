import { Dropdown } from "primereact/dropdown";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import styles from "./editableTable.module.scss";

/**
 * EditableTable (simple)
 * - Mantiene un estado local `rows` como fuente de verdad.
 * - Cada cambio (tecla, dropdown, fecha), agregar o eliminar fila: actualiza `rows` y llama a `onChange(next)`.
 * - Sin debounce, sin timers, sin refs especiales.
 */

function makeEmptyRow(columns) {
  const row = {};
  for (const c of columns) row[c.key] = "";
  return row;
}

export const EditableTable = ({
  columns,
  value,
  onChange,
  initialEmptyRows = 1,
  addButtonTitle = "Agregar fila",
  removeButtonTitle = "Eliminar fila",
  disabled = false,
  className = "",
  minRows = 1,
  ...rest
}) => {
  const initialRows = useMemo(() => {
    if (Array.isArray(value) && value.length > 0) return value;
    return Array.from({ length: Math.max(1, initialEmptyRows) }, () =>
      makeEmptyRow(columns)
    );
  }, [value, initialEmptyRows, columns]);

  const [rows, setRows] = useState(initialRows);

  useEffect(() => {
    if (Array.isArray(value))
      setRows(
        value.length
          ? value
          : Array.from({ length: Math.max(1, initialEmptyRows) }, () =>
              makeEmptyRow(columns)
            )
      );
  }, [value, initialEmptyRows, columns]);

  const emit = (next) => {
    setRows(next);
    onChange && onChange(next);
  };

  const handleTextOrNumberChange = (rowIndex, key, raw) => {
    const next = rows.slice();
    const row = { ...next[rowIndex] };
    row[key] = raw;
    next[rowIndex] = row;
    emit(next);
  };

  const handleDateChange = (rowIndex, key, raw) => {
    // Aceptamos YYYY-MM-DD o vacío
    if (raw && !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return;
    const next = rows.slice();
    const row = { ...next[rowIndex] };
    row[key] = raw || "";
    next[rowIndex] = row;
    emit(next);
  };

  const handleDropdownChange = (rowIndex, key, val) => {
    const next = rows.slice();
    const row = { ...next[rowIndex] };
    row[key] = val ?? "";
    next[rowIndex] = row;
    emit(next);
  };

  const addRow = () => {
    if (disabled) return;
    const next = [...rows, makeEmptyRow(columns)];
    emit(next);
  };

  const removeRow = (index) => {
    if (disabled) return;
    if (rows.length <= minRows) return;
    const next = rows.filter((_, i) => i !== index);
    emit(next);
  };

  const totalCols = columns.length;

  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSpace} />
        <button
          type="button"
          className={styles.addBtn}
          onClick={addRow}
          disabled={disabled}
          aria-label={addButtonTitle}
          title={addButtonTitle}
        >
          +
        </button>
      </div>

      {/* Tabla */}
      <div
        className={styles.table}
        role="table"
        aria-readonly={disabled || undefined}
      >
        {/* Encabezado */}
        <div
          className={[styles.row, styles.rowHeader, styles.hasActions].join(
            " "
          )}
          style={{ "--cols": totalCols }}
          role="row"
        >
          {columns.map((col) => (
            <div
              key={col.key}
              className={styles.cell}
              role="columnheader"
              title={col.name}
            >
              {col.name}
            </div>
          ))}
          <div className={[styles.cell, styles.actionsHeader].join(" ")} />
        </div>

        {/* Cuerpo */}
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={[styles.row, styles.hasActions].join(" ")}
            style={{ "--cols": totalCols }}
            role="row"
          >
            {columns.map((col) => {
              const val = row[col.key] ?? "";

              return (
                <div key={col.key} className={styles.cell} role="cell">
                  {col.type === "dropdown" || col.type === "select" ? (
                    <Dropdown
                      className={styles.input}
                      value={val}
                      options={col.options || []}
                      onChange={(e) =>
                        handleDropdownChange(rowIndex, col.key, e.value)
                      }
                      disabled={disabled}
                      filter
                      showClear
                    />
                  ) : col.type === "date" ? (
                    <input
                      className={styles.input}
                      type="date"
                      value={val || ""}
                      onChange={(e) =>
                        handleDateChange(rowIndex, col.key, e.target.value)
                      }
                      disabled={disabled}
                    />
                  ) : (
                    <input
                      className={styles.input}
                      type={col.type || "text"}
                      value={val}
                      onChange={(e) =>
                        handleTextOrNumberChange(
                          rowIndex,
                          col.key,
                          e.target.value
                        )
                      }
                      disabled={disabled}
                      inputMode={col.type === "number" ? "numeric" : "text"}
                    />
                  )}
                </div>
              );
            })}

            <div
              className={[styles.cell, styles.actionsCell].join(" ")}
              role="cell"
            >
              <button
                type="button"
                className={styles.removeRowBtnInCell}
                onClick={() => removeRow(rowIndex)}
                disabled={disabled || rows.length <= minRows}
                aria-label={removeButtonTitle}
                title={removeButtonTitle}
              >
                –
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

EditableTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["text", "number", "date", "dropdown", "select"]),
      options: PropTypes.array,
    })
  ).isRequired,
  value: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  initialEmptyRows: PropTypes.number,
  addButtonTitle: PropTypes.string,
  removeButtonTitle: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  minRows: PropTypes.number,
};

export default EditableTable;
