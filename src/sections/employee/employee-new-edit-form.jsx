import { z as zod } from "zod";
import { useBoolean } from "minimal-shared/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Box, Stack, InputAdornment, IconButton } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { toast } from "src/components/snackbar";
import { Iconify } from "src/components/iconify";
import { Form, Field } from "src/components/hook-form";

import { createEmployee, updateEmployee } from "src/api";
import { useState } from "react";

// ----------------------------------------------------------------------

function handleApiError(error) {
  const messages = error?.message;

  if (messages && typeof messages === "object") {
    const combinedMessage = Object.values(messages).flat().join("\n");

    toast.error(combinedMessage);
  } else {
    toast.error(error?.response?.data?.message || "Something went wrong!");
  }
}

const baseSchema = {
  name: zod.string().min(1, { message: "Name is required!" }),

  email: zod
    .string()
    .min(1, { message: "Organization email is required!" })
    .email({ message: "Email must be a valid email address!" }),

  contact_number: zod
    .string()
    .min(1, { message: "Contact number is required!" })
    .regex(/^\d{10}$/, {
      message: "Contact number must be exactly 10 digits!",
    }),
};

// const getSchema = (isEdit) =>
//   zod.object({
//     ...baseSchema,
//     ...(!isEdit && {
//       password: zod
//         .string()
//         .min(1, { message: "Password is required!" })
//         .min(6, { message: "Password must be at least 6 characters!" }),

//       password_confirmation: zod
//         .string()
//         .min(1, { message: "Confirm Password is required!" })
//         .min(6, {
//           message: "Confirm Password must be at least 6 characters!",
//         }),
//     }),
//   });

const getSchema = (isEdit) =>
  zod
    .object({
      ...baseSchema,
      ...(!isEdit && {
        password: zod
          .string()
          .min(1, { message: "Password is required!" })
          .min(6, { message: "Password must be at least 6 characters!" }),
        password_confirmation: zod
          .string()
          .min(1, { message: "Confirm Password is required!" })
          .min(6, {
            message: "Confirm Password must be at least 6 characters!",
          }),
      }),
    })
    .refine(
      (data) => {
        if (isEdit) return true; // no need to validate match if editing
        return data.password === data.password_confirmation;
      },
      {
        message: "Passwords do not match",
        path: ["password_confirmation"], // attach error to confirm field
      }
    );

// ----------------------------------------------------------------------

export function EmployeeNewEditForm({ currentEmployee }) {
  const { id, name, email, contact_number, password } = currentEmployee || {};

  const router = useRouter();

  const showPassword = useBoolean();
  const showConfirmPassword = useBoolean();
  const [errorMessage, setErrorMessage] = useState("");

  const defaultValues = {
    name: "",
    email: "",
    contact_number: "",
    ...(!currentEmployee && { password: "", password_confirmation: "" }),
  };

  const values = {
    name: name || "",
    email: email || "",
    contact_number: contact_number || "",
    ...(currentEmployee ? {} : { password: "", password_confirmation: "" }),
  };

  const schema = getSchema(!!currentEmployee);

  const methods = useForm({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues,
    values,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // setErrorMessage("");

      // if (data.password !== data.password_confirmation) {
      //   setErrorMessage("Passwords didnt match!");

      //   return;
      // }

      const response = currentEmployee
        ? await updateEmployee(id, data)
        : await createEmployee(data);

      reset();

      toast.success(
        response?.message ||
          `Employee ${currentEmployee ? "updated" : "added"} successfully!`
      );

      router.push(
        currentEmployee
          ? paths.dashboard.employee.detail(id)
          : paths.dashboard.employee.root
      );
    } catch (error) {
      handleApiError(error);
      // toast.error(
      //   error?.message ||
      //     `Couldn't ${
      //       currentEmployee ? "update" : "add"
      //     } employee. Please try again!`
      // );
    }
  });

  const renderFields = () => (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "flex",
          gap: { xs: 3, sm: 2 },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Field.Text name="name" label="Name" />

        <Field.Text name="contact_number" label="Contact Number" />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: { xs: 3, sm: 2 },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Field.Text name="email" label="Email Address" />

        {!currentEmployee && (
          <>
            <Field.Text
              name="password"
              label="Password"
              type={showPassword.value ? "text" : "password"}
              slotProps={{
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
                      <IconButton
                        onClick={showConfirmPassword.onToggle}
                        edge="end"
                      >
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
          </>
        )}
      </Box>
    </Stack>
  );

  const renderActions = () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{ ml: 2 }}
      >
        {currentEmployee ? "Update employee" : "Add employee"}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        {renderFields()}

        {renderActions()}
      </Stack>
    </Form>
  );
}
