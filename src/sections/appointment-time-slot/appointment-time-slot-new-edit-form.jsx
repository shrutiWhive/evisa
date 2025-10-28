import { z as zod } from "zod";
import { useMemo } from "react";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { LoadingButton } from "@mui/lab";
import { Dialog, Box, Button, Stack, Typography } from "@mui/material";

import { useAppDispatch } from "src/redux/hooks";
import { fetchAppointmentTimeSlotsRequest } from "src/redux/actions";

import { Form, Field, schemaHelper } from "src/components/hook-form";

import { createAppointmentTimeSlot, updateAppointmentTimeSlot } from "src/api";

import { toast } from "src/components/snackbar";

import { formatPatterns } from "src/utils/format-time";
import { MobileDatePicker } from "@mui/x-date-pickers";

// ----------------------------------------------------------------------

export const schema = zod.object({
  start_time: schemaHelper.date({
    message: { required: "Start time is required!" },
  }),

  end_time: schemaHelper.date({
    message: { required: "End time is required!" },
  }),

  date: schemaHelper.date({
    message: { required: "Date is required!" },
  }),
});

// ----------------------------------------------------------------------

export function AppointmentTimeSlotNewEditForm({
  open,
  onClose,
  //
  selectedTimeSlot,
  onClearSelectedTimeSlot,
}) {
  const dispatch = useAppDispatch();

  const defaultValues = {
    start_time: "",
    end_time: "",
    date: "",
  };

  const values = useMemo(() => {
    if (!selectedTimeSlot) return undefined;

    return {
      start_time: dayjs(selectedTimeSlot.start_time, "HH:mm:ss"),
      end_time: dayjs(selectedTimeSlot.end_time, "HH:mm:ss"),
      date: dayjs(selectedTimeSlot.date),
    };
  }, [selectedTimeSlot]);

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    values: values,
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = methods;

  const handleCloseAndReset = () => {
    onClose();

    reset();

    onClearSelectedTimeSlot();
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const timeSlotData = {
        ...data,
        start_time: dayjs(data.start_time).format("HH:mm"),
        end_time: dayjs(data.end_time).format("HH:mm"),
      };

      // const response = selectedTimeSlot
      //   ? await updateAppointmentTimeSlot(selectedTimeSlot.id, timeSlotData)
      //   : await createAppointmentTimeSlot(timeSlotData);

      handleCloseAndReset();

      const toastMessage = selectedTimeSlot
        ? "Appointment time slot updated successfully"
        : "Appointment time slot created successfully";

      // toast.success(response?.message || toastMessage);

      dispatch(fetchAppointmentTimeSlotsRequest());
    } catch (error) {
      console.error(error);

      toast.error("Oops! Something went wrong. Please try again.");
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
      <Controller
        name="date"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <MobileDatePicker
            {...field}
            label="Date"
            value={field.value ? dayjs(field.value) : null}
            onChange={(newValue) => field.onChange(dayjs(newValue).format())}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error?.message,
              },
            }}
          />
        )}
      />
      <Controller
        name="start_time"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <MobileTimePicker
            {...field}
            label="Start Time"
            value={field.value ? dayjs(field.value) : null}
            onChange={(newValue) => field.onChange(dayjs(newValue).format())}
            format={formatPatterns.time}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error?.message,
              },
            }}
          />
        )}
      />

      <Controller
        name="end_time"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <MobileTimePicker
            {...field}
            label="End Time"
            value={field.value ? dayjs(field.value) : null}
            onChange={(newValue) => field.onChange(dayjs(newValue).format())}
            format={formatPatterns.time}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error?.message,
              },
            }}
          />
        )}
      />
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
        loadingIndicator={selectedTimeSlot ? "Updating" : "Creating"}
      >
        {selectedTimeSlot ? "Update" : "Create"}
      </LoadingButton>
    </Box>
  );

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Typography variant="h6">
            {selectedTimeSlot
              ? "Update selected appointment time slot"
              : "Create a new appointment time slot"}
          </Typography>

          {renderForm()}

          {renderActions()}
        </Stack>
      </Form>
    </Dialog>
  );
}
