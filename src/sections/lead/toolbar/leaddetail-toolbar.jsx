import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { RouterLink } from "src/routes/components";

import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

export function LeadDetailToolbar({ backHref, name, action }) {
  return (
    <Box
      sx={{
        gap: 3,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        mb: { xs: 3, md: 5 },
      }}
    >
      <Box sx={{ gap: 1, display: "flex", alignItems: "flex-start" }}>
        <IconButton component={RouterLink} href={backHref}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>

        <Typography variant="h4"> {name} </Typography>
      </Box>

      {action && action}
    </Box>
  );
}
