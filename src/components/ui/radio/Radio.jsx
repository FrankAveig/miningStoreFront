// src/components/ui/radio/Radio.jsx
import PropTypes from "prop-types";
import { forwardRef } from "react";
import styles from "./radio.module.scss";

export const Radio = forwardRef(
  (
    {
      id,
      name,
      value,
      checked,
      defaultChecked,
      onChange,
      onBlur,
      disabled = false,
      required = false,
      error = false,
      size = "md",
      className = "",
      children,
      "aria-describedby": ariaDescribedby,
      ...rest
    },
    ref
  ) => {
    const rootClass = [
      styles["radio-container"],
      styles[`radio-container--${size}`],
      error ? styles["radio-container--error"] : "",
      disabled ? styles["radio-container--disabled"] : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <label className={rootClass} htmlFor={id}>
        <input
          ref={ref}
          id={id}
          name={name}
          type="radio"
          className={styles["radio-input"]}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          aria-invalid={error || undefined}
          aria-describedby={ariaDescribedby}
          {...rest}
        />
        <span className={styles["radio-box"]} aria-hidden="true" />
        {children ? (
          <span className={styles["radio-label"]}>{children}</span>
        ) : null}
      </label>
    );
  }
);

Radio.displayName = "Radio";

Radio.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  children: PropTypes.node,
  "aria-describedby": PropTypes.string,
};

export default Radio;
