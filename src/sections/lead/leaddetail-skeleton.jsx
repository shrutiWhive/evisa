// src/sections/leads/skeleton/LeadDetailSkeleton.tsx
import { Card, Grid, Skeleton, Stack, Box } from "@mui/material";

export function LeadDetailSkeleton() {
  return (
    <Card sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
      {/* Avatar + phone/status line */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Stack direction="row" spacing={2}>
          <Skeleton variant="circular" width={48} height={48} />
          <Box>
            <Skeleton width={120} height={24} />
            <Skeleton width={100} height={20} sx={{ mt: 1 }} />
          </Box>
        </Stack>

        <Skeleton width={120} height={32} />
      </Box>

      {/* MetaData Grid skeletons */}
      <Grid container spacing={2}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Skeleton variant="rectangular" height={80} />
          </Grid>
        ))}
      </Grid>
    </Card>
  );
}
