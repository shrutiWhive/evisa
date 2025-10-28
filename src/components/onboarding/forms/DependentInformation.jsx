import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  MenuItem,
  Select,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";
import { useGetCountryCode } from "src/api";

/* ---------------------- ✅ CONSTANTS ---------------------- */
const dependents = [1, 2, 3, 4];
const kinshipOptions = ["Fiancee", "Daughter", "Son", "Spouse"];
const educationLevels = ["High School", "Bachelor", "Postgraduate", "Other"];
const genders = ["Male", "Female", "Other"];

/* ---------------------- ✅ ZOD SCHEMA ---------------------- */
export const dependentSchema = z.object({
  kinship: z.string().min(1, "Required"),
  first_name: z.string().min(1, "Required"),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, "Required"),
  dob: z.string().min(1, "Required"),
  gender: z.string().min(1, "Required"),
  birth_country: z.string().min(1, "Required"),
  citizenship_country: z.string().min(1, "Required"),
  education_level: z.string().min(1, "Required"),
});

export const dependentsSchema = z
  .object({
    dependent_1: z.string(),
    dependent_1_fields: dependentSchema.optional(),
    dependent_2: z.string(),
    dependent_2_fields: dependentSchema.optional(),
    dependent_3: z.string(),
    dependent_3_fields: dependentSchema.optional(),
    dependent_4: z.string(),
    dependent_4_fields: dependentSchema.optional(),
  })
  .superRefine((data, ctx) => {
    [1, 2, 3, 4].forEach((num) => {
      const dep = data[`dependent_${num}`];
      const fields = data[`dependent_${num}_fields`];
      if (dep === "yes" && !fields) {
        ctx.addIssue({
          path: [`dependent_${num}_fields`],
          message: `Dependent #${num} fields are required`,
          code: z.ZodIssueCode.custom,
        });
      }
    });
  });

/* ---------------------- ✅ MAIN COMPONENT ---------------------- */
export const DependentInformation = () => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { country } = useGetCountryCode();

  const watchedDependents = useWatch({
    control,
    name: dependents.map((num) => `dependent_${num}`),
  });

  /* ---------------------- FIELDS RENDERER ---------------------- */
  const renderDependentFields = (num) => (
    <Grid container spacing={3} sx={{ mt: 2, pl: 2 }}>
      {[
        { name: "first_name", label: "First Name" },
        { name: "middle_name", label: "Middle Name" },
        { name: "last_name", label: "Last Name" },
      ].map((field) => (
        <Grid key={field.name} size={{ xs: 12, md: 4 }}>
          <Typography>{field.label}</Typography>
          <Controller
            name={`dependent_${num}_fields.${field.name}`}
            control={control}
            defaultValue=""
            render={({ field: f }) => (
              <>
                <TextField
                  {...f}
                  fullWidth
                  placeholder={field.label}
                  error={!!errors[`dependent_${num}_fields`]?.[field.name]}
                  sx={{
                    "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                  }}
                />
                {errors[`dependent_${num}_fields`]?.[field.name] && (
                  <FormHelperText error>
                    {errors[`dependent_${num}_fields`]?.[field.name]?.message}
                  </FormHelperText>
                )}
              </>
            )}
          />
        </Grid>
      ))}

      {/* DOB */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Typography>Date of Birth</Typography>
        <Controller
          name={`dependent_${num}_fields.dob`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              fullWidth
              error={!!errors[`dependent_${num}_fields`]?.dob}
              sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
            />
          )}
        />
      </Grid>

      {/* Gender */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Typography>Gender</Typography>
        <Controller
          name={`dependent_${num}_fields.gender`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <RadioGroup row {...field}>
              {genders.map((g) => (
                <FormControlLabel
                  key={g}
                  value={g.toLowerCase()}
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
                  label={g}
                />
              ))}
            </RadioGroup>
          )}
        />
      </Grid>

      {/* Country of Birth */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Typography>Country of Birth</Typography>
        <Controller
          name={`dependent_${num}_fields.birth_country`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth>
              <Select {...field} displayEmpty sx={{ backgroundColor: "#fff" }}>
                <MenuItem value="">
                  <em>Select Country</em>
                </MenuItem>
                {country?.map((option) => (
                  <MenuItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      {/* Citizenship */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography>Country of Citizenship</Typography>
        <Controller
          name={`dependent_${num}_fields.citizenship_country`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth>
              <Select {...field} displayEmpty sx={{ backgroundColor: "#fff" }}>
                <MenuItem value="">
                  <em>Select Country</em>
                </MenuItem>
                {country?.map((option) => (
                  <MenuItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      {/* Education */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography>Highest Level of Education</Typography>
        <Controller
          name={`dependent_${num}_fields.education_level`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth>
              <Select {...field} displayEmpty sx={{ backgroundColor: "#fff" }}>
                <MenuItem value="">
                  <em>Select education level</em>
                </MenuItem>
                {educationLevels.map((option) => (
                  <MenuItem key={option} value={option.toLowerCase()}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      {/* Kinship */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography>Degree of Kinship</Typography>
        <Controller
          name={`dependent_${num}_fields.kinship`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth>
              <Select {...field} displayEmpty sx={{ backgroundColor: "#fff" }}>
                <MenuItem value="">
                  <em>Select Kinship</em>
                </MenuItem>
                {kinshipOptions.map((option) => (
                  <MenuItem key={option} value={option.toLowerCase()}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>
    </Grid>
  );

  /* ---------------------- ✅ MAIN RENDER ---------------------- */
  return (
    <Box id="section-7" sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Dependent Information
      </Typography>

      <Grid container spacing={4}>
        {dependents.map((num, index) => (
          <Grid size={{ xs: 12 }} key={num}>
            <Box>
              <Typography sx={{ mb: 1, fontSize: 14, color: "#64748b" }}>
                Dependent {num}
              </Typography>
              <Controller
                name={`dependent_${num}`}
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
                        setValue(`dependent_${num}_fields`, {}); // clear data
                      }
                    }}
                    sx={{ gap: 2 }}
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
              {watchedDependents?.[index] === "yes" &&
                renderDependentFields(num)}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
