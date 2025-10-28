import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  TextField,
  Checkbox,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { z } from "zod";

const workFields = [
  { name: "recent_job", label: "Recent Job" },
  { name: "job2", label: "Job 2" },
  { name: "job3", label: "Job 3" },
  { name: "job4", label: "Job 4" },
];

// ✅ Complete schema with all fields defined explicitly
export const pastWorkExperiencesSchema = z
  .object({
    // Yes/No selections for each job
    recent_job: z.enum(["yes", "no"], {
      errorMap: () => ({ message: "Please select an option" }),
    }),
    job2: z.enum(["yes", "no"], {
      errorMap: () => ({ message: "Please select an option" }),
    }),
    job3: z.enum(["yes", "no"], {
      errorMap: () => ({ message: "Please select an option" }),
    }),
    job4: z.enum(["yes", "no"], {
      errorMap: () => ({ message: "Please select an option" }),
    }),

    // All fields optional by default
    recent_job_company_name: z.string().optional(),
    recent_job_job_title: z.string().optional(),
    recent_job_start_date: z.string().optional(),
    recent_job_end_date: z.string().optional(),
    recent_job_currently_employed: z.boolean().optional(),
    recent_job_job_description: z.string().optional(),

    job2_company_name: z.string().optional(),
    job2_job_title: z.string().optional(),
    job2_start_date: z.string().optional(),
    job2_end_date: z.string().optional(),
    job2_currently_employed: z.boolean().optional(),
    job2_job_description: z.string().optional(),

    job3_company_name: z.string().optional(),
    job3_job_title: z.string().optional(),
    job3_start_date: z.string().optional(),
    job3_end_date: z.string().optional(),
    job3_currently_employed: z.boolean().optional(),
    job3_job_description: z.string().optional(),

    job4_company_name: z.string().optional(),
    job4_job_title: z.string().optional(),
    job4_start_date: z.string().optional(),
    job4_end_date: z.string().optional(),
    job4_currently_employed: z.boolean().optional(),
    job4_job_description: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const jobs = ["recent_job", "job2", "job3", "job4"];

    jobs.forEach((jobName) => {
      if (data[jobName] === "yes") {
        // Company name required
        if (
          !data[`${jobName}_company_name`] ||
          data[`${jobName}_company_name`].trim() === ""
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Company name is required",
            path: [`${jobName}_company_name`],
          });
        }

        // Job title validation
        // Job title required
        if (
          !data[`${jobName}_job_title`] ||
          data[`${jobName}_job_title`].trim() === ""
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Job title is required",
            path: [`${jobName}_job_title`],
          });
        }

        // Start date required
        if (
          !data[`${jobName}_start_date`] ||
          data[`${jobName}_start_date`].trim() === ""
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Start date is required",
            path: [`${jobName}_start_date`],
          });
        }

        // End date required if not currently employed
        if (!data[`${jobName}_currently_employed`]) {
          if (
            !data[`${jobName}_end_date`] ||
            data[`${jobName}_end_date`].trim() === ""
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "End date is required if not currently employed",
              path: [`${jobName}_end_date`],
            });
          } else if (data[`${jobName}_start_date`]) {
            const startDate = new Date(data[`${jobName}_start_date`]);
            const endDate = new Date(data[`${jobName}_end_date`]);
            if (endDate < startDate) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "End date must be after start date",
                path: [`${jobName}_end_date`],
              });
            }
          }
        }

        // Job description required
        if (
          !data[`${jobName}_job_description`] ||
          data[`${jobName}_job_description`].trim() === ""
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Job description is required",
            path: [`${jobName}_job_description`],
          });
        }
      }
    });
  });

export const PastWorkExperiences = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // Watch all work experience responses
  const watchedJobs = useWatch({
    control,
    name: workFields.map((field) => field.name),
  });

  // Watch "Currently Employed" status for each job
  const currentlyEmployed = useWatch({
    control,
    name: workFields.map((field) => `${field.name}_currently_employed`),
  });

  // Render fields for each job
  const renderJobFields = (jobName, index) => (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      {/* Row 1: Company Name and Job Title */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={{ mb: 1 }}>Company Name</Typography>
        <Controller
          name={`${jobName}_company_name`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="Enter company name"
              error={!!errors[`${jobName}_company_name`]}
              helperText={errors[`${jobName}_company_name`]?.message}
              sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={{ mb: 1 }}>Job Title</Typography>
        <Controller
          name={`${jobName}_job_title`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="Enter job title"
              error={!!errors[`${jobName}_job_title`]}
              helperText={errors[`${jobName}_job_title`]?.message}
              sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
            />
          )}
        />
      </Grid>

      {/* Row 2: Start Date and End Date */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={{ mb: 1 }}>Start Date</Typography>
        <Controller
          name={`${jobName}_start_date`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              fullWidth
              error={!!errors[`${jobName}_start_date`]}
              helperText={errors[`${jobName}_start_date`]?.message}
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={{ mb: 1 }}>
          End Date
          {/* {" "}
          {!currentlyEmployed[index] && (
            <span style={{ color: "#f44336" }}>*</span>
          )} */}
        </Typography>
        <Controller
          name={`${jobName}_end_date`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              fullWidth
              disabled={currentlyEmployed[index]}
              error={!!errors[`${jobName}_end_date`]}
              helperText={errors[`${jobName}_end_date`]?.message}
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
            />
          )}
        />
      </Grid>

      {/* Currently Employed Checkbox */}
      <Grid size={{ xs: 12 }}>
        <Controller
          name={`${jobName}_currently_employed`}
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  sx={{
                    color: "secondary.main",
                    "&.Mui-checked": {
                      color: "secondary.main",
                    },
                  }}
                />
              }
              label="Currently Employed"
            />
          )}
        />
      </Grid>

      {/* Row 3: City, State, Zip Code */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography sx={{ mb: 1 }}>City</Typography>
        <Controller
          name={`${jobName}_city`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="Enter city"
              error={!!errors[`${jobName}_city`]}
              helperText={errors[`${jobName}_city`]?.message}
              sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography sx={{ mb: 1 }}>State</Typography>
        <Controller
          name={`${jobName}_state`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="Enter state"
              error={!!errors[`${jobName}_state`]}
              helperText={errors[`${jobName}_state`]?.message}
              sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography sx={{ mb: 1 }}>Zip Code</Typography>
        <Controller
          name={`${jobName}_zip_code`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="Enter zip code"
              error={!!errors[`${jobName}_zip_code`]}
              helperText={errors[`${jobName}_zip_code`]?.message}
              sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
            />
          )}
        />
      </Grid>

      {/* Row 4: Supervisor Name and Job Duty */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={{ mb: 1 }}>Supervisor Name</Typography>
        <Controller
          name={`${jobName}_supervisor_name`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="Enter supervisor name"
              error={!!errors[`${jobName}_supervisor_name`]}
              helperText={errors[`${jobName}_supervisor_name`]?.message}
              sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={{ mb: 1 }}>Job Duty</Typography>
        <Controller
          name={`${jobName}_job_duty`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="Enter job duty"
              error={!!errors[`${jobName}_job_duty`]}
              helperText={errors[`${jobName}_job_duty`]?.message}
              sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
            />
          )}
        />
      </Grid>

      {/* Row 5: Job Description */}
      <Grid size={{ xs: 12 }}>
        <Typography sx={{ mb: 1 }}>Job Description</Typography>
        <Controller
          name={`${jobName}_job_description`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={4}
              placeholder="Describe your responsibilities and achievements (minimum 50 characters)"
              error={!!errors[`${jobName}_job_description`]}
              helperText={errors[`${jobName}_job_description`]?.message}
              sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
            />
          )}
        />
      </Grid>
    </Grid>
  );

  return (
    <Box id="section-6" sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Past Work Experiences
      </Typography>

      <Grid container spacing={4}>
        {workFields.map((field, index) => (
          <Grid size={{ xs: 12 }} key={field.name}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid rgba(255, 255, 255, 0.63)",
              }}
            >
              <Typography sx={{ mb: 1 }}>{field.label}</Typography>
              <Controller
                name={field.name}
                control={control}
                defaultValue="no"
                render={({ field: radioField }) => (
                  <FormControl error={!!errors[field.name]}>
                    <RadioGroup row {...radioField} sx={{ gap: 2 }}>
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
                    {errors[field.name] && (
                      <FormHelperText>
                        {errors[field.name]?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              {/* Conditionally render job fields when "yes" is selected */}
              {watchedJobs[index] === "yes" &&
                renderJobFields(field.name, index)}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
