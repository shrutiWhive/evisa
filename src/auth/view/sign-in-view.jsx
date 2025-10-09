import { z as zod } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useBoolean } from "minimal-shared/hooks";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoadingButton } from "@mui/lab";
import { Box, Link, Alert, IconButton, InputAdornment } from "@mui/material";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import { useAppDispatch } from "src/redux/hooks";
import { setOrganization } from "src/redux/actions";

import { Iconify } from "src/components/iconify";
import { Form, Field } from "src/components/hook-form";

import { signIn } from "src/api";

import { getErrorMessage } from "../utils";
import { toast } from "src/components/snackbar";
import { FormHead } from "../components/form-head";

// ----------------------------------------------------------------------

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Email must be a valid email address!" }),
  password: zod
    .string()
    .min(1, { message: "Password is required!" })
    .min(6, { message: "Password must be at least 6 characters!" }),
});

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const showPassword = useBoolean();

  const [errorMessage, setErrorMessage] = useState("");

  const defaultValues = {
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMessage("");

      const response = await signIn(data);

      // dispatch(setOrganization(response.data));

      reset();
      toast.success(response.message || "Login successful!");

      router.push(paths.dashboard.root);
    } catch (error) {
      console.error(error);
      if (error?.message?.email) {
        setErrorMessage(error?.message?.email[0]);
      } else {
        toast.error(
          error.message || "Oops! Something went wrong. Please try again."
        );
      }
      // const feedbackMessage = getErrorMessage(error);

      // setErrorMessage(feedbackMessage);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
      <Field.Text
        name="email"
        label="Email address"
        slotProps={{ inputLabel: { shrink: true } }}
      />

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

      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sign in..."
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Sign in to your account"
        description={
          <>
            {`Don’t have an account? `}
            <Link
              component={RouterLink}
              href={paths.auth.signUp}
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
