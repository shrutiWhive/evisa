import { useState, useEffect, useRef } from "react";
import { useCopyToClipboard } from "minimal-shared/hooks";

import { Stack, Box, Card, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";

import { Iconify } from "src/components/iconify";
import { toast } from "src/components/snackbar";
import { Image } from "src/components/image";

import { paths } from "src/routes/paths";

import { exportLeadTemplate, updateCampaign } from "src/api";

import { CampaignDetailFormTemplate } from "./campaign-detail-form-template";
import { CampaignQRCode } from "./campaign-qr-code";
import { PageNotFoundIllustration } from "src/assets/illustrations";
// import { encrypt } from "src/helper/encrypt";
import { FormTemplateDetail } from "../form-template/form-template-detail";
import { LoadingButton } from "@mui/lab";
import { toPng } from "html-to-image";

export function CampaignDetailSummary({ campaign }) {
  const {
    id,
    name,
    description,
    form_template_id,
    total_leads,
    topup_amount,
    rewarded_amount,
    qr_code_url,
    created_by,
    ntc_reward_type,
    ncell_reward_type,
    ncell_topup_amount,
    ntc_topup_amount,
    ntc_product,
    ncell_product,
  } = campaign;
  const { copy } = useCopyToClipboard();
  const [qrCodeLink, setQRCodeLink] = useState(qr_code_url);
  const [exportTemplateLoading, setTemplateExportLoading] = useState(false);
  const qrRef = useRef(null);

  const rewardColorMap = {
    Topup: "success.main",
    Data: "info.main",
    None: "error.main",
  };

  // useEffect(() => {
  //   async function generateEncryptedLink() {
  //     if (!id) return;

  //     try {
  //       const encryptedId = await encrypt(String(id));
  //       const encodedId = encodeURIComponent(encryptedId);
  //       const link = `${window.location.origin}${paths.campaign.form(
  //         encodedId
  //       )}`;

  //       setQRCodeLink(link);
  //     } catch (err) {
  //       console.error("Encryption error:", err);
  //     }
  //   }

  //   generateEncryptedLink();
  // }, [id]);

  useEffect(() => {
    if (id) {
      const link = `${window.location.origin}${paths.campaign.form(id)}`;
      setQRCodeLink(link);
    }
  }, [id]);

  useEffect(() => {
    setQRCodeLink(qr_code_url);
  }, [qr_code_url]);

  const handleCopy = () => {
    toast.success("Copied!");

    copy(qrCodeLink);
  };

  const handleGenerateQrCodeLink = async () => {
    try {
      // const encryptedId = await encrypt(String(id));
      // const encodedId = encodeURIComponent(encryptedId);
      // const link = `${window.location.origin}${paths.campaign.form(encodedId)}`;
      const link = `${window.location.origin}${paths.campaign.form(id)}`;

      const data = {
        name,
        description,
        topup_amount,
        total_leads,
        form_template_id,
        qr_code_url: link,
      };

      await updateCampaign(id, data);

      setQRCodeLink(link);

      toast.success("QR successfully generated.");
    } catch (error) {
      toast.error("Could not generate QR! Please try again.");
    }
  };

  const handleDownloadQr = () => {
    if (qrRef.current) {
      toPng(qrRef.current)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `${name || "qr-code"}.png`;
          link.href = dataUrl;
          link.click();
          toast.success("QR Code downloaded successfully!");
        })
        .catch((err) => {
          console.error("QR Download failed", err);
          toast.error("Could not download QR code. Please try again.");
        });
    }
  };

  // const handleExportTemplateClick = async () => {
  //   try {
  //     setTemplateExportLoading(true);
  //     await exportLeadTemplate(id);
  //   } catch (error) {
  //     console.error("Export failed", error);
  //   } finally {
  //     setTemplateExportLoading(false);
  //   }
  // };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 8 }}>
        <Card sx={{ p: 3, gap: 1, display: "flex", flexDirection: "column" }}>
          {/* Header row: Title left, Created by right */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="h6">Description</Typography>
            <Typography
              variant="caption"
              sx={{ color: "primary.main", fontWeight: "bold" }}
            >
              Created by: {created_by}
            </Typography>
          </Box>

          {/* Description text below */}
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {description}
          </Typography>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <Card sx={{ p: 3, gap: 2, display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="subtitle1"> Total Leads </Typography>

            <Typography variant="subtitle1"> {total_leads} </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="subtitle1"> Reward Amount </Typography>

            <Typography variant="subtitle1"> {rewarded_amount} </Typography>
          </Box>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Grid container spacing={3} direction="column">
          <Grid item xs={12} sm={6}>
            <Card
              sx={{ p: 3, display: "flex", flexDirection: "column", gap: 1 }}
            >
              <Typography variant="h6">Campaign Rewards</Typography>
              {ntc_reward_type === "Topup" && (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: rewardColorMap[ntc_reward_type] }}
                  >
                    NTC Reward Type: <strong>Topup</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Topup Amount: <strong>{ntc_topup_amount}</strong>
                  </Typography>
                </Box>
              )}

              {ntc_reward_type === "Data" && (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: rewardColorMap[ntc_reward_type] }}
                  >
                    NTC Reward Type: <strong>Data</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Data Pack: <strong>{ntc_product?.product_name}</strong>
                    {ntc_product?.amount && ` (Rs. ${ntc_product.amount})`}
                  </Typography>
                </Box>
              )}

              {ncell_reward_type === "Topup" && (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: rewardColorMap[ncell_reward_type] }}
                  >
                    NCELL Reward Type: <strong>Topup</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Topup Amount: <strong>{ncell_topup_amount}</strong>
                  </Typography>
                </Box>
              )}

              {ncell_reward_type === "Data" && (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: rewardColorMap[ncell_reward_type] }}
                  >
                    NCELL Reward Type: <strong>Data</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Data Pack: <strong>{ncell_product?.product_name}</strong>
                    {ncell_product?.amount && ` (Rs. ${ncell_product.amount})`}
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>

          <Card sx={{ p: 3, gap: 2, display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6"> QR Code </Typography>

              {!qrCodeLink && (
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="solar:qr-code-bold" />}
                  onClick={handleGenerateQrCodeLink}
                >
                  Generate QR
                </Button>
              )}
            </Box>

            {qrCodeLink ? (
              <Box
                sx={{
                  gap: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* <CampaignQRCode campaignFormLink={qrCodeLink} size={200} /> */}
                <Box ref={qrRef}>
                  <CampaignQRCode campaignFormLink={qrCodeLink} size={200} />
                </Box>

                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", wordBreak: "break-all" }}
                >
                  {qrCodeLink}
                </Typography>

                <Box sx={{ gap: 2, display: "flex" }}>
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon="solar:qr-code-bold" />}
                    onClick={handleGenerateQrCodeLink}
                    sx={{
                      color: "warning.main",
                      borderColor: "warning.main",
                      "&:hover": {
                        backgroundColor: "warning.lighter", // You can also use a light rgba
                        borderColor: "warning.main",
                      },
                    }}
                  >
                    Regenerate QR
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={
                      <Iconify icon="solar:download-minimalistic-bold" />
                    }
                    // disabled={notFound}
                    onClick={handleDownloadQr}
                    loading={exportTemplateLoading}
                    sx={{
                      color: "primary.main",
                      borderColor: "primary.main",
                      "&:hover": {
                        backgroundColor: "primary.lighter", // You can also use a light rgba
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    Download
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon="solar-copy-bold" />}
                    onClick={handleCopy}
                    sx={{
                      color: "success.main",
                      borderColor: "success.main",
                      "&:hover": {
                        backgroundColor: "success.lighter", // Or use `rgba(76, 175, 80, 0.1)`
                        borderColor: "success.main",
                      },
                    }}
                  >
                    Copy Link
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  gap: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  color: "text.disabled",
                }}
              >
                <Image
                  alt="No QR Image"
                  src="/assets/illustrations/characters/character-6.webp"
                  sx={{
                    height: 110,
                  }}
                />

                <Typography variant="subtitle2"> No QR Code Yet</Typography>

                <Typography variant="caption">
                  Click the Generate QR button to create QR code.
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Card sx={{ p: 3, gap: 3, display: "flex", flexDirection: "column" }}>
          <Typography variant="h6"> Form Preview </Typography>

          <CampaignDetailFormTemplate />
        </Card>
      </Grid>
    </Grid>
  );
}
