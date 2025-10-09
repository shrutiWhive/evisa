import { TableRow, TableCell, Tooltip, IconButton } from "@mui/material";

import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

export function AppointmentTimeSlotTableRow({ serialNumber, row, onEdit }) {
  const { start_time, end_time, max_bookings } = row;

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell>{serialNumber}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{start_time}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{end_time}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{max_bookings}</TableCell>

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
