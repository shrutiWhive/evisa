import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { z as zod } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useBoolean } from "minimal-shared/hooks";
import dayjs from "dayjs";

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

import { Field, Form } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { Label } from "src/components/label";
import { toast } from "src/components/snackbar";

import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { setLeadNotes } from "src/redux/actions/lead-actions";

import { fDateTime, formatPatterns } from "src/utils";
import { Markdown } from "src/components/markdown";

import {
  createLeadActivity,
  createLeadNotes,
  updateLeadNotes,
  updateLeadStatus,
} from "src/api";

const getColorFromId = (id) => {
  const COLORS = [
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
  ];

  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 100000;
  }

  return COLORS[hash % COLORS.length];
};

export default function LeadNotes({
  title,
  list = [],
  sx,
  leadId,
  status,
  ...other
}) {
  const createActivityDialog = useBoolean();

  const [editingNote, setEditingNote] = useState(null);

  return (
    <>
      <Card sx={sx} {...other}>
        <CardHeader title={title} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-end", sm: "center" }}
          justifyContent={{ xs: "space-between", sm: "flex-end" }}
          spacing={2}
          sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 3, md: 5 } }}
        >
          <Button
            sx={{ mr: 2 }}
            variant="contained"
            color="info"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={createActivityDialog.onTrue}
          >
            Add Notes
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
          {list.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ p: 3, textAlign: "center" }}
            >
              There is no notes {leadId}
            </Typography>
          ) : (
            list.map((item, index) => (
              <TimelineItem key={item.id}>
                <TimelineSeparator>
                  <TimelineDot color={getColorFromId(item.id.toString())} />
                  {index !== list.length - 1 && <TimelineConnector />}
                </TimelineSeparator>

                <TimelineContent
                  sx={{
                    alignSelf: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        typography: "body2",
                        color: "text.secondary",
                        p: 0,
                        m: 0,
                        "& p": { m: 0 }, // remove <p> tag default margin
                      }}
                    >
                      <Markdown>{item.notes}</Markdown>
                    </Box>

                    <Iconify
                      icon="eva:edit-2-outline"
                      sx={{
                        color: "text.disabled",
                        fontSize: 18,
                        cursor: "pointer",
                        ml: 1,
                      }}
                      onClick={() => {
                        setEditingNote(item);
                        createActivityDialog.onTrue(); // FIXED
                      }}
                    />
                  </Box>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", mt: 0.5 }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "text.disabled" }}
                    >
                      {fDateTime(item.created_at)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.disabled" }}
                    >
                      created by: {item.status}
                    </Typography>
                  </Box>
                </TimelineContent>
              </TimelineItem>
            ))
          )}
        </Timeline>
      </Card>

      <CreateNotesDialog
        open={createActivityDialog.value}
        onClose={() => {
          createActivityDialog.onFalse();
          setEditingNote(null);
        }}
        //
        id={leadId}
        noteItem={editingNote}
      />
    </>
  );
}

function CreateNotesDialog({ open, onClose, id, noteItem }) {
  const dispatch = useAppDispatch();

  const schema = zod.object({
    note: zod.string().min(1, { message: "Message is required!" }),
  });

  const defaultValues = {
    note: noteItem?.notes || "",
  };

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    values: {
      note: noteItem?.notes || "",
    },
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = noteItem
        ? await updateLeadNotes(noteItem.id, data)
        : await createLeadNotes(id, data);

      dispatch(setLeadNotes(response.data.lead_notes));

      reset();

      onClose();

      toast.success(
        noteItem ? "Note updated successfully!" : "Note created successfully!"
      );
    } catch (error) {
      toast.error(
        error?.messsage || "Could not create Notes! Please try again."
      );
    }
  });

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Controller
              name="note"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <div>
                  <label style={{ fontWeight: 600 }}>Write your notes</label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={value || ""}
                    onChange={(_, editor) => {
                      const data = editor.getData();
                      onChange(data);
                    }}
                  />
                  {error && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "0.8rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      {error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Box sx={{ gap: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>

              <LoadingButton
                type="submit"
                variant="contained"
                color="info"
                loading={isSubmitting}
                loadingIndicator="Processing"
              >
                {noteItem ? "Update" : "Add"}
              </LoadingButton>
            </Box>
          </Stack>
        </Form>
      </Dialog>
    </>
  );
}
