import { TableRow, TableCell } from "@mui/material";

import { fDate } from "src/utils";

// ----------------------------------------------------------------------

export function SmsTableRow({ serialNumber, row }) {
  return (
    <TableRow hover tabIndex={-1}>
      <TableCell>{serialNumber}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{row.description}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{row.amount}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{row.type}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{row.reference}</TableCell>
      <TableCell sx={{ whiteSpace: "nowrap" }}>
        {fDate(row.created_at)}
      </TableCell>
    </TableRow>
  );
}
