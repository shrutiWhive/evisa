import { alpha, Card, Stack, Typography, useTheme } from "@mui/material";

import { Iconify } from "src/components/iconify";
import { bgGradient } from "src/theme/css";

import { fNumber } from "src/utils/format-number";

export function AppWidgetSummary({
  title,
  total,
  icon,
  date,
  days,
  color = "primary",
  sx,
  ...other
}) {
  const theme = useTheme();

  // fallback if color not present in the palette
  const colorPalette = theme.palette[color] || theme.palette.primary;

  return (
    <Card
      sx={{
        p: 3,
        width: 1,
        position: "relative",
        ...bgGradient({
          direction: "75deg",
          startColor: alpha(colorPalette.light, 0.5),
          endColor: alpha(colorPalette.main, 0.6),
        }),
      }}
      {...other}
    >
      <Iconify
        icon={icon}
        sx={{
          p: 0.7,
          top: 12,
          right: 12,
          width: 30,
          height: 30,
          borderRadius: "50%",
          position: "absolute",
          color: colorPalette.lighter,
          bgcolor: colorPalette.dark,
        }}
      />

      <Stack spacing={1.5}>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="h3">{days}</Typography>

        <Typography variant="h3">{fNumber(total)}</Typography>
        <Typography variant="subtitle2">{date}</Typography>
      </Stack>
    </Card>
  );
}
