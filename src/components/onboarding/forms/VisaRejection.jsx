import React from "react";
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { z } from "zod";
import Grid from "@mui/material/Grid2";

// ------------------ Validation Schema ------------------
export const visaRejectionSchema = z.object({
  employee_visa_rejected: z.string().default("no"),
  dependents_visa_rejected: z.string().default("no"),
});

// ------------------ Component ------------------
export const VisaRejection = () => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  return (
    <Box id="section-12" sx={{ mb: 6 }}>
      <Grid container spacing={3}>
        {/* Recent Record */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1 }}>
            Have you ever been rejected for the visa ?{" "}
          </Typography>
          <Controller
            name="employee_visa_rejected"
            control={control}
            defaultValue="no"
            render={({ field }) => (
              <FormControl error={!!errors.recentRecord}>
                <RadioGroup row {...field}>
                  <FormControlLabel
                    value="yes"
                    control={
                      <Radio
                        sx={{
                          color: "secondary.main",
                          "&.Mui-checked": {
                            color: "secondary.main",
                          },
                        }}
                      />
                    }
                    label="Yes"
                  />
                  <FormControlLabel
                    value="no"
                    control={
                      <Radio
                        sx={{
                          color: "secondary.main",
                          "&.Mui-checked": {
                            color: "secondary.main",
                          },
                        }}
                      />
                    }
                    label="No"
                  />
                </RadioGroup>
                {errors.recentRecord && (
                  <FormHelperText>
                    {errors.recentRecord?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Record 2 */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1 }}>
            Have your dependent ever been rejected for the visa ?
          </Typography>
          <Controller
            name="dependents_visa_rejected"
            control={control}
            defaultValue="no"
            render={({ field }) => (
              <FormControl error={!!errors.record2}>
                <RadioGroup row {...field}>
                  <FormControlLabel
                    value="yes"
                    control={
                      <Radio
                        sx={{
                          color: "secondary.main",
                          "&.Mui-checked": {
                            color: "secondary.main",
                          },
                        }}
                      />
                    }
                    label="Yes"
                  />
                  <FormControlLabel
                    value="no"
                    control={
                      <Radio
                        sx={{
                          color: "secondary.main",
                          "&.Mui-checked": {
                            color: "secondary.main",
                          },
                        }}
                      />
                    }
                    label="No"
                  />
                </RadioGroup>
                {errors.record2 && (
                  <FormHelperText>{errors.record2?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
