import PropTypes from "prop-types";
import { forwardRef } from "react";
import styles from "./textarea.module.scss";

export const Textarea = forwardRef(
  (
    {
      value,
      onChange,
      onBlur,
      placeholder = "",
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
      styles["textarea-container"],
      styles[`textarea-container--${size}`],
      error ? styles["textarea-container--error"] : "",
      disabled ? styles["textarea-container--disabled"] : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={rootClass}>
        <textarea
          ref={ref}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          name={name}
          id={id}
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

Textarea.displayName = "Textarea";

Textarea.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  name: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  "aria-describedby": PropTypes.string,
};

export default Textarea;
