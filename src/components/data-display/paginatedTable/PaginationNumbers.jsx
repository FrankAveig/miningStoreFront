import React from 'react'
import PropTypes from 'prop-types'

export const PaginationNumbers = ({ currentPage, lastPage, onPageChange }) => {
    const getPageNumbers = () => {
      const delta = 2; // Número de páginas a mostrar antes y después de la actual
      const range = [];
      const rangeWithDots = [];
      let l;
  
      for (let i = 1; i <= lastPage; i++) {
        if (
          i === 1 || // Primera página
          i === lastPage || // Última página
          (i >= currentPage - delta && i <= currentPage + delta) // Páginas alrededor de la actual
        ) {
          range.push(i);
        }
      }
  
      range.forEach((i) => {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      });
  
      return rangeWithDots;
    };
  
    return (
      <div className="paginated-table__pagination-numbers">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            className={`paginated-table__pagination-number ${
              page === currentPage ? 'paginated-table__pagination-number--active' : ''
            }`}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

PaginationNumbers.propTypes = {
  currentPage: PropTypes.number.isRequired,
  lastPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
