import { Box, Typography, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useGetVacancyDetail } from "src/api/vacancy";
import { z } from "zod";

// ✅ Step-specific Zod schema (kept for consistency)
export const sponsorInformationSchema = z.object({
  sponsor_name: z.string().min(1, "Sponsor name is required"),
  sponsor_position: z.string().min(1, "Sponsor position is required"),
  sponsor_location: z.string().min(1, "Sponsor location is required"),
});

export const SponsorInformation = ({ detail }) => {
  const { vacancyDetail, vacancyLoading } = useGetVacancyDetail(detail);
  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  // ✅ Prefill form values from `detail`
  // This ensures the values are part of form data (for submission)
  useEffect(() => {
    if (detail) {
      setValue("sponsor_name", vacancyDetail.title || "");
      setValue("sponsor_position", vacancyDetail.title || "");
      setValue("sponsor_location", vacancyDetail.location || "");
    }
  }, [detail, setValue]);

  return (
    <Box id="section-3" sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Sponsor Information
      </Typography>

      <Grid container spacing={3}>
        {/* Sponsor Name */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={{ mb: 1 }}>Sponsor Name</Typography>
          <TextField
            fullWidth
            value={vacancyDetail?.title || ""}
            InputProps={{ readOnly: true }}
            sx={{
              "& .MuiOutlinedInput-root": { backgroundColor: "#f5f5f5" },
            }}
          />
          {errors.sponsor_name && (
            <Typography color="error" variant="caption">
              {errors.sponsor_name.message}
            </Typography>
          )}
        </Grid>

        {/* Sponsor Position */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={{ mb: 1 }}>Sponsor Position</Typography>
          <TextField
            fullWidth
            value={vacancyDetail?.title || ""}
            InputProps={{ readOnly: true }}
            sx={{
              "& .MuiOutlinedInput-root": { backgroundColor: "#f5f5f5" },
            }}
          />
          {errors.sponsor_position && (
            <Typography color="error" variant="caption">
              {errors.sponsor_position.message}
            </Typography>
          )}
        </Grid>

        {/* Sponsor Location */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1 }}>Sponsor Location</Typography>
          <TextField
            fullWidth
            value={vacancyDetail?.location || ""}
            InputProps={{ readOnly: true }}
            sx={{
              "& .MuiOutlinedInput-root": { backgroundColor: "#f5f5f5" },
            }}
          />
          {errors.sponsor_location && (
            <Typography color="error" variant="caption">
              {errors.sponsor_location.message}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
