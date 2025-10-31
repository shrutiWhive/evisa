import { TableRow, TableCell } from "@mui/material";

import { fDate, fCurrency } from "src/utils";

// ----------------------------------------------------------------------

// Render a finance plan row. Expected `row` shape (from API):
// {
//   id, total_fee, paid_amount, due_amount, status, updated_at, finance_plan: { plan_name, visa_type }
// }
export function PaymentTableRow({ serialNumber, row }) {
  const {
    total_fee,
    paid_amount,
    due_amount,
    status,
    updated_at,
    finance_plan,
  } = row;

  const planName = finance_plan?.plan_name || "-";
  const visaType = finance_plan?.visa_type || "-";

  const formattedTotalFee = total_fee ? fCurrency(total_fee) : "-";
  const formattedPaidAmount = paid_amount ? fCurrency(paid_amount) : "-";
  const formattedDueAmount = due_amount ? fCurrency(due_amount) : "-";

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell>{serialNumber}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{planName}</TableCell>

  <TableCell sx={{ whiteSpace: "nowrap" }}>{formattedTotalFee}</TableCell>

  <TableCell sx={{ whiteSpace: "nowrap" }}>{formattedPaidAmount}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{status}</TableCell>

  <TableCell sx={{ whiteSpace: "nowrap" }}>{formattedDueAmount}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{visaType}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{fDate(updated_at)}</TableCell>
    </TableRow>
  );
}
