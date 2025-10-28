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
export const visaSchema = z
  .object({
    recentRecord: z.string().optional().default("no"),
    visaName: z.string().optional(),
    visaType: z.string().optional(),
    visaExpeditionDate: z.string().optional(),
    visaExpirationDate: z.string().optional(),
    record2: z.string().optional().default("no"),
    visa2Name: z.string().optional(),
    visa2Type: z.string().optional(),
    visa2ExpeditionDate: z.string().optional(),
    visa2ExpirationDate: z.string().optional(),
    record3: z.string().optional().default("no"),
    visa3Name: z.string().optional(),
    visa3Type: z.string().optional(),
    visa3ExpeditionDate: z.string().optional(),
    visa3ExpirationDate: z.string().optional(),
    record4: z.string().optional().default("no"),
    visa4Name: z.string().optional(),
    visa4Type: z.string().optional(),
    visa4ExpeditionDate: z.string().optional(),
    visa4ExpirationDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Only validate fields if "yes" is selected

    // Visa Record 1 validation
    if (data.recentRecord === "yes") {
      if (!data.visaName || data.visaName.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter name",
          path: ["visaName"],
        });
      }
      if (!data.visaType || data.visaType.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select visa type",
          path: ["visaType"],
        });
      }
      if (!data.visaExpeditionDate || data.visaExpeditionDate.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter expedition date",
          path: ["visaExpeditionDate"],
        });
      }
      if (!data.visaExpirationDate || data.visaExpirationDate.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter expiration date",
          path: ["visaExpirationDate"],
        });
      }
    }

    // Visa Record 2 validation
    if (data.record2 === "yes") {
      if (!data.visa2Name || data.visa2Name.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter name",
          path: ["visa2Name"],
        });
      }
      if (!data.visa2Type || data.visa2Type.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select visa type",
          path: ["visa2Type"],
        });
      }
      if (!data.visa2ExpeditionDate || data.visa2ExpeditionDate.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter expedition date",
          path: ["visa2ExpeditionDate"],
        });
      }
      if (!data.visa2ExpirationDate || data.visa2ExpirationDate.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter expiration date",
          path: ["visa2ExpirationDate"],
        });
      }
    }

    // Visa Record 3 validation
    if (data.record3 === "yes") {
      if (!data.visa3Name || data.visa3Name.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter name",
          path: ["visa3Name"],
        });
      }
      if (!data.visa3Type || data.visa3Type.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select visa type",
          path: ["visa3Type"],
        });
      }
      if (!data.visa3ExpeditionDate || data.visa3ExpeditionDate.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter expedition date",
          path: ["visa3ExpeditionDate"],
        });
      }
      if (!data.visa3ExpirationDate || data.visa3ExpirationDate.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter expiration date",
          path: ["visa3ExpirationDate"],
        });
      }
    }

    // Visa Record 4 validation
    if (data.record4 === "yes") {
      if (!data.visa4Name || data.visa4Name.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter name",
          path: ["visa4Name"],
        });
      }
      if (!data.visa4Type || data.visa4Type.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select visa type",
          path: ["visa4Type"],
        });
      }
      if (!data.visa4ExpeditionDate || data.visa4ExpeditionDate.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter expedition date",
          path: ["visa4ExpeditionDate"],
        });
      }
      if (!data.visa4ExpirationDate || data.visa4ExpirationDate.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter expiration date",
          path: ["visa4ExpirationDate"],
        });
      }
    }
  });

// ------------------ Component ------------------
export const Visa = () => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const recentRecord = watch("recentRecord");
  const record2 = watch("record2");
  const record3 = watch("record3");
  const record4 = watch("record4");

  const visaTypes = ["B1/B2", "F1", "H1B", "L1", "J1", "O1", "Other"];

  const VisaFields = ({ recordName, prefix }) => (
    <Grid container spacing={3} sx={{ mt: 1, mb: 2 }}>
      {/* Name */}
      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <Typography sx={{ mb: 1 }}>Name </Typography>
        <Controller
          name={`${prefix}Name`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="Enter name"
              error={!!errors[`${prefix}Name`]}
              helperText={errors[`${prefix}Name`]?.message}
              sx={{
                "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
              }}
            />
          )}
        />
      </Grid>

      {/* Type of Visa */}
      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <Typography sx={{ mb: 1 }}>Type of Visa </Typography>
        <Controller
          name={`${prefix}Type`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth error={!!errors[`${prefix}Type`]}>
              <TextField
                {...field}
                select
                fullWidth
                displayEmpty
                error={!!errors[`${prefix}Type`]}
                sx={{
                  "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                }}
              >
                <MenuItem value="">
                  <em>Select Visa Type</em>
                </MenuItem>
                {visaTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
              {errors[`${prefix}Type`] && (
                <FormHelperText>
                  {errors[`${prefix}Type`]?.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      </Grid>

      {/* Expedition Date */}
      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <Typography sx={{ mb: 1 }}>Expedition Date </Typography>
        <Controller
          name={`${prefix}ExpeditionDate`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors[`${prefix}ExpeditionDate`]}
              helperText={errors[`${prefix}ExpeditionDate`]?.message}
              sx={{
                "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
              }}
            />
          )}
        />
      </Grid>

      {/* Expiration Date */}
      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <Typography sx={{ mb: 1 }}>Expiration Date </Typography>
        <Controller
          name={`${prefix}ExpirationDate`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors[`${prefix}ExpirationDate`]}
              helperText={errors[`${prefix}ExpirationDate`]?.message}
              sx={{
                "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  );

  return (
    <Box id="section-12" sx={{ mb: 6 }}>
      <Grid container spacing={3}>
        {/* Recent Record */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Fill the fields if you or your Dependent hold any US Visa
          </Typography>
          <Typography sx={{ mb: 1 }}>Recent Record</Typography>
          <Controller
            name="recentRecord"
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
          {recentRecord === "yes" && (
            <VisaFields recordName="Recent Record" prefix="visa" />
          )}
        </Grid>

        {/* Record 2 */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1 }}>Record 2</Typography>
          <Controller
            name="record2"
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
          {record2 === "yes" && (
            <VisaFields recordName="Record 2" prefix="visa2" />
          )}
        </Grid>

        {/* Record 3 */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1 }}>Record 3</Typography>
          <Controller
            name="record3"
            control={control}
            defaultValue="no"
            render={({ field }) => (
              <FormControl error={!!errors.record3}>
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
                {errors.record3 && (
                  <FormHelperText>{errors.record3?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
          {record3 === "yes" && (
            <VisaFields recordName="Record 3" prefix="visa3" />
          )}
        </Grid>

        {/* Record 4 */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1 }}>Record 4</Typography>
          <Controller
            name="record4"
            control={control}
            defaultValue="no"
            render={({ field }) => (
              <FormControl error={!!errors.record4}>
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
                {errors.record4 && (
                  <FormHelperText>{errors.record4?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
          {record4 === "yes" && (
            <VisaFields recordName="Record 4" prefix="visa4" />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
