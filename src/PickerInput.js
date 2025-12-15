import { TextField } from "@mui/material";

/**
 * Read-only input that opens the calendar
 */
const PickerInput = ({ value, placeholder, onOpen }) => {
  return (
    <TextField
      fullWidth
      size="small"
      value={value}
      placeholder={placeholder}
      onClick={onOpen}
      InputProps={{ readOnly: true }}
    />
  );
};

export default PickerInput;
