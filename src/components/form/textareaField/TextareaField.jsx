import { Textarea } from "@/components/ui/textarea/Textarea";
import PropTypes from "prop-types";
import React from "react";
import { FormControl } from "../formControl/FormControl";

export const TextareaField = React.forwardRef((props, ref) => {
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

    value,
    onChange,
    onBlur,
    placeholder = "",
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
      <Textarea
        ref={ref}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
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

TextareaField.displayName = "TextareaField";

TextareaField.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  error: PropTypes.string,
  hint: PropTypes.string,
  help: PropTypes.string,
  orientation: PropTypes.oneOf(["vertical", "horizontal"]),
  hideLabel: PropTypes.bool,
  className: PropTypes.string,

  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  name: PropTypes.string,
};

export default TextareaField;
