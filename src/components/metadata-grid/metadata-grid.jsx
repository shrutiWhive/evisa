// src/sections/lead/components/MetaDataGrid.tsx

import { Typography, Box, Link } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { fDateTime } from "src/utils";

export function MetaDataGrid({ metaData }) {
  if (!metaData || typeof metaData !== "object") return null;

  return (
    <>
      {Object.entries(metaData).map(([key, value]) => {
        const formattedKey = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        const isEmail = typeof value === "string" && value.includes("@");
        const isDateField =
          typeof value === "string" && key.toLowerCase().includes("date");

        const displayValue = isDateField ? fDateTime(value) : value;
        return (
          <Grid size={{ xs: 12, md: 4 }} key={key}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {formattedKey}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              {isEmail ? (
                <Link href={`mailto:${value}`} underline="hover">
                  {value}
                </Link>
              ) : (
                <Typography>{displayValue}</Typography>
              )}
            </Box>
          </Grid>
        );
      })}
    </>
  );
}
