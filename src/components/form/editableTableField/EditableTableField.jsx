import { EditableTable } from "@/components/ui/editableTable/EditableTable";
import PropTypes from "prop-types";
import { FormControl } from "../formControl/FormControl";
import styles from "./editableTableField.module.scss";

export const EditableTableField = ({
  label,
  id,
  isRequired = false,
  error = "",
  hint = "",
  help = "",
  orientation = "vertical",
  hideLabel = false,
  className = "",

  // EditableTable props
  columns,
  value,
  onChange,
  initialEmptyRows = 1,
  addButtonTitle,
  disabled = false,
  name,
}) => {
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
      className={[styles.block, className].filter(Boolean).join(" ")}
    >
      <EditableTable
        name={name}
        columns={columns}
        value={value}
        onChange={onChange}
        initialEmptyRows={initialEmptyRows}
        addButtonTitle={addButtonTitle}
        disabled={disabled}
        aria-describedby={describedby}
      />
    </FormControl>
  );
};

EditableTableField.propTypes = {
  // FormControl
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  error: PropTypes.string,
  hint: PropTypes.string,
  help: PropTypes.string,
  orientation: PropTypes.oneOf(["vertical", "horizontal"]),
  hideLabel: PropTypes.bool,
  className: PropTypes.string,

  // EditableTable
  columns: PropTypes.array.isRequired,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  initialEmptyRows: PropTypes.number,
  addButtonTitle: PropTypes.string,
  disabled: PropTypes.bool,
};

export default EditableTableField;
