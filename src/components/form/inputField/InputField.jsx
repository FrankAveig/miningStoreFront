import { Input } from "@/components/ui/input/input";
import PropTypes from "prop-types";
import React from "react";
import { FormControl } from "../formControl/FormControl";

export const InputField = React.forwardRef((props, ref) => {
  // Extraer props de FormControl y el resto para Input
  const {
    label,
    id,
    isRequired,
    error,
    hint,
    help,
    orientation,
    hideLabel,
    className,
    // Input props
    type = "text",
    value,
    onChange,
    placeholder,
    disabled,
    size="md",
    name,
    ...rest
  } = props;

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
      <Input
        ref={ref}
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={isRequired}
        error={!!error}
        size={size}
        {...rest}
      />
    </FormControl>
  );
});

InputField.displayName = "InputField";

InputField.propTypes = {
  // FormControl props
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  error: PropTypes.string,
  hint: PropTypes.string,
  help: PropTypes.string,
  orientation: PropTypes.oneOf(["vertical", "horizontal"]),
  hideLabel: PropTypes.bool,
  className: PropTypes.string,
  // Input props
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  name: PropTypes.string,
};
