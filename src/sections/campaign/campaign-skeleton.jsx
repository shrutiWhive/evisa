import { Box, Stack, Card, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid2";

export function CampaignItemSkeleton({ sx, itemCount = 16, ...other }) {
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

        <Box
          sx={{
            gap: 1,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
          }}
        >
          <Stack spacing={2}>
            <Skeleton sx={{ width: 100, height: 10 }} />

            <Skeleton sx={{ width: 60, height: 10 }} />
          </Stack>

          <Stack spacing={2}>
            <Skeleton sx={{ width: 70, height: 10 }} />

            <Skeleton sx={{ width: 30, height: 10 }} />
          </Stack>

          <Stack spacing={2}>
            <Skeleton sx={{ width: 60, height: 10 }} />

            <Skeleton sx={{ width: 30, height: 10 }} />
          </Stack>
        </Box>
      </Box>
    </Box>
  ));
}

export function CampaignLeadFormSkeleton() {
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack spacing={2}>
          <Skeleton sx={{ width: 300, height: 16 }} />

          <Skeleton sx={{ width: 1, height: 12 }} />
          <Skeleton sx={{ width: 0.5, height: 12 }} />
        </Stack>

        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} sx={{ width: 1, height: 35 }} />
        ))}
      </Stack>
    </Card>
  );
}

export function CampaignDetailSkeleton() {
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

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 8 }}>
          <Card sx={{ p: 3, gap: 2, display: "flex", flexDirection: "column" }}>
            <Skeleton sx={{ height: 12, width: 120 }} />

            <Skeleton sx={{ height: 10, width: 1 }} />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 3, gap: 2, display: "flex", flexDirection: "column" }}>
            <Skeleton sx={{ height: 10, width: 1 }} />

            <Skeleton sx={{ height: 10, width: 1 }} />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Card sx={{ p: 3, gap: 2, display: "flex", flexDirection: "column" }}>
            <Skeleton sx={{ height: 12, width: 80 }} />

            <Box
              sx={{
                gap: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Skeleton sx={{ height: 150, width: 150, mx: "auto" }} />

              <Skeleton sx={{ height: 10, width: 1 }} />

              <Box sx={{ gap: 2, display: "flex" }}>
                <Skeleton sx={{ height: 10, width: 50 }} />

                <Skeleton sx={{ height: 10, width: 50 }} />
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Card sx={{ p: 3, gap: 2, display: "flex", flexDirection: "column" }}>
            <Skeleton sx={{ height: 10, width: 150 }} />

            <Skeleton sx={{ height: 30, width: 1 }} />

            <Skeleton sx={{ height: 30, width: 1 }} />

            <Skeleton sx={{ height: 30, width: 1 }} />

            <Skeleton sx={{ height: 30, width: 1 }} />
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
