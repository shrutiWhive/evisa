import React from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

/* ---------------------- ✅ ZOD SCHEMA ---------------------- */
export const inadmissibilitySchema = z
  .object({
    inadmissibility_1: z.string().min(1, "Required"),
    inadmissibility_2: z.string().min(1, "Required"),
    inadmissibility_3: z.string().min(1, "Required"),
    inadmissibility_4: z.string().min(1, "Required"),
    inadmissibility_1_name: z.string().optional(),
    inadmissibility_1_condition: z.string().optional(),
    inadmissibility_1_doctor: z.string().optional(),
    inadmissibility_1_procedure: z.string().optional(),
    inadmissibility_1_date: z.string().optional(),
    inadmissibility_2_name: z.string().optional(),
    inadmissibility_2_condition: z.string().optional(),
    inadmissibility_2_doctor: z.string().optional(),
    inadmissibility_2_procedure: z.string().optional(),
    inadmissibility_2_date: z.string().optional(),
    inadmissibility_3_name: z.string().optional(),
    inadmissibility_3_condition: z.string().optional(),
    inadmissibility_3_doctor: z.string().optional(),
    inadmissibility_3_procedure: z.string().optional(),
    inadmissibility_3_date: z.string().optional(),
    inadmissibility_4_name: z.string().optional(),
    inadmissibility_4_condition: z.string().optional(),
    inadmissibility_4_doctor: z.string().optional(),
    inadmissibility_4_procedure: z.string().optional(),
    inadmissibility_4_date: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    [1, 2, 3, 4].forEach((num) => {
      const sel = data[`inadmissibility_${num}`];
      if (!sel) {
        ctx.addIssue({
          path: [`inadmissibility_${num}`],
          message: `Inadmissibility ${num} is required`,
          code: z.ZodIssueCode.custom,
        });
      } else if (sel === "yes") {
        ["name", "condition", "doctor", "procedure", "date"].forEach(
          (field) => {
            if (!data[`inadmissibility_${num}_${field}`]) {
              ctx.addIssue({
                path: [`inadmissibility_${num}_${field}`],
                message: `${field} is required for Inadmissibility ${num}`,
                code: z.ZodIssueCode.custom,
              });
            }
          }
        );
      }
    });
  });

/* ---------------------- ✅ MAIN COMPONENT ---------------------- */
export const Inadmissibility = () => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const inadmissibilityQuestions = [
    "Inadmissibility 1",
    "Inadmissibility 2",
    "Inadmissibility 3",
    "Inadmissibility 4",
  ];

  const watched = useWatch({
    control,
    name: inadmissibilityQuestions.map((_, i) => `inadmissibility_${i + 1}`),
  });

  return (
    <Box id="section-11" sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: "#fff" }}>
        Inadmissibility
      </Typography>

      {inadmissibilityQuestions.map((q, index) => {
        const num = index + 1;
        const selected = watched?.[index];

        return (
          <Box
            key={index}
            sx={{
              mb: 4,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              pb: 2,
            }}
          >
            {/* Row 1: Question */}
            <Typography sx={{ color: "#fff", fontWeight: 500, mb: 1 }}>
              {q}
            </Typography>

            {/* Row 2: Yes/No */}
            <Controller
              name={`inadmissibility_${num}`}
              control={control}
              defaultValue="no"
              render={({ field }) => (
                <RadioGroup
                  row
                  {...field}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                    if (val === "no") {
                      [
                        "name",
                        "condition",
                        "doctor",
                        "procedure",
                        "date",
                      ].forEach((f) =>
                        setValue(`inadmissibility_${num}_${f}`, "")
                      );
                    }
                  }}
                  sx={{ mb: 2, gap: 2 }}
                >
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
              )}
            />
            {errors[`inadmissibility_${num}`] && (
              <Typography color="error" variant="body2">
                {errors[`inadmissibility_${num}`]?.message}
              </Typography>
            )}

            {/* Row 3: Conditional fields */}
            {selected === "yes" && (
              <Grid container spacing={2}>
                {[
                  { name: "name", label: "Name" },
                  { name: "condition", label: "Condition" },
                  { name: "doctor", label: "Doctor Name" },
                  { name: "procedure", label: "Procedure" },
                  { name: "date", label: "Date", type: "date" },
                ].map((field) => (
                  <Grid size={{ xs: 12, md: 6 }} key={field.name}>
                    <Controller
                      name={`inadmissibility_${num}_${field.name}`}
                      control={control}
                      defaultValue=""
                      render={({ field: f }) => (
                        <TextField
                          {...f}
                          type={field.type || "text"}
                          fullWidth
                          placeholder={field.label}
                          error={
                            !!errors[`inadmissibility_${num}_${field.name}`]
                          }
                          helperText={
                            errors[`inadmissibility_${num}_${field.name}`]
                              ?.message
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#fff",
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
