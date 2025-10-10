import React from 'react';
import PropTypes from 'prop-types';
import styles from './button.module.scss';

const Spinner = () => (
  <span className={styles['button__spinner']} aria-hidden="true"></span>
);

export const Button = React.forwardRef(({
  as: Component = 'button',
  type = 'button',
  variant = 'primary', // primary, secondary, danger, etc.
  size = 'md', // sm, md, lg
  isLoading = false,
  fullWidth = false,
  disabled = false,
  children,
  className = '',
  ...rest
}, ref) => {
  // Accesibilidad y props para <a> deshabilitado
  const isLink = Component === 'a';
  const isDisabled = disabled || isLoading;
  const ariaProps = isLink && isDisabled
    ? { 'aria-disabled': true, tabIndex: -1 }
    : {};

  // Clases BEM
  const buttonClass = [
    styles['button'],
    styles[`button--${variant}`],
    styles[`button--${size}`],
    isLoading ? styles['button--loading'] : '',
    isDisabled ? styles['button--disabled'] : '',
    fullWidth ? styles['button--fullwidth'] : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component
      ref={ref}
      type={Component === 'button' ? type : undefined}
      className={buttonClass}
      disabled={Component === 'button' ? isDisabled : undefined}
      aria-busy={isLoading || undefined}
      {...ariaProps}
      {...rest}
    >
      {isLoading && <Spinner />}
      <span className={styles['button__content']}>{children}</span>
    </Component>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  as: PropTypes.elementType,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  isLoading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};
