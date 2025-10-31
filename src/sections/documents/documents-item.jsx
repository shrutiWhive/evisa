import { TableRow, TableCell, Chip, IconButton, Checkbox } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { fDateTime } from "src/utils/format-time";

// ----------------------------------------------------------------------

export function DocumentsTableRow({ serialNumber, row, selected, onSelectRow }) {
  const getStatusChipColor = (status) => {
    switch (status) {
      case "signed":
        return { bgcolor: "#D2F3EE", color: "#2BA597" };
      case "rejected":
        return { bgcolor: "#FFE7E7", color: "#D32F2F" };
      case "pending_signature":
      default:
        return { bgcolor: "#FFF4E5", color: "#F57C00" };
    }
  };

  return (
    <TableRow hover tabIndex={-1} selected={selected}>
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}

      <TableCell sx={{ minWidth: { xs: 40, sm: 50 } }}>
        {serialNumber}
      </TableCell>

      <TableCell sx={{ 
        whiteSpace: "nowrap",
        minWidth: { xs: 120, sm: 150 }
      }}>
        {row.contract_number}
      </TableCell>

      <TableCell sx={{ 
        whiteSpace: "nowrap",
        minWidth: { xs: 120, sm: 150 },
        maxWidth: { xs: 150, sm: 200 },
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {row.vacancy?.title || "-"}
      </TableCell>

      <TableCell sx={{ 
        whiteSpace: "nowrap",
        minWidth: { xs: 100, sm: 150 },
        maxWidth: { xs: 150, sm: 200 },
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {row.vacancy?.employer?.company_name || "-"}
      </TableCell>

      <TableCell sx={{ 
        whiteSpace: "nowrap",
        minWidth: { xs: 80, sm: 120 }
      }}>
        {row.vacancy?.location || "-"}
      </TableCell>

      <TableCell sx={{ 
        whiteSpace: "nowrap",
        minWidth: { xs: 70, sm: 90 }
      }}>
        {row.vacancy?.wages ? `$${row.vacancy.wages}` : "-"}
      </TableCell>

      <TableCell sx={{ minWidth: { xs: 100, sm: 120 } }}>
        <Chip
          label={row.status?.replace("_", " ")}
          size="small"
          sx={{
            textTransform: "capitalize",
            fontSize: { xs: '0.65rem', sm: '0.75rem' },
            height: { xs: 20, sm: 24 },
            ...getStatusChipColor(row.status),
          }}
        />
      </TableCell>

      <TableCell align="center" sx={{ minWidth: { xs: 50, sm: 70 } }}>
        {row.unsigned_pdf_url ? (
          <IconButton
            size="small"
            onClick={() => window.open(row.unsigned_pdf_url, "_blank")}
            sx={{ padding: { xs: '4px', sm: '8px' } }}
          >
            <Iconify icon="eva:file-text-fill" width={{ xs: 18, sm: 20 }} />
          </IconButton>
        ) : (
          "-"
        )}
      </TableCell>

      <TableCell align="center" sx={{ minWidth: { xs: 50, sm: 70 } }}>
        {row.signed_pdf_url ? (
          <IconButton
            size="small"
            onClick={() => window.open(row.signed_pdf_url, "_blank")}
            sx={{ padding: { xs: '4px', sm: '8px' } }}
          >
            <Iconify icon="eva:file-text-fill" width={{ xs: 18, sm: 20 }} />
          </IconButton>
        ) : (
          "-"
        )}
      </TableCell>

      <TableCell sx={{ 
        whiteSpace: "nowrap",
        minWidth: { xs: 100, sm: 140 },
        fontSize: { xs: '0.7rem', sm: '0.875rem' }
      }}>
        {row.generated_at ? fDateTime(row.generated_at) : "-"}
      </TableCell>
    </TableRow>
  );
}
