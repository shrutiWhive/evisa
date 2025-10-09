import { z as zod } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { useBoolean } from "minimal-shared/hooks";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  Stack,
  Typography,
  Box,
  Card,
  Button,
  Dialog,
  Divider,
  MenuItem,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useTable, TableHeadCustom, TableNoData } from "src/components/table";
import { Scrollbar } from "src/components/scrollbar";
import { Iconify } from "src/components/iconify";
import { Form, Field } from "src/components/hook-form";
import { toast } from "src/components/snackbar";

import { fDateTime } from "src/utils/format-time";

import { sendEmailToLeads } from "src/api";

import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";

export function CampaignDetailLeads({ leads }) {
  const sendEmailDialog = useBoolean();


  const table = useTable({ defaultOrderBy: "orderNumber" });

  const phoneNumberTableHead = [{ id: "phone_number", label: "Phone Number" }];

  const staticTableHead = [{ id: "created_at", label: "Timestamp" }];

  const dynamicKeys = Array.from(
    new Set(leads.flatMap((lead) => Object.keys(lead.meta_data)))
  );

  const dynamicTableHead = dynamicKeys.map((key) => ({
    id: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
  }));

  const tableHead = [
    ...phoneNumberTableHead,
    ...dynamicTableHead,
    ...staticTableHead,
  ];

  const notFound = !leads.length;

  return (
    <>
      <Card>
        <Stack spacing={3} sx={{ py: 3 }}>
          <Box sx={{ px: 3, display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Lead Responses</Typography>

            {!notFound && (
              <Box sx={{ gap: 2, display: "flex" }}>
                <Button
                  color="info"
                  variant="soft"
                  startIcon={<Iconify icon="solar:letter-bold" />}
                  onClick={sendEmailDialog.onTrue}
                >
                  Send Email
                </Button>

                <Button
                  color="warning"
                  variant="soft"
                  startIcon={<Iconify icon="solar:chat-line-bold" />}
                >
                  Send SMS
                </Button>
              </Box>
            )}
          </Box>

          <Scrollbar>
            <Table
              size={table.dense ? "small" : "medium"}
              sx={{ minWidth: 960 }}
            >
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headCells={tableHead}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              <TableBody>
                {leads
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <LeadTableRow
                      key={row.id}
                      row={row}
                      metaKeys={dynamicKeys}
                    />
                  ))}

                <TableNoData
                  title="No responses have been submitted yet"
                  notFound={notFound}
                />
              </TableBody>
            </Table>
          </Scrollbar>
        </Stack>
      </Card>

      <ChooseEmailFieldDialog
        open={sendEmailDialog.value}
        onClose={sendEmailDialog.onFalse}
        //
        leadFields={dynamicTableHead}
        leads={leads || []}
        //
      />
    </>
  );
}

function LeadTableRow({ row, metaKeys }) {
  const { phone_number, created_at, meta_data } = row;

  const router = useRouter();

  const handleClick = () => {
    router.push(paths.dashboard.leadDetail.detail(row.id));
  };

  return (
    <TableRow hover onClick={handleClick}>
      <TableCell>{phone_number}</TableCell>

      {metaKeys.map((key) => (
        <TableCell key={key}>{meta_data[key]}</TableCell>
      ))}

      <TableCell>{fDateTime(created_at)}</TableCell>
    </TableRow>
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
