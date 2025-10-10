import { Date as DateInput } from "@/components/ui/date/Date";
import PropTypes from "prop-types";
import React from "react";
import { FormControl } from "../formControl/FormControl";

export const DateField = React.forwardRef((props, ref) => {
  const {
    label,
    id,
    isRequired = false,
    error = "",
    hint = "",
    help = "",
    orientation = "vertical",
    hideLabel = false,
    className = "",

    // Date props
    value,
    onChange,
    onBlur,
    placeholder = "",
    min,
    max,
    disabled = false,
    size = "md",
    name,

    ...rest
  } = props;

  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedby = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <FormControl
      label={label}
      id={id}
      isRequired={isRequired}
      error={error}
      hint={hint}
      help={help}
      orientation={orientation}
      hideLabel={hideLabel}
      className={className}
    >
      <DateInput
        ref={ref}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        min={min}
        max={max}
        disabled={disabled}
        required={isRequired}
        error={!!error}
        size={size}
        aria-describedby={describedby}
        {...rest}
      />
    </FormControl>
  );
});

DateField.displayName = "DateField";

DateField.propTypes = {
  // FormControl
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  error: PropTypes.string,
  hint: PropTypes.string,
  help: PropTypes.string,
  orientation: PropTypes.oneOf(["vertical", "horizontal"]),
  hideLabel: PropTypes.bool,
  className: PropTypes.string,

  // Date (UI)
  value: PropTypes.string, // 'YYYY-MM-DD'
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  min: PropTypes.string, // 'YYYY-MM-DD'
  max: PropTypes.string, // 'YYYY-MM-DD'
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  name: PropTypes.string,
};

export default DateField;
