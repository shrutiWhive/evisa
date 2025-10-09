import { z as zod } from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useBoolean } from "minimal-shared/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import {
  Stack,
  Typography,
  Box,
  Button,
  Dialog,
  Divider,
  MenuItem,
  FormControlLabel,
  TextField,
  Radio,
  RadioGroup,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { Scrollbar } from "src/components/scrollbar";
import { Iconify } from "src/components/iconify";
import { Form, Field } from "src/components/hook-form";
import { toast } from "src/components/snackbar";

import { paths } from "src/routes/paths";

import { DashboardContent } from "src/layouts/dashboard";

import { LeadDetailToolbar } from "src/sections/lead/toolbar/leaddetail-toolbar";
import { CampaignDetailLeadsStatus } from "../campaign-detail-leads-status";
import { CampaignDetailLeadsTable } from "../campaign-detail-leads-table";
import { CampaignDetailLeadsFilters } from "../campaign-detail-leads-filters";

import {
  sendEmailToLeads,
  sendSmsToLeads,
  useGetCampaignDetail,
} from "src/api";
import { useSelector } from "react-redux";
import { useAppDispatch } from "src/redux/hooks";
import { clearStatus, setStatus } from "src/redux/actions/lead-actions";

export function CampaignDetailLeadsView({ id }) {
  const { campaign, campaignLoading } = useGetCampaignDetail(id);
  const status = useSelector((state) => state.lead.status);
  console.log("this is leadstatus", status);
  const dispatch = useAppDispatch();
  const { leads = [] } = campaign;

  const sendEmailDialog = useBoolean();
  const sendSMSDialog = useBoolean();

  const [viewMode, setViewMode] = useState("list");

  // const [status, setStatus] = useState("");

  const dynamicKeys = Array.from(
    new Set(
      Array.isArray(leads)
        ? leads.flatMap((lead) => Object.keys(lead.meta_data || {}))
        : []
    )
  );
  const isEmailPresent = dynamicKeys.some((key) =>
    key.toLowerCase().includes("email")
  );

  const dynamicTableHead = dynamicKeys.map((key) => ({
    id: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
  }));

  const notFound = !leads.length;

  const leadStatusList = [...new Set(leads.map((lead) => lead.status))];

  const statusCountMap = leads.reduce((acc, lead) => {
    const filterStatus = lead.status || "";
    acc[filterStatus] = (acc[filterStatus] || 0) + 1;
    return acc;
  }, {});

  const handleChangeViewMode = (view) => {
    setViewMode(view);
  };

  // const handleChangeStatus = (newStatus) => {
  //   setStatus(newStatus);
  // };

  const handleChangeStatus = (newStatus) => {
    dispatch(setStatus(newStatus));
  };
  const handleRemoveStatus = () => {
    dispatch(clearStatus());
  };

  const renderLeadView = () =>
    viewMode === "list" ? (
      <CampaignDetailLeadsTable
        leads={leads || []}
        //
        status={status}
        onRemoveStatus={handleRemoveStatus}
      />
    ) : (
      <CampaignDetailLeadsStatus leads={leads || []} leadStatus={status} />
    );

  return (
    <DashboardContent>
      <LeadDetailToolbar
        name="Lead Communication "
        backHref={paths.dashboard.campaign.root}
        action={
          <>
            {!notFound && (
              <Box sx={{ gap: 2, display: "flex" }}>
                <Button
                  color="info"
                  variant="soft"
                  startIcon={<Iconify icon="solar:letter-bold" />}
                  onClick={sendEmailDialog.onTrue}
                  disabled={!isEmailPresent}
                >
                  Send Email
                </Button>

                <Button
                  color="warning"
                  variant="soft"
                  onClick={sendSMSDialog.onTrue}
                  startIcon={<Iconify icon="solar:chat-line-bold" />}
                >
                  Send SMS
                </Button>
              </Box>
            )}
          </>
        }
      />

      <Stack spacing={3}>
        <CampaignDetailLeadsFilters
          viewMode={viewMode}
          onChangeViewMode={handleChangeViewMode}
          //
          statusList={leadStatusList}
          status={status}
          onChangeStatus={handleChangeStatus}
          statusCountMap={statusCountMap}
        />

        {renderLeadView()}

        <ChooseEmailFieldDialog
          open={sendEmailDialog.value}
          onClose={sendEmailDialog.onFalse}
          //
          leadFields={dynamicTableHead}
          leads={leads || []}
          //
        />

        <SendSMSDialog
          open={sendSMSDialog.value}
          onClose={sendSMSDialog.onFalse}
          recipients={leads.map((lead) => lead.phone_number).filter(Boolean)}
          id={id}
        />
      </Stack>
    </DashboardContent>
  );
}

function ChooseEmailFieldDialog({ open, onClose, leadFields, leads }) {
  const openSendEmailDialog = useBoolean();

  const schema = zod.object({
    field: zod.string().min(1, { message: "Field is required!" }),
  });

  const defaultValues = {
    field: "",
  };

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { handleSubmit, control } = methods;

  const { field } = useWatch({ control });

  const selectedFieldValues = leads.map(
    (lead) => lead.meta_data?.[field] ?? null
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const firstValue = leads[0].meta_data?.[data.field];

      const isValidEmail =
        typeof firstValue === "string" && emailRegex.test(firstValue);

      if (!isValidEmail) {
        toast.info("Please select the email field!");

        return;
      }

      onClose();

      openSendEmailDialog.onTrue();
    } catch (error) {
      toast.error("Couldn't send email. Please try again");
    }
  });

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Typography variant="h6">
              Which field contains the email address?
            </Typography>

            <Field.Select size="small" name="field" label="Fields">
              <MenuItem
                value=""
                sx={{ fontStyle: "italic", color: "text.secondary" }}
              >
                None
              </MenuItem>

              <Divider sx={{ borderStyle: "dashed" }} />

              {leadFields.map((leadField) => (
                <MenuItem key={leadField.id} value={leadField.id}>
                  {leadField.label}
                </MenuItem>
              ))}
            </Field.Select>

            {field && (
              <Stack spacing={1}>
                <Typography variant="subtitle2">
                  Selected field preview
                </Typography>

                <Scrollbar sx={{ height: 80 }}>
                  <Stack spacing={1}>
                    {selectedFieldValues?.map((fieldValue, index) => (
                      <Box
                        key={index}
                        sx={{ gap: 1, display: "flex", alignItems: "center" }}
                      >
                        <Iconify
                          icon="solar:round-alt-arrow-right-bold"
                          sx={{ width: 18 }}
                        />

                        <Typography variant="body2"> {fieldValue} </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Scrollbar>
              </Stack>
            )}

            <Box sx={{ gap: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>

              <Button type="submit" variant="contained" color="info">
                Proceed
              </Button>
            </Box>
          </Stack>
        </Form>
      </Dialog>

      <SendEmailDialog
        open={openSendEmailDialog.value}
        onClose={openSendEmailDialog.onFalse}
        //
        recipients={selectedFieldValues}
      />
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

  const totalRecipients = recipients?.length || 0;
  const totalCredits = credits * totalRecipients;

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
                  <Typography variant="caption">
                    Language:{" "}
                    {language.charAt(0).toUpperCase() + language.slice(1)} |{" "}
                    Characters per credit: {creditPer} | Estimated Credits per
                    person: {credits} | Total Recipients: {totalRecipients} |{" "}
                    {/* <strong>Total Estimated Credits: {totalCredits}</strong> */}
                  </Typography>

                  <Typography variant="caption">
                    <strong>Total Estimated Credits: {totalCredits}</strong>
                  </Typography>
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
