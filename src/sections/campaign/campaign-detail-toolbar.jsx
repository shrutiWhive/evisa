import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { RouterLink } from "src/routes/components";

import { fDateTime } from "src/utils/format-time";

import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";
import { LoadingButton } from "@mui/lab";
import { useRef, useState } from "react";
import { exportCampaignLeads, exportLeadTemplate, importLeads } from "src/api";
import { toast } from "sonner";

// ----------------------------------------------------------------------

export function CampaignDetailToolbar({
  status,
  backHref,
  editHref,
  createdAt,
  name,
  campaignId,
}) {
  const [exportLoading, setExportLoading] = useState(false); // loading state
  const [exportTemplateLoading, setTemplateExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const fileInputRef = useRef();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  const handleExportClick = async () => {
    try {
      setExportLoading(true);
      await exportCampaignLeads(campaignId); 
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportTemplateClick = async () => {
    try {
      setTemplateExportLoading(true);
      await exportLeadTemplate(campaignId);
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setTemplateExportLoading(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Only Excel files (.xlsx, .xls) are allowed.");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setImportLoading(true);
      await importLeads(campaignId, formData);

      toast.success("Leads imported successfully.");
    } catch (error) {
      console.error("Import failed", error);
      toast.error("Import failed.");
    } finally {
      setImportLoading(false);
      event.target.value = "";
    }
  };

  return (
    <Box
      sx={{
        gap: 3,
        display: "flex",
        mb: { xs: 3, md: 5 },
        flexDirection: { xs: "column", sm: "column", md: "column", lg: "row" },
      }}
    >
      <Box sx={{ gap: 1, display: "flex", alignItems: "flex-start" }}>
        <IconButton component={RouterLink} href={backHref}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>

        <Stack spacing={0.5}>
          <Box sx={{ gap: 1, display: "flex", alignItems: "center" }}>
            <Typography
              variant="h4"
              sx={{
                maxWidth: {
                  lg: 450,
                },
              }}
            >
              {name}
            </Typography>

            <Label
              variant="soft"
              color={
                (status === "Active" && "success") ||
                (status === "Inactive" && "error") ||
                "default"
              }
            >
              {status}
            </Label>
          </Box>

          <Typography variant="body2" sx={{ color: "text.disabled" }}>
            {fDateTime(createdAt)}
          </Typography>
        </Stack>
      </Box>

      <Box
        sx={{
          gap: 1,
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Button
          component={RouterLink}
          href={editHref}
          variant="contained"
          startIcon={<Iconify icon="solar:pen-bold" />}
          sx={{
            flexShrink: 0,
            backgroundColor: "primary.main",
            color: "#fff",
            "&:hover": {
              backgroundColor: "primary.darker",
            },
          }}
        >
          Edit
        </Button>

        <LoadingButton
          variant="contained"
          startIcon={<Iconify icon="solar:download-minimalistic-bold" />}
          // disabled={notFound}
          onClick={handleExportClick}
          loading={exportLoading}
          sx={{
            flexShrink: 0,
            backgroundColor: "primary.main", // custom blue
            "&:hover": {
              backgroundColor: "primary.darker", // darker blue on hover
            },
          }}
        >
          Download Report
        </LoadingButton>

        <LoadingButton
          variant="contained"
          startIcon={<Iconify icon="solar:download-minimalistic-bold" />}
          // disabled={notFound}
          onClick={handleExportTemplateClick}
          loading={exportTemplateLoading}
          sx={{
            flexShrink: 0,
            backgroundColor: "primary.main", // custom blue
            "&:hover": {
              backgroundColor: "primary.darker", // darker blue on hover
            },
          }}
        >
          Download Template
        </LoadingButton>

        <LoadingButton
          color="inherit"
          variant="contained"
          startIcon={<Iconify icon="mdi:file-upload-outline" />}
          onClick={handleImportClick}
          loading={importLoading}
          sx={{
            flexShrink: 0,
            backgroundColor: "primary.main", // custom blue
            "&:hover": {
              backgroundColor: "primary.darker", // darker blue on hover
            },
          }}
        >
          Import
        </LoadingButton>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          style={{ display: "none" }}
        />
      </Box>
    </Box>
  );
}
