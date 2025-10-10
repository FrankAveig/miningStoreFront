import React from 'react';
import PropTypes from 'prop-types';
import styles from './breadCrumb.module.scss';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
export const BreadCrumb = React.forwardRef(({ items, separator = <FaChevronRight /> }, ref) => {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb" ref={ref}>
      <ol className={styles.breadcrumb__list}>
        {items.map((item, idx) => (
          <li key={idx} className={styles.breadcrumb__item}>
            {item.to && idx !== items.length - 1 ? (
              <Link to={item.to} className={styles.breadcrumb__link}>
                {item.icon && <span className={styles.breadcrumb__icon}>{item.icon}</span>}
                {item.label}
              </Link>
            ) : (
              <span className={styles.breadcrumb__current} aria-current="page">
                {item.icon && <i className={styles.breadcrumb__icon}>{item.icon}</i>}
                {item.label}
              </span>
            )}
            {idx < items.length - 1 && (
              <span className={styles.breadcrumb__separator}>{separator}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
});

BreadCrumb.displayName = 'BreadCrumb';

BreadCrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string,
      icon: PropTypes.node
    })
  ).isRequired,
  separator: PropTypes.node
}; 