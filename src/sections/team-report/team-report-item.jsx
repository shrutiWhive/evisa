import { TableRow, TableCell } from "@mui/material";

import { fDate } from "src/utils";

// ----------------------------------------------------------------------

export function ReportTableRow({ serialNumber, row }) {
  const {
    name,
    totalSms,
    totalEmails,
    totalCalls,
    totalMeetings,
    totalFollowupsScheduled,
    totalContacted,
    totalInProgress,
    totalLost,
    totalConverted,
    created_at,
  } = row;

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell>{serialNumber}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{name}</TableCell>
      <TableCell sx={{ whiteSpace: "nowrap" }}>{fDate(created_at)}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{totalSms}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{totalEmails}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{totalCalls}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{totalMeetings}</TableCell>
      <TableCell sx={{ whiteSpace: "nowrap" }}>
        {totalFollowupsScheduled}
      </TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{totalContacted}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{totalInProgress}</TableCell>

      <TableCell sx={{ whiteSpace: "nowrap" }}>{totalLost}</TableCell>
      <TableCell sx={{ whiteSpace: "nowrap" }}>{totalConverted}</TableCell>
    </TableRow>
  );
}
