import React from 'react';
import PropTypes from 'prop-types';
import './paginatedTable.scss';

export const TableSkeleton = ({ columns, actions, rowCount = 5 }) => {
  const renderSkeletonRows = () => {
    const rows = [];

    for (let i = 0; i < rowCount; i++) {
      rows.push(
        <tr className="paginated-table__body-row" key={`skeleton-${i}`}>
          {columns.map((col) => (
            <td 
              className="paginated-table__body-cell" 
              key={`skeleton-${col.key}`}
              style={col.type === 'image' ? { width: '100px' } : {}}
            >
              <div className="paginated-table__skeleton">
                {col.type === 'image' ? (
                  <div className="paginated-table__skeleton-image" />
                ) : (
                  <div className="paginated-table__skeleton-text" />
                )}
              </div>
            </td>
          ))}
          {actions && actions.length > 0 && (
            <td className="paginated-table__body-cell paginated-table__body-cell--actions">
              <div className="paginated-table__skeleton-actions">
                {actions.map((_, index) => (
                  <div key={`skeleton-action-${index}`} className="paginated-table__skeleton-action" />
                ))}
              </div>
            </td>
          )}
        </tr>
      );
    }
    return rows;
  };

  return (
    <tbody className="paginated-table__body">
      {renderSkeletonRows()}
    </tbody>
  );
};

TableSkeleton.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      type: PropTypes.string,
    })
  ).isRequired,
  actions: PropTypes.array,
  rowCount: PropTypes.number,
}; 