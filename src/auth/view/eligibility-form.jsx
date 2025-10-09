import { z as zod } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useBoolean } from "minimal-shared/hooks";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Link,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
  Typography,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import { signUp, useGetCountryCode } from "src/api";

import { useAppDispatch } from "src/redux/hooks";
import { setOrganization } from "src/redux/actions";

import { toast } from "src/components/snackbar";
import { Iconify } from "src/components/iconify";
import { Form, Field } from "src/components/hook-form";

import { getErrorMessage } from "../utils";
import { FormHead } from "../components/form-head";
import { SignUpTerms } from "../components/sign-up-terms";
import { authRoutes } from "src/routes/sections/auth";

// ----------------------------------------------------------------------

export const SignUpSchema = zod.object({
  first_name: zod.string().min(1, { message: "First name is required!" }),
  last_name: zod.string().min(1, { message: "First name is required!" }),
  email: zod
    .string()
    .min(1, { message: "User email is required!" })
    .email({ message: "Email must be a valid email address!" }),
  country_code: zod.number().min(1),
  phone: zod
    .string()
    .min(1, { message: "Contact number is required!" })
    .regex(/^\d{10}$/, {
      message: "Contact number must be exactly 10 digits!",
    }),

  password: zod
    .string()
    .min(1, { message: "Password is required!" })
    .min(6, { message: "Password must be at least 6 characters!" }),

  password_confirmation: zod
    .string()
    .min(1, { message: "Confirm password is required!" })
    .min(6, { message: "Confirm Password must be at least 6 characters!" }),
});

// ----------------------------------------------------------------------

export function EligibilityFormView() {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { country } = useGetCountryCode();

  const showPassword = useBoolean();

  const showConfirmPassword = useBoolean();

  const [errorMessage, setErrorMessage] = useState("");

  const defaultValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country_code: "",
    password: "",
    password_confirmation: "",
  };

  const methods = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,

    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMessage("");

      if (data.password !== data.password_confirmation) {
        setErrorMessage("Passwords didnt match!");

        return;
      }
      // const response = await signUp(data);

      // dispatch(setOrganization(response.data));

      reset();
      // toast.success(
      //   response.message || "Registration successful! Welcome aboard."
      // );

      router.push("/auth/register-step-form");
    } catch (error) {
      const errorMessages = Object.values(error.message).flat();
      toast.error(errorMessages[0]);
      // toast.error(
      //   error.message || "Oops! Something went wrong. Please try again"
      // );
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          alignSelf: "flex-start",
          px: 2,
          py: 0.5,
          borderRadius: 2,
          bgcolor: "primary.lighter",
          color: "primary.main",
          fontWeight: "bold",
          fontSize: "0.875rem",
          display: "inline-block",
        }}
      >
        Personal Information
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: { xs: 3, sm: 2 },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Field.Text
          name="date_of_birth"
          label="Date of Birth"
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Field.Text
          name="gender"
          label="Gender"
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>

      <Field.Text
        name="birth_country"
        label="Birth Country"
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Box
        sx={{
          alignSelf: "flex-start",
          px: 2,
          py: 0.5,
          borderRadius: 2,
          bgcolor: "primary.lighter",
          color: "primary.main",
          fontWeight: "bold",
          fontSize: "0.875rem",
          display: "inline-block",
        }}
      >
        Current Address Details
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: { xs: 3, sm: 2 },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        {/* <Field.Text
          name="country_code"
          label="Country"
          slotProps={{ inputLabel: { shrink: true } }}
        /> */}

        <Field.Select
          name="country_code"
          label="Country Code"
          // disabled={Boolean(currentCampaign)}
        >
          {country.map((option) => (
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Field.Select>

        <Field.Text
          name="phone"
          label="Phone Number"
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: { xs: 3, sm: 2 },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Field.Text
          name="password"
          label="Password"
          type={showPassword.value ? "text" : "password"}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={
                        showPassword.value
                          ? "solar:eye-bold"
                          : "solar:eye-closed-bold"
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Field.Text
          name="password_confirmation"
          label="Confirm Password"
          type={showConfirmPassword.value ? "text" : "password"}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showConfirmPassword.onToggle} edge="end">
                    <Iconify
                      icon={
                        showConfirmPassword.value
                          ? "solar:eye-bold"
                          : "solar:eye-closed-bold"
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Box sx={{ textAlign: "center" }}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              // {...register("terms")}
              checked={methods.watch("terms")}
            />
          }
          label={
            <Box component="span">
              I agree to all{" "}
              <Link
                underline="always"
                color="text.primary"
                href="/terms-of-service"
                target="_blank"
                rel="noopener"
              >
                Terms and Conditions
              </Link>
              .
            </Box>
          }
        />
        {errors.terms && (
          <FormHelperText error sx={{ textAlign: "center" }}>
            {errors.terms.message}
          </FormHelperText>
        )}
      </Box>
      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Create account..."
      >
        Create account
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Get started"
        description={
          <>
            {`Already have an account? `}
            <Link
              component={RouterLink}
              href={paths.auth.signIn}
              variant="subtitle2"
            >
              Get started
            </Link>
          </>
        }
        sx={{ textAlign: { xs: "center", md: "left" } }}
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>
    </>
  );
}
