import { TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

export const FormField = ({
  label,
  required = false,
  xs = 12,
  md = 4,
  type = "text",
  placeholder = "",
  value,
  onChange,
  ...props
}) => (
  <Grid item xs={xs} md={md}>
    <Typography sx={{ mb: 1, fontSize: 14 }}>
      {label} {required && <span style={{ color: "#f44336" }}>*</span>}
    </Typography>
    <TextField
      fullWidth
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      sx={{
        "& .MuiOutlinedInput-root": {
          backgroundColor: "#fff",
        },
      }}
      {...props}
    />
  </Grid>
);
