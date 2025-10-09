import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

import { EmptyContent } from "../empty-content";

// ----------------------------------------------------------------------

export function TableNoData({ notFound, title, sx }) {
  return (
    <TableRow>
      {notFound ? (
        <TableCell colSpan={12}>
          <EmptyContent
            title={title}
            filled
            sx={[{ py: 10 }, ...(Array.isArray(sx) ? sx : [sx])]}
          />
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}
