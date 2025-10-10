import { Switch } from "@/components/ui/switch/Switch";
import { useRef, useState } from "react";
import PropTypes from "prop-types";
import "./paginatedTable.scss";
import { PaginationNumbers } from "./PaginationNumbers";
import { TableSkeleton } from "./TableSkeleton";

export const PaginatedTable = ({
  dataToPresent,
  columns,
  pagination,
  onPageChange,
  onLimitChange,
  actions,
  loading = false,
}) => {
  const tableContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value);
    onLimitChange(newLimit);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - tableContainerRef.current.offsetLeft);
    setScrollLeft(tableContainerRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - tableContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    tableContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const renderCellContent = (item, col) => {
    if (col.type === "image" && item[col.key]) {
      return (
        <div className="paginated-table__image-container">
          <img
            src={item[col.key]}
            alt={item[col.altKey] || "Imagen"}
            className="paginated-table__image"
          />
        </div>
      );
    }

    // Para celdas con clases CSS específicas (como los tipos de movimiento)
    if (col.key === "type_display" && item.type_class) {
      return (
        <span className={`paginated-table__cell-content ${item.type_class}`}>
          {item[col.key]}
        </span>
      );
    }

    return item[col.key];
  };

  const renderActions = (item) => {
    if (!actions || !actions.length) return null;

    return (
      <div className="paginated-table__actions">
        {actions.map((action, index) => {
          if (typeof action.render === "function") {
            return (
              <span key={index} className="paginated-table__action-button">
                {action.render(item)}
              </span>
            );
          }
          if (action.type === "switch") {
            return (
              <Switch
                key={index}
                isChecked={action.isChecked(item)}
                onChange={() => action.onChange(item)}
                disabled={action.disabled}
                size="medium"
                color={action.color(item)}
              />
            );
          }

          const Icon = action.icon;
          return (
            <button
              key={index}
              className="paginated-table__action-button"
              onClick={(e) => action.onClick(item, e)}
              title={action.tooltip}
              aria-label={action.tooltip}
              disabled={!Icon}
            >
              {Icon ? (
                <Icon className="paginated-table__action-icon" />
              ) : (
                <span className="paginated-table__action-icon" />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="paginated-table">
      <div
        className="paginated-table__table-container"
        ref={tableContainerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <table className="paginated-table__table">
          <thead className="paginated-table__header">
            <tr className="paginated-table__header-row">
              {columns.map((col) => (
                <th
                  className="paginated-table__header-cell"
                  key={col.key}
                  style={col.type === "image" ? { width: "100px" } : {}}
                >
                  {col.label}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="paginated-table__header-cell paginated-table__header-cell--actions">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          {loading ? (
            <TableSkeleton
              columns={columns}
              actions={actions}
              rowCount={pagination?.limit || 5}
            />
          ) : dataToPresent?.length > 0 ? (
            <tbody className="paginated-table__body">
              {dataToPresent.map((item) => (
                <tr className="paginated-table__body-row" key={item.id}>
                  {columns.map((col) => (
                    <td
                      className="paginated-table__body-cell"
                      key={col.key}
                      style={col.type === "image" ? { width: "100px" } : {}}
                    >
                      {renderCellContent(item, col)}
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="paginated-table__body-cell paginated-table__body-cell--actions">
                      {renderActions(item)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody className="paginated-table__body">
              <tr className="paginated-table__body-row">
                <td
                  className="paginated-table__body-cell"
                  colSpan={columns.length + (actions && actions.length ? 1 : 0)}
                >
                  No hay datos disponibles
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {!loading && (
        <div className="paginated-table__pagination">
          <button
            className="paginated-table__pagination-button"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Anterior
          </button>

          <PaginationNumbers
            currentPage={pagination.page}
            lastPage={pagination.totalPages}
            onPageChange={onPageChange}
          />

          <button
            className="paginated-table__pagination-button"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Siguiente
          </button>

          <span className="paginated-table__pagination-info">
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <label
            htmlFor="limit-select"
            className="paginated-table__limit-label"
          >
            Mostrar:
          </label>
          <select
            id="limit-select"
            className="paginated-table__limit-select"
            value={pagination.limit}
            onChange={handleLimitChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      )}
    </div>
  );
};

PaginatedTable.propTypes = {
  dataToPresent: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
    })
  ).isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    total: PropTypes.number,
  }).isRequired,
  onPageChange: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.elementType,
      tooltip: PropTypes.string,
      onClick: PropTypes.func,
      type: PropTypes.string,
      isChecked: PropTypes.func,
      onChange: PropTypes.func,
      disabled: PropTypes.bool,
      color: PropTypes.func,
      render: PropTypes.func,
    })
  ),
  loading: PropTypes.bool,
};
