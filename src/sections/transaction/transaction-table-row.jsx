import { TableRow, TableCell, Box } from "@mui/material";

// ----------------------------------------------------------------------

export function TransactionTableRow({ serialNumber, row }) {
  const { amount, type, balance_after, created_at } = row;

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell>{serialNumber}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{amount}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>
      <Box
          sx={{
            display: "inline-block",
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: 13,
            fontWeight: 500,
            color: "black",
            backgroundColor: "primary.lighter",
            textTransform: "capitalize",
          }}>{type}</Box>
          </TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{balance_after}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{created_at}</TableCell>
    </TableRow>
  );
}
