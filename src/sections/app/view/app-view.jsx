import Grid from "@mui/material/Grid2";

import { DashboardContent } from "src/layouts/dashboard";
import { SeoIllustration } from "src/assets/illustrations";

import { AppWelcome } from "../app-welcome";
import { AppWidgetSummary } from "../app-widget-summary";
import { Iconify } from "src/components/iconify";
import { Box, Step, StepLabel, Stepper } from "@mui/material";

// ----------------------------------------------------------------------

export const STATIC_SLIDES = [
  {
    id: 1,
    title: "Smart Enrolls",
    coverUrl:
      "https://cdn.corporatefinanceinstitute.com/assets/smart-goal-1.jpeg",
    description: "This is a mock description.",
  },
  {
    id: 2,
    title: "Smart Pipeline",
    coverUrl:
      "https://cdn.corporatefinanceinstitute.com/assets/smart-goal-1.jpeg",
    description: "This is a mock description.",
  },
  {
    id: 3,
    title: "Leads Enrollment",
    coverUrl:
      "https://cdn.corporatefinanceinstitute.com/assets/smart-goal-1.jpeg",
    description: "This is a mock description.",
  },
];

const steps = [
  { label: "Onboarding", icon: "mdi:check-circle-outline" },
  { label: "Employer Selection", icon: "mdi:briefcase-outline" },
  { label: "Contract", icon: "mdi:file-document-outline" },
  { label: "Payment", icon: "mdi:credit-card-outline" },
];

export function AppView() {
  return (
    <DashboardContent maxWidth="xl">
      {/* <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <AppWelcome
            title={`Welcome back 👋 \n EB3 Visa`}
            img={<SeoIllustration hideBackground />}
          />
        </Grid>
      </Grid> */}

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
      </Box>
    </DashboardContent>
  );
}
