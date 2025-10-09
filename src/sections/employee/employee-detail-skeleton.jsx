import {
  Box,
  Stack,
  IconButton,
  Skeleton,
} from "@mui/material";
import { Iconify } from "src/components/iconify";

export function SkeletonEmployeeDetailToolbar() {
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
        <IconButton disabled>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>

        <Stack spacing={0.5}>
          <Box sx={{ gap: 1, display: "flex", alignItems: "center" }}>
            <Skeleton variant="text" width={120} height={32} />
            <Skeleton variant="rounded" width={64} height={24} />
          </Box>

          <Skeleton variant="text" width={180} height={20} />
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
        <Skeleton variant="rectangular" width={100} height={36} />
      </Box>
    </Box>
  );
}
