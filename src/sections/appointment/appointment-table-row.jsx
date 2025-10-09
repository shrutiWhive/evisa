import { TableRow, TableCell } from "@mui/material";

import { fDate } from "src/utils";

// ----------------------------------------------------------------------

export function AppointmentTableRow({ serialNumber, row }) {
  const { name, email, phone, appointment_date, status, category, slot } = row;

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell>{serialNumber}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{name}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{email}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{phone}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{status}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{category?.name}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>
        {fDate(appointment_date)}
      </TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>
        {slot?.start_time} {slot?.end_time}
      </TableCell>
    </TableRow>
  );
}
