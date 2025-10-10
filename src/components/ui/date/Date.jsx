import PropTypes from "prop-types";
import { forwardRef } from "react";
import styles from "./date.module.scss";

export const Date = forwardRef(
  (
    {
      value,
      onChange,
      onBlur,
      placeholder = "",
      min,
      max,
      disabled = false,
      required = false,
      error = false,
      size = "md", // sm, md, lg
      name,
      id,
      className = "",
      "aria-describedby": ariaDescribedby,
      ...rest
    },
    ref
  ) => {
    const rootClass = [
      styles["date-container"],
      styles[`date-container--${size}`],
      error ? styles["date-container--error"] : "",
      disabled ? styles["date-container--disabled"] : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={rootClass}>
        {/* Ícono decorativo */}
        <svg
          className={styles["date-icon"]}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1.5A2.5 2.5 0 0 1 22 6.5v13A2.5 2.5 0 0 1 19.5 22h-15A2.5 2.5 0 0 1 2 19.5v-13A2.5 2.5 0 0 1 4.5 4H6V3a1 1 0 0 1 1-1Zm0 5H4.5a.5.5 0 0 0-.5.5V9h16V7.5a.5.5 0 0 0-.5-.5H18v1a1 1 0 1 1-2 0V7H8v1a1 1 0 0 1-2 0V7Z" />
        </svg>

        <input
          ref={ref}
          type="date"
          className={styles["date"]}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          name={name}
          id={id}
          min={min}
          max={max}
          disabled={disabled}
          required={required}
          aria-invalid={error || undefined}
          aria-describedby={ariaDescribedby}
          {...rest}
        />
      </div>
    );
  }
);

Date.displayName = "Date";

Date.propTypes = {
  value: PropTypes.string, // YYYY-MM-DD
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  min: PropTypes.string,
  max: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  name: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  "aria-describedby": PropTypes.string,
};

export default Date;
