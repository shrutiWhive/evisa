import { TableRow, TableCell } from "@mui/material";

import { fDate } from "src/utils";

// ----------------------------------------------------------------------

export function CreditLogsTableRow({ serialNumber, row }) {
  const { created_at, description, campaign, reference } = row;



  const isCredit = row.type === "credit";
  const isDebit = row.type === "debit";

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell>{serialNumber}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}> {fDate(created_at)}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{description}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{campaign?.name}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{reference}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>
        {" "}
        {isDebit ? `Rs. ${row.amount}` : "-"}
      </TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>
        {" "}
        {isCredit ? `Rs. ${row.amount}` : "-"}
      </TableCell>
    </TableRow>
  );
}
