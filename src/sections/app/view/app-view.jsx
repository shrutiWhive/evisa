import Grid from "@mui/material/Grid2";

import { DashboardContent } from "src/layouts/dashboard";

import { Iconify } from "src/components/iconify";
import { Box, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useGetVacancy } from "src/api/vacancy";
import { VacancyList } from "./vacancy-list";

// ----------------------------------------------------------------------

const steps = [
  { label: "Onboarding", icon: "mdi:check-circle-outline" },
  { label: "Employer Selection", icon: "mdi:briefcase-outline" },
  { label: "Contract", icon: "mdi:file-document-outline" },
  { label: "Payment", icon: "mdi:credit-card-outline" },
];

export function AppView() {
  const { vacancy } = useGetVacancy();

  return (
    <DashboardContent maxWidth="xl">
      <Box
        sx={{
          bgcolor: "#ffffffff",
          minHeight: "100vh",
          p: { xs: 3, md: 6 },
          color: "#fff",
        }}
      >
        {/* Stepper */}
        <Stepper
          alternativeLabel
          activeStep={1}
          sx={{
            mb: 6,
            "& .MuiStepLabel-label": { color: "#fff", fontSize: 14 },
            "& .MuiStepConnector-line": {
              borderColor: "rgba(255,255,255,0.3)",
            },
          }}
        >
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor:
                        index === 1 ? "#ffb648" : "rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Iconify
                      icon={step.icon}
                      width={22}
                      height={22}
                      color={index === 1 ? "#fff" : "#ffb648"}
                    />
                  </Box>
                )}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box textAlign="center" mb={5}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}
          >
            Congrats, You are eligible for EB-3 Visa
          </Typography>
          <Typography color="text.secondary">
            We have found that you are eligible for the EB-3 Visa, now select
            your Employer and complete the form.
          </Typography>
        </Box>

        <VacancyList vacancyList={vacancy} />
      </Box>
    </DashboardContent>
  );
}
