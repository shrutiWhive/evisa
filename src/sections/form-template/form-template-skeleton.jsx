import { Box, Stack, Card, Skeleton } from "@mui/material";

export function FormTemplateItemSkeleton({ sx, itemCount = 16, ...other }) {
  return Array.from({ length: itemCount }, (_, index) => (
    <Box
      key={index}
      sx={[
        (theme) => ({
          display: "flex",
          borderRadius: 2,
          bgcolor: "background.paper",
          border: `solid 1px ${theme.vars.palette.divider}`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          p: 3,
          gap: 2,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Skeleton sx={{ width: 55, height: 10 }} />

          <Box
            sx={{
              gap: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Skeleton sx={{ width: 65, height: 10 }} />

            <Skeleton sx={{ width: 24, height: 10 }} />
          </Box>
        </Box>

        <Skeleton sx={{ width: 100, height: 10 }} />

        <Skeleton sx={{ width: `calc(100% - 40px)`, height: 10 }} />
        <Skeleton sx={{ width: `calc(100% - 80px)`, height: 10 }} />
      </Box>
    </Box>
  ));
}

export function FormTemplateDetailSkeleton() {
  return (
    <Stack spacing={3}>
      <Box
        sx={{
          gap: 3,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box sx={{ gap: 1, display: "flex", alignItems: "flex-start" }}>
          <Skeleton sx={{ height: 15, width: 15 }} />

          <Stack spacing={2}>
            <Box sx={{ gap: 2, display: "flex" }}>
              <Skeleton sx={{ width: 250, height: 12 }} />

              <Skeleton sx={{ width: 50, height: 12 }} />
            </Box>

            <Skeleton sx={{ width: 150, height: 10 }} />
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
          <Skeleton sx={{ height: 10, width: 50 }} />
        </Box>
      </Box>

      <Card sx={{ p: 3, gap: 3, display: "flex", flexDirection: "column" }}>
        <Skeleton sx={{ height: 10, width: 100 }} />

        <Skeleton sx={{ height: 10, width: 1 }} />

        <Skeleton sx={{ height: 10, width: 1 }} />

        <Skeleton sx={{ height: 10, width: 0.5 }} />
      </Card>

      <Card sx={{ p: 3, gap: 3, display: "flex", flexDirection: "column" }}>
        <Skeleton sx={{ height: 10, width: 100 }} />

        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} sx={{ height: 10, width: 1 }} />
        ))}
      </Card>
    </Stack>
  );
}
