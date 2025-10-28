import React from "react";
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Stack,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import {
  useForm,
  Controller,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Grid from "@mui/material/Grid2";

// ------------------ Validation Schema ------------------
export const immigrationHistorySchema = z
  .object({
    types: z.string().min(1, "Please select a type"),
    beenToUsa: z.enum(["yes", "no"], {
      errorMap: () => ({ message: "Please select an option" }),
    }),
    socialSecurity: z.enum(["yes", "no"], {
      errorMap: () => ({ message: "Please select an option" }),
    }),
    socialSecurityNumber: z.string().optional(),
    inUsaApplicant: z.enum(["yes", "no"], {
      errorMap: () => ({ message: "Please select an option" }),
    }),
    applicantName: z.string().optional(),
    inUsaDependent: z.enum(["yes", "no"], {
      errorMap: () => ({ message: "Please select an option" }),
    }),
    dependentName: z.string().optional(),
    i94Number: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Social Security Number required if "yes"
    if (data.socialSecurity === "yes" && !data.socialSecurityNumber?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter your Social Security Number",
        path: ["socialSecurityNumber"],
      });
    }

    // Applicant Name required if in USA
    if (data.inUsaApplicant === "yes" && !data.applicantName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter applicant name",
        path: ["applicantName"],
      });
    }

    // Dependent Name required if in USA
    if (data.inUsaDependent === "yes" && !data.dependentName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter dependent name",
        path: ["dependentName"],
      });
    }

    // I-94 Number required if applicant or dependent in USA
    if (
      (data.inUsaApplicant === "yes" || data.inUsaDependent === "yes") &&
      !data.i94Number?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter your most recent I-94 number",
        path: ["i94Number"],
      });
    }
  });

// ------------------ Component ------------------
export const ImmigrationHistory = () => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const socialSecurity = watch("socialSecurity");
  const inUsaApplicant = watch("inUsaApplicant");
  const inUsaDependent = watch("inUsaDependent");
  const recentRecord = watch("recentRecord");
  const record2 = watch("record2");
  const record3 = watch("record3");
  const record4 = watch("record4");

  const types = ["Consular Processing", "Option 1", "Option 2", "Option 3"];
  const visaTypes = ["B1/B2", "F1", "H1B", "L1", "J1", "O1", "Other"];

  return (
    <Box id="section-10" sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Immigration History
      </Typography>

      <Grid container spacing={3}>
        {/* Type */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1 }}>Type </Typography>
          <Controller
            name="types"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.types}>
                <TextField
                  {...field}
                  select
                  fullWidth
                  displayEmpty
                  error={!!errors.types}
                  sx={{
                    "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                  }}
                >
                  <MenuItem value="">
                    <em>Select Type</em>
                  </MenuItem>
                  {types.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                {errors.types && (
                  <FormHelperText>{errors.types?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Have you ever been to USA */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1 }}>
            Have you ever been to the United States of America?
          </Typography>
          <Controller
            name="beenToUsa"
            control={control}
            defaultValue="no"
            render={({ field }) => (
              <FormControl error={!!errors.beenToUsa}>
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
                {errors.beenToUsa && (
                  <FormHelperText>{errors.beenToUsa?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Social Security */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1 }}>
            Have you ever had a Social Security Number?
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Controller
              name="socialSecurity"
              control={control}
              defaultValue="no"
              render={({ field }) => (
                <FormControl error={!!errors.socialSecurity}>
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
                  {errors.socialSecurity && (
                    <FormHelperText>
                      {errors.socialSecurity?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {socialSecurity === "yes" && (
              <Controller
                name="socialSecurityNumber"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Social Security Number"
                    fullWidth
                    sx={{
                      maxWidth: { xs: "100%", sm: 400 },
                      "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                    }}
                    error={!!errors.socialSecurityNumber}
                    helperText={errors.socialSecurityNumber?.message}
                  />
                )}
              />
            )}
          </Stack>
        </Grid>

        {/* Section Header */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Please answer for the Principal Applicant and Dependents
          </Typography>

          <Typography>Are you currently in the US?</Typography>
        </Grid>

        {/* Applicant */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1 }}>Applicant</Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Controller
              name="inUsaApplicant"
              control={control}
              defaultValue="no"
              render={({ field }) => (
                <FormControl error={!!errors.inUsaApplicant}>
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
                  {errors.inUsaApplicant && (
                    <FormHelperText>
                      {errors.inUsaApplicant?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {inUsaApplicant === "yes" && (
              <Controller
                name="applicantName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="If yes, who?"
                    fullWidth
                    sx={{
                      maxWidth: { xs: "100%", sm: 400 },
                      "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                    }}
                    error={!!errors.applicantName}
                    helperText={errors.applicantName?.message}
                  />
                )}
              />
            )}
          </Stack>
        </Grid>

        {/* Dependent */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1 }}>Dependents</Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Controller
              name="inUsaDependent"
              control={control}
              defaultValue="no"
              render={({ field }) => (
                <FormControl error={!!errors.inUsaDependent}>
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
                  {errors.inUsaDependent && (
                    <FormHelperText>
                      {errors.inUsaDependent?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {inUsaDependent === "yes" && (
              <Controller
                name="dependentName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="If yes, who?"
                    fullWidth
                    sx={{
                      maxWidth: { xs: "100%", sm: 400 },
                      "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                    }}
                    error={!!errors.dependentName}
                    helperText={errors.dependentName?.message}
                  />
                )}
              />
            )}
          </Stack>
        </Grid>

        {/* I-94 Number */}
        {(inUsaApplicant === "yes" || inUsaDependent === "yes") && (
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ mb: 1 }}>
              If you are currently in the US, please provide your most recent
              I-94 number
            </Typography>
            <Controller
              name="i94Number"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Enter I-94 Number"
                  sx={{
                    "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                  }}
                  error={!!errors.i94Number}
                  helperText={errors.i94Number?.message}
                />
              )}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
