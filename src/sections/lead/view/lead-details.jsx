import { z as zod } from "zod";
import { useState, useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBoolean } from "minimal-shared/hooks";

import {
  fetchActivityDetailRequest,
  fetchLeadDetailRequest,
} from "src/redux/actions/lead-actions";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";

import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Grid from "@mui/material/Grid2";

import { paths } from "src/routes/paths";

import { echoInstance } from "src/lib";

import {
  createLeadActivity,
  sendEmailToLeads,
  sendSmsToLeads,
  useGetLeadDetail,
} from "src/api";

import { selectLeadActivity, selectAuthState } from "src/redux/selectors";

import { Label } from "src/components/label";
import { MetaDataGrid } from "src/components/metadata-grid/metadata-grid";

import { DashboardContent } from "src/layouts/dashboard";

import { Iconify } from "src/components/iconify";
import { Field, Form } from "src/components/hook-form";
import { toast } from "src/components/snackbar";

import ActivityTimeline from "../leaddetail-timeline";
import LeadNotes from "../leaddetail-notes";
import { LeadDetailSkeleton } from "../leaddetail-skeleton";
import { LeadDetailToolbar } from "../toolbar/leaddetail-toolbar";

export function LeadDetail({ id }) {
  const dispatch = useAppDispatch();

  const { lead, leadLoading, mutateLead } = useGetLeadDetail(id);

  const { phone_number, topup_status, meta_data, campaign_id, status } = lead;

  console.log(status);

  const { activityDetail, isLoading, leadNotes } =
    useAppSelector(selectLeadActivity);

  const { user } = useAppSelector(selectAuthState);

  const orgId = user?.organization_id;

  const openSendEmailDialog = useBoolean();

  const sendSMSDialog = useBoolean();

  const recipientEmail =
    Object.entries(meta_data || {}).find(([key, value]) =>
      key.toLowerCase().includes("email")
    )?.[1] || null;

  useEffect(() => {
    dispatch(fetchLeadDetailRequest(id));
    dispatch(fetchActivityDetailRequest(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!orgId) return undefined;

    const channelName = `lead-status.org.${orgId}`;

    const eventName = ".App\\Events\\LeadStatusUpdated";

    const channel = echoInstance.channel(channelName);

    channel.listen(eventName, (data) => {
      mutateLead(
        (currentData) => ({
          ...currentData,
          data: {
            ...currentData.data,
            status: data.status,
          },
        }),
        false
      );
    });

    return () => {
      console.log(`Leaving channel: ${channelName}`);
      echoInstance.leave(channelName);
    };
  }, [orgId]);

  const activityTimelineList = activityDetail.map((activity) => ({
    id: activity.id,
    title: activity.title,
    description: activity.description,
    type: activity.type,
    created_at: activity.created_at,
    status: activity.status,
    created_by: activity.created_by,
    updated_by: activity.updated_by,
  }));

  const leadNotesList = leadNotes.map((noteItem) => ({
    id: noteItem.id,
    notes: noteItem.note,
    created_at: noteItem.created_at,
    status: noteItem.created_by_name,
  }));

  // useEffect(() => {
  //   if (id) {
  //     dispatch(setSelectedLeads([id]));
  //   }
  // }, [dispatch, id]);
  return (
    <>
      <DashboardContent>
        <LeadDetailToolbar
          name="Lead Details"
          backHref={paths.dashboard.campaign.leadDetails(campaign_id)}
        />
        {leadLoading || isLoading ? (
          <LeadDetailSkeleton />
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 8 }}>
                <Stack>
                  <Card sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
                    {/* Top: avatar and contact */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 3,
                      }}
                    >
                      <Stack direction="row" spacing={2}>
                        <Avatar>{phone_number?.[0] || "U"}</Avatar>
                        <Box>
                          <Typography variant="h6">{phone_number}</Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle2" color="text.secondary">
                          Topup status:
                        </Typography>
                        <Label
                          variant="soft"
                          color={
                            (topup_status === "pending" && "warning") ||
                            (topup_status === "success" && "success") ||
                            (topup_status === "failed" && "error") ||
                            "default"
                          }
                        >
                          {topup_status}
                        </Label>
                      </Stack>
                    </Box>

                    <Grid container spacing={2}>
                      <MetaDataGrid metaData={meta_data} />
                    </Grid>
                  </Card>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Card sx={{ p: 3, textAlign: "center", borderRadius: 2 }}>
                  <Button
                    variant="contained"
                    color="info"
                    fullWidth
                    startIcon={<Iconify icon="solar:letter-bold" />}
                    sx={{ mb: 1 }}
                    onClick={openSendEmailDialog.onTrue}
                    disabled={
                      !meta_data?.email_yours &&
                      !meta_data?.email &&
                      !meta_data?.email_address
                    }
                  >
                    Send Email
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    fullWidth
                    onClick={sendSMSDialog.onTrue}
                    // startIcon={<Iconify icon="mdi:cellphone-dock" />}
                    startIcon={
                      <Iconify
                        icon="solar:chat-line-bold"
                        sx={{ fontSize: 14 }}
                      />
                    }
                    sx={{ mb: 1 }}
                  >
                    Send SMS
                  </Button>
                </Card>
              </Grid>
            </Grid>

            <Stack spacing={3} sx={{ py: 3 }}>
              <Grid item xs={12} md={12} lg={12}>
                <ActivityTimeline
                  title="Activity Timeline"
                  list={activityTimelineList}
                  leadId={id}
                  status={status}
                />
              </Grid>
            </Stack>
            <Stack spacing={3} sx={{ py: 3 }}>
              <Grid item xs={12} md={12} lg={12}>
                <LeadNotes
                  title="Notes"
                  list={leadNotesList}
                  leadId={id}
                  // status={status}
                />
              </Grid>
            </Stack>
          </>
        )}

        <SendEmailDialog
          open={openSendEmailDialog.value}
          onClose={openSendEmailDialog.onFalse}
          recipients={recipientEmail ? [recipientEmail] : []}
        />

        <SendSMSDialog
          open={sendSMSDialog.value}
          onClose={sendSMSDialog.onFalse}
          recipients={phone_number ? [phone_number] : []}
          id={campaign_id}
        />
      </DashboardContent>
    </>
  );
}

function SendEmailDialog({ open, onClose, recipients }) {
  const schema = zod.object({
    subject: zod.string().min(1, { message: "Subject is required!" }),
    message: zod.string().min(1, { message: "Message is required!" }),
  });

  const defaultValues = {
    subject: "",
    message: "",
  };

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const sendEmailData = {
        ...data,
        recipients,
      };

      const response = await sendEmailToLeads(sendEmailData);

      reset();

      onClose();

      toast.success("Email sent successfully!");
    } catch (error) {
      toast.error("Couldn't send email. Please try again");
    }
  });

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Typography variant="h6">Send Email</Typography>

          <Field.Text name="subject" label="Subject" />

          <Stack spacing={1}>
            <Typography variant="subtitle2">Message</Typography>

            <Field.Editor name="message" />
          </Stack>

          <Box sx={{ gap: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>

            <LoadingButton
              type="submit"
              variant="contained"
              color="info"
              loading={isSubmitting}
              loadingIndicator="Sending"
            >
              Send
            </LoadingButton>
          </Box>
        </Stack>
      </Form>
    </Dialog>
  );
}

export function SendSMSDialog({ open, onClose, recipients, id }) {
  const schema = zod.object({
    message: zod.string().min(1, { message: "Message is required!" }),
    language: zod.string().default("english"),
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      message: "",
      language: "english",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const message = useWatch({ control, name: "message" });
  const language = useWatch({ control, name: "language" });

  const totalChars = message?.length || 0;
  const creditPer = language === "nepali" ? 70 : 160;
  const credits = totalChars === 0 ? 0 : Math.ceil(totalChars / creditPer);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const smsData = {
        campaign_id: id,
        to: recipients,
        message: data.message,
      };

      const response = await sendSmsToLeads(smsData);

      reset();
      onClose();
      toast.success("SMS sent successfully!");
    } catch (error) {
      toast.error(error?.message || "Couldn't send SMS. Please try again");
      onClose();
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Typography variant="h6">Send SMS</Typography>

          {/* Recipients Display */}
          <Box>
            <Typography variant="subtitle1">
              To<span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              value={recipients?.join(", ") || ""}
              placeholder="Recipients"
              fullWidth
              size="small"
              disabled
              sx={{ mt: 1 }}
            />
          </Box>

          {/* Message Field */}
          <Controller
            name="message"
            control={control}
            render={({ field, fieldState }) => (
              <Box>
                <Typography variant="subtitle1">
                  Message<span style={{ color: "red" }}>*</span>
                </Typography>

                {/* Language Radio */}
                <Controller
                  name="language"
                  control={control}
                  render={({ field: radioField }) => (
                    <RadioGroup row {...radioField} sx={{ mt: 1 }}>
                      <FormControlLabel
                        value="english"
                        control={<Radio />}
                        label="English"
                      />
                      <FormControlLabel
                        value="nepali"
                        control={<Radio />}
                        label="नेपाली"
                      />
                    </RadioGroup>
                  )}
                />

                <TextField
                  placeholder="Type your message here..."
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ mt: 2 }}
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isSubmitting}
                />

                <Box
                  sx={{
                    mt: 1,
                    backgroundColor: "rgba(0, 184, 217, 0.1)",
                    color: "primary.main",
                    p: 1,
                    borderRadius: 1,
                    display: "inline-block",
                    fontSize: 12,
                  }}
                >
                  Language: Total Characters: {totalChars} Credit: {credits}
                </Box>
              </Box>
            )}
          />

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <LoadingButton
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#FFA500",
                "&:hover": { backgroundColor: "#FF8C00" },
              }}
              loading={isSubmitting}
              loadingIndicator="Sending"
            >
              SEND SMS
            </LoadingButton>
          </Box>
        </Stack>
      </form>
    </Dialog>
  );
}
