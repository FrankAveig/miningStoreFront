import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import PropTypes from "prop-types";
import React from "react";
import { FormControl } from "../formControl/FormControl";

export const CheckboxField = React.forwardRef((props, ref) => {
  const {
    // FormControl
    label,
    id,
    isRequired = false,
    error = "",
    hint = "",
    help = "",
    orientation = "vertical",
    hideLabel = false,
    className = "",

    // Checkbox UI
    name,
    checked,
    defaultChecked,
    onChange,
    onBlur,
    disabled = false,
    indeterminate = false,
    size = "md",

    // Texto al lado del checkbox
    checkboxLabel,

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
      <Checkbox
        ref={ref}
        id={id}
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={isRequired}
        error={!!error}
        indeterminate={indeterminate}
        size={size}
        aria-describedby={describedby}
        {...rest}
      >
        {checkboxLabel}
      </Checkbox>
    </FormControl>
  );
});

CheckboxField.displayName = "CheckboxField";

CheckboxField.propTypes = {
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

  // Checkbox UI
  name: PropTypes.string,
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  indeterminate: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg"]),

  // Texto junto al checkbox
  checkboxLabel: PropTypes.node,
};

export default CheckboxField;
