import { TableRow, TableCell } from "@mui/material";

import { fDate } from "src/utils";

// ----------------------------------------------------------------------

export function TransactionTableRow({ serialNumber, row }) {
  const {
    total_debits,
    total_credits,
    net_balance,
    total_sms_debits,
    total_topup_debits,
    total_package_debits,
  } = row;

  console.log("this is data row", row);

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell>{serialNumber}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{total_debits}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{total_credits}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{net_balance}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{total_sms_debits}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{total_topup_debits}</TableCell>
      <TableCell sx={{ whiteSpace: "nowrap" }}>
        {total_package_debits}
      </TableCell>
    </TableRow>
  );
}
