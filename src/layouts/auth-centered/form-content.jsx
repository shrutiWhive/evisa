import { mergeClasses } from "minimal-shared/utils";

import Box from "@mui/material/Box";

import { layoutClasses } from "../core/classes";

// ----------------------------------------------------------------------

export function FormCenteredContent({ sx, children, className, ...other }) {
  return (
    <Box
      className={mergeClasses([layoutClasses.content, className])}
      sx={[
        (theme) => ({
          py: { xs: 3, md: 5 },
          px: { xs: 2, sm: 3, md: 4 },
          width: 1,
          zIndex: 2,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
          bgcolor: theme.vars.palette.background.default,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {children}
    </Box>
  );
}
