import {
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  IconButton,
  Typography,
  Grid,
} from "@mui/material";
import {
  addContract,
  useGetContract,
  useGetContractList,
  useGetDocument,
} from "src/api/document";
import { Iconify } from "src/components/iconify";
import { DashboardContent } from "src/layouts/dashboard";
import { fDateTime } from "src/utils/format-time";
import { useState } from "react";
import { AddDocumentDialog } from "src/sections/document/dialog/add-document";
import { toast } from "sonner";
import { paths } from "src/routes/paths";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

export function ContractList() {
  const {
    contractList,
    contractListLoading,
    contractListError,
    contractMutate,
  } = useGetContractList();
  const [openDialog, setOpenDialog] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return { bgcolor: "#D2F3EE", color: "#2BA597" };
      case "rejected":
        return { bgcolor: "#FFE7E7", color: "#D32F2F" };
      case "pending":
      default:
        return { bgcolor: "#FFF4E5", color: "#F57C00" };
    }
  };

  const handleAddNew = () => {
    setOpenDialog(true);
  };

  const handleSaveDocument = async ({ fileName, file }) => {
    try {
      // convert file to base64
      const base64 = await toBase64(file);

      const payload = {
        signed_contract_file: base64,
      };

      await addContract(payload);
      toast.success("Contract uploaded successfully!");

      setOpenDialog(false);
      contractMutate();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to upload document";
      toast.error(message);
    }
  };

  // helper to convert file
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "Contracts",
            href: paths.dashboard.contract.root,
          },
          { name: "List" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          {/* <Typography
            variant="h4"
            sx={{
              color: "#114B46",
              fontWeight: 700,
            }}
          >
            Contracts
          </Typography> */}
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleAddNew}
            sx={{
              borderColor: "#2BA597",
              color: "#2BA597",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              "&:hover": {
                borderColor: "#1D7E73",
                bgcolor: "rgba(43, 165, 151, 0.04)",
              },
            }}
          >
            Upload signed contract
          </Button>
        </Box>

        {/* Documents Grid */}
        <Grid container spacing={3}>
          {contractList.map((doc) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id}>
              <Card
                sx={{
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  border: "1px solid #D2F3EE",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(43, 165, 151, 0.16)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                {/* Delete Button (optional - not implemented) */}
                {/* <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(211, 47, 47, 0.9)",
                    color: "#fff",
                    zIndex: 2,
                    "&:hover": {
                      bgcolor: "rgba(211, 47, 47, 1)",
                    },
                  }}
                  size="small"
                >
                  <Iconify icon="eva:trash-2-fill" width={18} />
                </IconButton> */}
                {/* Document Image Preview */}
                {/* <Box
                  sx={{
                    position: "relative",
                    paddingTop: "133.33%", // 3:4 aspect ratio
                    bgcolor: "#f5f5f5",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={doc.file_path}
                    alt={doc.document_type?.name || "Contract"}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box> */}
                {/* Document Info + View PDF Button */}
                <Box sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#114B46",
                        fontWeight: 600,
                        textTransform: "capitalize",
                        flex: 1,
                      }}
                    >
                      {doc.document_type?.name || "Contract"}
                    </Typography>
                    <Chip
                      label={doc.status}
                      size="small"
                      sx={{
                        ...getStatusColor(doc.status),
                        fontWeight: 500,
                        fontSize: 11,
                        height: 22,
                      }}
                    />
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color: "#4F8E88",
                      display: "block",
                      mb: 0.5,
                    }}
                  >
                    Uploaded: {fDateTime(doc.signed_date)}
                  </Typography>

                  {doc.remark && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#4F8E88",
                        display: "block",
                        fontStyle: "italic",
                        mb: 1,
                      }}
                    >
                      {doc.remark}
                    </Typography>
                  )}

                  {/* View PDF Button */}
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Iconify icon="mdi:file-pdf-box" />}
                    onClick={() => window.open(doc.file_path, "_blank")}
                    sx={{
                      mt: 1,
                      textTransform: "none",
                      borderColor: "#2BA597",
                      color: "#2BA597",
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: "#1D7E73",
                        bgcolor: "rgba(43, 165, 151, 0.04)",
                      },
                    }}
                  >
                    View PDF
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {contractList.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
            }}
          >
            <Iconify
              icon="eva:file-text-outline"
              width={64}
              height={64}
              sx={{ color: "#CDE2E0", mb: 2 }}
            />
            <Typography variant="h6" sx={{ color: "#4F8E88", mb: 1 }}>
              No contracts uploaded
            </Typography>
            <Typography variant="body2" sx={{ color: "#4F8E88", mb: 3 }}>
              Get started by uploading your first contract
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleAddNew}
              sx={{
                bgcolor: "#2BA597",
                color: "#ffffff",
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                "&:hover": {
                  bgcolor: "#1D7E73",
                },
              }}
            >
              Upload Contract
            </Button>
          </Box>
        )}
      </Box>

      {/* Add Contract Dialog */}
      <AddDocumentDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveDocument}
      />
    </DashboardContent>
  );
}
