import { z as zod } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoadingButton } from "@mui/lab";
import { Dialog, Box, Button, Stack, Typography } from "@mui/material";

import { useAppDispatch } from "src/redux/hooks";
import { fetchAppointmentCategoriesRequest } from "src/redux/actions";

import { Form, Field } from "src/components/hook-form";

import { createAppointmentCategory, updateAppointmentCategory } from "src/api";

import { toast } from "src/components/snackbar";

// ----------------------------------------------------------------------

export const schema = zod.object({
  name: zod.string().min(1, { message: "Name is required!" }),

  description: zod.string().min(1, { message: "Description is required!" }),
});

// ----------------------------------------------------------------------

export function AppointmentCategoryNewEditForm({
  open,
  onClose,
  //
  selectedCategory,
  onClearSelectedCategory,
}) {
  const dispatch = useAppDispatch();

  const defaultValues = {
    name: "",
    description: "",
  };

  const values = {
    name: selectedCategory?.name || "",
    description: selectedCategory?.description || "",
  };

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    values: values,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleCloseAndReset = () => {
    onClose();

    reset();

    onClearSelectedCategory();
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = selectedCategory
        ? await updateAppointmentCategory(selectedCategory.id, data)
        : await createAppointmentCategory(data);

      handleCloseAndReset();
      const toastMessage = selectedCategory
        ? "Appointment category updated successfully"
        : "Appointment category created successfully";

      toast.success(response?.message || toastMessage);

      dispatch(fetchAppointmentCategoriesRequest());
    } catch (error) {
      console.error(error);

      toast.error("Oops! Something went wrong. Please try again.");
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
      <Field.Text name="name" label="Name" />

      <Field.Text name="description" label="Description" multiline rows={3} />
    </Box>
  );

  const renderActions = () => (
    <Box sx={{ gap: 2, display: "flex", justifyContent: "flex-end" }}>
      <Button variant="outlined" onClick={handleCloseAndReset}>
        Close
      </Button>

      <LoadingButton
        color="primary"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator={selectedCategory ? "Updating" : "Creating"}
      >
        {selectedCategory ? "Update" : "Create"}
      </LoadingButton>
    </Box>
  );

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Typography variant="h6">
            {selectedCategory
              ? "Update selected appointment category"
              : "Create a new appointment category"}
          </Typography>

          {renderForm()}

          {renderActions()}
        </Stack>
      </Form>
    </Dialog>
  );
}
