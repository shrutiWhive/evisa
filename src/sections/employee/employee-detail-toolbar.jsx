import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { RouterLink } from "src/routes/components";

import { fDateTime } from "src/utils/format-time";

import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

export function EmployeeDetailToolbar({
  status,
  backHref,
  editHref,
  createdAt,
  name,
  contactNumber,
}) {
  return (
    <Box
      sx={{
        gap: 3,
        display: "flex",
        mb: { xs: 3, md: 5 },
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box sx={{ gap: 1, display: "flex", alignItems: "flex-start" }}>
        <IconButton component={RouterLink} href={backHref}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>

        <Stack spacing={0.5}>
          <Box sx={{ gap: 1, display: "flex", alignItems: "center" }}>
            <Typography variant="h4"> {name} </Typography>
            <Label
              variant="soft"
              color={
                (status === "Active" && "success") ||
                (status === "Inactive" && "error") ||
                "default"
              }
            >
              {status}
            </Label>
          </Box>

          <Typography variant="body2" sx={{ color: "text.disabled" }}>
            {fDateTime(createdAt)}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.disabled" }}>
            {contactNumber}
          </Typography>
        </Stack>
      </Box>

      <Box
        sx={{
          gap: 1.5,
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Button
          component={RouterLink}
          href={editHref}
          color="inherit"
          variant="contained"
          startIcon={<Iconify icon="solar:pen-bold" />}
        >
          Edit
        </Button>
      </Box>
    </Box>
  );
}
