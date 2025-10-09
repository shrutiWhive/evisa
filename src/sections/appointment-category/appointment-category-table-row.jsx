import { TableRow, TableCell, Tooltip, IconButton } from "@mui/material";

import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

export function AppointmentCategoryTableRow({ serialNumber, row, onEdit }) {
  const { name, description } = row;

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell>{serialNumber}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{name}</TableCell>

      <TableCell
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 250,
        }}
      >
        {description}
      </TableCell>

      <TableCell align="right">
        <Tooltip title="Edit">
          <IconButton onClick={onEdit}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
