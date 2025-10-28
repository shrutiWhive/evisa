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
  Button,
  IconButton,
  MenuItem,
} from "@mui/material";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import { z } from "zod";
import Grid from "@mui/material/Grid2";
import { Icon } from "@iconify/react";

// ------------------ Validation Schema ------------------
export const criminalRecordSchema = z
  .object({
    criminal_record_employee: z.enum(["Yes", "No"]),
    criminal_record_dependents: z.enum(["Yes", "No"]),
    criminal_records: z
      .array(
        z.object({
          related_to: z.enum(["employee", "dependent", "both"], {
            required_error: "Please select who this record is related to",
          }),
          name: z.string().min(1, "Name is required"),
          type_of_record: z.string().min(1, "Type of record is required"),
          date: z.string().min(1, "Date is required"),
          outcome: z.string().min(1, "Outcome is required"),
        })
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    const hasEmployee = data.criminal_record_employee === "Yes";
    const hasDependent = data.criminal_record_dependents === "Yes";

    // If either employee or dependent has criminal record, require at least one entry
    if (hasEmployee || hasDependent) {
      if (!data.criminal_records || data.criminal_records.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please add at least one criminal record",
          path: ["criminal_records"],
        });
      }
    }
  });

// ------------------ Component ------------------
export const CriminalRecord = () => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const employeeAnswer = watch("criminal_record_employee");
  const dependentAnswer = watch("criminal_record_dependents");

  const {
    fields: criminalRecords,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "criminal_records",
  });

  const showForm = employeeAnswer === "Yes" || dependentAnswer === "Yes";

  // Get available options based on selections
  const getRelatedToOptions = () => {
    const hasEmployee = employeeAnswer === "Yes";
    const hasDependent = dependentAnswer === "Yes";

    if (hasEmployee && hasDependent) {
      return [
        { value: "employee", label: "Applicant" },
        { value: "dependent", label: "Dependent" },
        { value: "both", label: "Both" },
      ];
    } else if (hasEmployee) {
      return [
        { value: "employee", label: "Applicant" },
        { value: "dependent", label: "Dependent" },
        { value: "both", label: "Both" },
      ];
    } else if (hasDependent) {
      return [
        { value: "employee", label: "Applicant" },
        { value: "dependent", label: "Dependent" },
        { value: "both", label: "Both" },
      ];
    }
    return [];
  };

  return (
    <Box id="section-criminal-record" sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Do you have any Criminal record?
      </Typography>

      <Grid container spacing={4}>
        {/* Applicant Section */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 2, fontWeight: 500 }}>Applicant</Typography>

          <Controller
            name="criminal_record_employee"
            control={control}
            defaultValue="No"
            render={({ field }) => (
              <FormControl>
                <RadioGroup row {...field}>
                  <FormControlLabel
                    value="Yes"
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
                    value="No"
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
              </FormControl>
            )}
          />
        </Grid>
        {/* Dependent Section */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 2, fontWeight: 500 }}>
            Dependent (14 years or above){" "}
          </Typography>

          <Controller
            name="criminal_record_dependents"
            control={control}
            defaultValue="No"
            render={({ field }) => (
              <FormControl>
                <RadioGroup row {...field}>
                  <FormControlLabel
                    value="Yes"
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
                    value="No"
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
              </FormControl>
            )}
          />
        </Grid>
        {/* Criminal Records Form */}
        {/* // inside your component CriminalRecord (replace the relevant part) */}
        {/* Criminal Records Form */}
        {showForm && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                If any record Criminal record please fill up the form
              </Typography>

              {/* ✅ Ensure at least one default record when Yes is pressed */}
              {criminalRecords.length === 0 &&
                append({
                  related_to: "",
                  name: "",
                  type_of_record: "",
                  date: "",
                  outcome: "",
                })}

              {criminalRecords.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    mb: 3,
                    p: 3,
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Typography variant="subtitle1" fontWeight={600} color="primary">
                      {index === 0 ? "Criminal Record" : `Record ${index + 1}`}
                    </Typography>
                    {criminalRecords.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() => remove(index)}
                        size="small"
                      >
                        <Icon icon="mdi:delete" width={20} />
                      </IconButton>
                    )}
                  </Stack>

                  {/* ✅ Fields shown immediately */}
                  <Grid container spacing={2}>
                    {/* Related To */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name={`criminal_records.${index}.related_to`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Related To"
                            fullWidth
                            required
                            error={
                              !!errors.criminal_records?.[index]?.related_to
                            }
                            helperText={
                              errors.criminal_records?.[index]?.related_to
                                ?.message
                            }
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#fff",
                              },
                            }}
                          >
                            {getRelatedToOptions().map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </Grid>

                    {/* Name */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name={`criminal_records.${index}.name`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Name"
                            fullWidth
                            required
                            error={!!errors.criminal_records?.[index]?.name}
                            helperText={
                              errors.criminal_records?.[index]?.name?.message
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

                    {/* Type of Record */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name={`criminal_records.${index}.type_of_record`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Type of Record"
                            fullWidth
                            required
                            error={
                              !!errors.criminal_records?.[index]?.type_of_record
                            }
                            helperText={
                              errors.criminal_records?.[index]?.type_of_record
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

                    {/* Date */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name={`criminal_records.${index}.date`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Date"
                            type="date"
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.criminal_records?.[index]?.date}
                            helperText={
                              errors.criminal_records?.[index]?.date?.message
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

                    {/* Outcome */}
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name={`criminal_records.${index}.outcome`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Outcome"
                            fullWidth
                            required
                            multiline
                            rows={2}
                            error={!!errors.criminal_records?.[index]?.outcome}
                            helperText={
                              errors.criminal_records?.[index]?.outcome?.message
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
                  </Grid>
                </Box>
              ))}

              {/* ✅ Add button shown just below the fields */}
              <Button
                variant="outlined"
                startIcon={<Icon icon="mdi:plus" />}
                onClick={() =>
                  append({
                    related_to: "",
                    name: "",
                    type_of_record: "",
                    date: "",
                    outcome: "",
                  })
                }
                sx={{ mt: 1 }}
              >
                Add Another Record
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
