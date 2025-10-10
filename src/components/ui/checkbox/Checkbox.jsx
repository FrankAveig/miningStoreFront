import PropTypes from "prop-types";
import { forwardRef, useEffect, useRef } from "react";
import styles from "./checkbox.module.scss";

export const Checkbox = forwardRef(
  (
    {
      id,
      name,
      checked = false,
      defaultChecked,
      onChange,
      onBlur,
      disabled = false,
      required = false,
      error = false,
      indeterminate = false,
      size = "md", // sm | md | lg
      className = "",
      "aria-describedby": ariaDescribedby,
      children, // ✅ extraído para NO pasarlo al input
      ...rest
    },
    ref
  ) => {
    const innerRef = useRef(null);
    const inputRef = ref || innerRef;

    useEffect(() => {
      if (inputRef && inputRef.current) {
        inputRef.current.indeterminate = !!indeterminate;
      }
    }, [indeterminate, inputRef]);

    const rootClass = [
      styles["checkbox-container"],
      styles[`checkbox-container--${size}`],
      error ? styles["checkbox-container--error"] : "",
      disabled ? styles["checkbox-container--disabled"] : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <label className={rootClass} htmlFor={id}>
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="checkbox"
          className={styles["checkbox-input"]}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          aria-invalid={error || undefined}
          aria-describedby={ariaDescribedby}
          {...rest} // ✅ ya no contiene children
        />
        <span className={styles["checkbox-box"]} aria-hidden="true" />
        {children ? (
          <span className={styles["checkbox-label"]}>{children}</span>
        ) : null}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

Checkbox.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.bool,
  indeterminate: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  "aria-describedby": PropTypes.string,
  children: PropTypes.node, // ✅ añadido
};

export default Checkbox;
