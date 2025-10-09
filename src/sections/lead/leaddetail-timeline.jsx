import dayjs from "dayjs";
import { z as zod } from "zod";
import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useBoolean } from "minimal-shared/hooks";

import {
  LoadingButton,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  timelineItemClasses,
  TimelineSeparator,
} from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Dialog,
  Divider,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { MobileDatePicker, MobileTimePicker } from "@mui/x-date-pickers";

import { Field, Form } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { Label } from "src/components/label";

import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { setActivityDetail } from "src/redux/actions";

import { fDateTime, formatPatterns } from "src/utils";

import { toast } from "sonner";

import { createLeadActivity, updateLeadStatus } from "src/api";
import { LEADS_STATUS } from "src/constant/lead-status";

const TABS = [
  "all",
  "sms",
  "email",
  "call",
  "meeting",
  "status_update",
  "followup",
];

export default function ActivityTimeline({
  title,
  list = [],
  sx,
  leadId,
  status,
  ...other
}) {
  const [filter, setFilter] = useState("all");
  const { activityDetail } = useAppSelector((states) => states.lead);
  const createActivityDialog = useBoolean();
  const filteredList = useMemo(() => {
    if (filter === "all") return list;
    return list.filter((item) => item.type === filter);
  }, [list, filter]);

  return (
    <>
      <Card sx={sx} {...other}>
        <CardHeader title={title} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 3, md: 5 } }}
        >
          <Box sx={{ px: { xs: 0, sm: 3 }, pt: { xs: 0, sm: 2 } }}>
            <Tabs
              value={filter}
              onChange={(e, value) => setFilter(value)}
              sx={{ mb: { xs: 1, sm: 0 }, flexWrap: "wrap" }}
            >
              {TABS.map((tab) => (
                <Tab
                  key={tab}
                  value={tab}
                  // label={tab.charAt(0).toUpperCase() + tab.slice(1)}
                  sx={{ textTransform: "capitalize" }}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {tab === "sms"
                        ? "SMS"
                        : tab === "status_update"
                        ? "Updated Status"
                        : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      <Label
                        variant={filter === tab ? "filled" : "soft"}
                        color={
                          (tab === "sms" && "info") ||
                          (tab === "email" && "error") ||
                          (tab === "call" && "success") ||
                          (tab === "meeting" && "primary") ||
                          (tab === "status_update" && "info") ||
                          (tab === "followup" && "success") ||
                          "default"
                        }
                      >
                        {tab === "all"
                          ? activityDetail.length
                          : activityDetail.filter((item) => item.type === tab)
                              .length}
                      </Label>
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Box>

          <Button
            sx={{ mr: 2 }}
            variant="contained"
            color="info"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={createActivityDialog.onTrue}
          >
            Add Activity
          </Button>
        </Stack>

        <Timeline
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {filteredList.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ p: 3, textAlign: "center" }}
            >
              There is no activity log
            </Typography>
          ) : (
            filteredList.map((item, index) => (
              <TimelineItem key={item.id}>
                <TimelineSeparator>
                  <TimelineDot
                    color={
                      (item.type === "call" && "primary") ||
                      (item.type === "sms" && "info") ||
                      (item.type === "email" && "success") ||
                      (item.type === "meeting" && "warning") ||
                      (item.type === "status_update" && "info") ||
                      (item.type === "followup" && "success") ||
                      "error"
                    }
                  />
                  {index !== list.length - 1 && <TimelineConnector />}
                </TimelineSeparator>

                <TimelineContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Iconify
                      icon={
                        (item.type === "call" && "mdi:card-account-phone") ||
                        (item.type === "sms" && "mdi:message-text") ||
                        (item.type === "email" && "mdi:email-edit-outline") ||
                        (item.type === "meeting" && "mdi:virtual-meeting") ||
                        (item.type === "status_update" &&
                          "mdi:settings-refresh-outline") ||
                        (item.type === "followup" && "mdi:book-schedule") ||
                        "mdi:information-outline"
                      }
                      width={20}
                      sx={{
                        color:
                          (item.type === "sms" && "#0288d1") ||
                          (item.type === "email" && "#1976d2") ||
                          (item.type === "call" && "#2e7d32") ||
                          (item.type === "meeting" && "#6a1b9a") ||
                          (item.type === "status_update" && "#0288d1") ||
                          (item.type === "followup" && "#2e7d32") ||
                          "text.disabled",
                      }}
                    />
                    <Typography variant="subtitle2">{item.title}</Typography>
                  </Box>

                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {item.description}
                  </Typography>

                  {/* Ensure separate lines using a vertical Box */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", mt: 0.5 }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "text.disabled", display: "block" }}
                    >
                      {fDateTime(item.created_at)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.disabled", display: "block" }}
                    >
                      Created by: {item.created_by}
                    </Typography>
                    {item.updated_by && (
                      <Typography
                        variant="caption"
                        sx={{ color: "text.disabled", display: "block" }}
                      >
                        Updated by: {item.updated_by}
                      </Typography>
                    )}
                  </Box>
                </TimelineContent>
              </TimelineItem>
            ))
          )}
        </Timeline>
      </Card>
      <CreateActivityDialog
        open={createActivityDialog.value}
        onClose={createActivityDialog.onFalse}
        id={leadId}
        lead_status={status}
      />
    </>
  );
}

function CreateActivityDialog({ open, onClose, id, lead_status }) {
  const now = dayjs();

  const dispatch = useAppDispatch();

  const schema = zod.object({
    title: zod.string().min(1, { message: "Title is required!" }),
    description: zod.string().optional(),
    type: zod.string().min(1, { message: "Type is required!" }),
    start_date: zod.string().min(1, { message: "Date is required!" }),
    start_time: zod.string().min(1, { message: "Time is required!" }),
    status: zod.string().optional(),
  });

  const defaultValues = {
    title: "",
    description: "",
    type: "call",
    start_date: now.format("YYYY-MM-DD"),
    start_time: now.format("HH:mm:ss"),
    status: lead_status || "",
  };

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    setValue("status", lead_status);

    console.log(lead_status);
  }, [setValue, lead_status]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { start_date, start_time, status, ...rest } = data;

      const activityDateTime = dayjs(`${start_date} ${start_time}`).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const activitydata = {
        ...rest,
        activity_date_time: activityDateTime,
      };

      await updateLeadStatus(id, { status });
      const userResponses = await createLeadActivity(id, activitydata);

      dispatch(setActivityDetail(userResponses.data[0]));
      reset();

      onClose();

      toast.success(userResponses?.message || "Activity created successfully!");
    } catch (error) {
      toast.error(
        error?.messsage || "Could not create activity! Please try again."
      );
    }
  });

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Typography variant="h6">Lead Activity</Typography>
            <Field.Select
              size="small"
              name="type"
              label="Type"
              disabled={isSubmitting}
            >
              {/* <MenuItem
                  value=""
                  sx={{ fontStyle: "italic", color: "text.secondary" }}
                >
                  None
                </MenuItem> */}

              <Divider sx={{ borderStyle: "dashed" }} />

              <MenuItem value="call">Call</MenuItem>
              <MenuItem value="sms">SMS</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="meeting">Meeting</MenuItem>
            </Field.Select>

            <Controller
              name="start_date"
              control={control}
              disabled={isSubmitting}
              render={({ field, fieldState: { error } }) => (
                <MobileDatePicker
                  {...field}
                  label="Start Date"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(newValue) =>
                    field.onChange(dayjs(newValue).format("YYYY-MM-DD"))
                  }
                  format={formatPatterns.date}
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
              disabled={isSubmitting}
              render={({ field, fieldState: { error } }) => (
                <MobileTimePicker
                  {...field}
                  label="Start Time"
                  value={field.value ? dayjs(field.value, "HH:mm:ss") : null}
                  onChange={(newValue) =>
                    field.onChange(dayjs(newValue).format("HH:mm:ss"))
                  }
                  format="hh:mm A"
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
            <Field.Text name="title" label="Title" disabled={isSubmitting} />
            <Field.Text
              name="description"
              label="Description"
              disabled={isSubmitting}
            />

            <Field.Select
              size="small"
              name="status"
              label="Lead Status"
              disabled={isSubmitting}
            >
              <Divider sx={{ borderStyle: "dashed" }} />

              {LEADS_STATUS.map((status) => (
                <MenuItem key={status.id} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Box sx={{ gap: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>

              {/* <Button type="submit" variant="contained" color="info">
                  Proceed
                </Button> */}
              <LoadingButton
                type="submit"
                variant="contained"
                color="info"
                loading={isSubmitting}
                loadingIndicator="Submitting"
              >
                Proceed
              </LoadingButton>
            </Box>
          </Stack>
        </Form>
      </Dialog>
    </>
  );
}
