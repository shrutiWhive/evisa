import {
  Box,
  Container,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Typography,
  Divider,
} from "@mui/material";
import { useGetContract } from "src/api/document";
import { Iconify } from "src/components/iconify";

export function FinanceAssign() {
  const { contract, contractLoading, contractError } = useGetContract();
  const handleViewContract = () => {
    if (!contract?.file_path) {
      alert("Contract file not available yet!");
      return;
    }

    // ✅ Open the PDF directly in a new tab
    window.open(contract.file_path, "_blank", "noopener,noreferrer");
  };

  const steps = [
    { label: "Onboarding", icon: "mdi:check" },
    { label: "Employer Selection", icon: "mdi:check" },
    { label: "Contract", icon: "mdi:file-document-outline" },
    { label: "Payment", icon: "mdi:credit-card-outline" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        py: 8,
      }}
    >
      <Container maxWidth="md">
        {/* Stepper */}
        <Stepper
          alternativeLabel
          activeStep={2}
          connector={
            <StepConnector
              sx={{
                top: 20,
                left: "calc(-50% + 20px)",
                right: "calc(50% + 20px)",
                "& .MuiStepConnector-line": {
                  borderColor: "#2BA597",
                  borderTopWidth: 3,
                },
              }}
            />
          }
          sx={{
            mb: 8,
            "& .MuiStepLabel-label": {
              color: "#114B46",
              fontSize: 12,
              fontWeight: 500,
              mt: 1,
            },
          }}
        >
          {steps.map((step, index) => (
            <Step key={index} completed={index < 2}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: index <= 2 ? "#2BA597" : "#ffffff",
                      border: index <= 2 ? "none" : "2px solid #2BA597",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {index < 2 ? (
                      <Iconify
                        icon="mdi:check"
                        width={24}
                        height={24}
                        color="#fff"
                      />
                    ) : (
                      <Iconify
                        icon={step.icon}
                        width={22}
                        height={22}
                        color={index === 2 ? "#fff" : "#2BA597"}
                      />
                    )}
                  </Box>
                )}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Thank You Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              color: "#2BA597",
              fontWeight: 600,
              mb: 2,
            }}
          >
            Thank you
          </Typography>
          <Typography
            sx={{
              color: "#4F8E88",
              fontSize: 14,
            }}
          >
            We will send you contracts in your email. Please make sure to sign
            it.
          </Typography>
        </Box>

        {/* Plan Card */}
        <Box
          sx={{
            bgcolor: "#ffffff",
            borderRadius: 2,
            p: 4,
            border: "1px solid #D2F3EE",
            boxShadow: "0 2px 8px rgba(43, 165, 151, 0.08)",
            maxWidth: 400,
            mx: "auto",
          }}
        >
          <Typography
            sx={{
              color: "#4F8E88",
              fontSize: 14,
              textAlign: "center",
              mb: 2,
            }}
          >
            Option A
          </Typography>

          <Typography
            variant="h3"
            sx={{
              color: "#2BA597",
              fontWeight: 700,
              textAlign: "center",
              mb: 2,
            }}
          >
            $26900
          </Typography>

          <Typography
            sx={{
              color: "#4F8E88",
              fontSize: 13,
              textAlign: "center",
              mb: 3,
            }}
          >
            Consular Processing (Apply from Outside of USA)
          </Typography>

          <Divider sx={{ bgcolor: "#D2F3EE", mb: 3 }} />

          <Box
            sx={{
              bgcolor: "#2BA597",
              borderRadius: 1,
              p: 2,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Please be patient while your verification is being processed
            </Typography>
          </Box>
          <Divider sx={{ bgcolor: "#D2F3EE", mb: 3 }} />
          <Box
            onClick={handleViewContract}
            sx={{
              bgcolor: "#2BA597",
              borderRadius: 1,
              p: 2,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              View Your contract
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
