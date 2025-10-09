import { useCallback } from "react";

import { Box, TextField, InputAdornment } from "@mui/material";

import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

export function AppointmentTimeSlotTableToolbar({ filters, onResetPage }) {
  const { state: currentFilters, setState: updateFilters } = filters;

  const handleFilterKeyword = useCallback(
    (event) => {
      onResetPage();
      updateFilters({ keyword: event.target.value });
    },
    [onResetPage, updateFilters]
  );

  return (
    <Box
      sx={{
        p: 2.5,
      }}
    >
      <TextField
        fullWidth
        value={currentFilters.keyword}
        onChange={handleFilterKeyword}
        placeholder="Search max bookings..."
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: "text.disabled" }}
                />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
}
