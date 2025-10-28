import Grid from "@mui/material/Grid2";
import { DashboardContent } from "src/layouts/dashboard";
import { Iconify } from "src/components/iconify";
import {
  Box,
  Step,
  StepButton,
  StepConnector,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
} from "@mui/material";
import { useGetVacancy } from "src/api/vacancy";
import { VacancyList } from "./vacancy-list";
import { useRouter } from "src/routes/hooks";
import { useState } from "react";
import { paths } from "src/routes/paths";

// ----------------------------------------------------------------------

const steps = [
  { label: "Eligibility", icon: "mdi:check-circle-outline" },
  { label: "Job Selection", icon: "mdi:briefcase-outline" },
  { label: "OnBoarding Form", icon: "mdi:file-document-outline" },
  { label: "Contract", icon: "mdi:file-document-outline" },
  { label: "Payment", icon: "mdi:credit-card-outline" },
  { label: "Visa wait", icon: "mdi:file-document-outline" },
];

export function AppView() {
  const theme = useTheme();
  const { vacancy } = useGetVacancy();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);

  const handleStepClick = (index, label) => {
    if (label === "Contract") {
      router.push(paths.dashboard.contract.root);
    }
    setActiveStep(index);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          p: { xs: 3, md: 6 },
        }}
      >
        {/* ✅ Stepper */}
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={
            <StepConnector
              sx={{
                "& .MuiStepConnector-line": {
                  borderColor: theme.palette.primary.main,
                  borderTopWidth: 2,
                },
              }}
            />
          }
          sx={{
            mb: 6,
            "& .MuiStepLabel-label": {
              color: theme.palette.text.secondary,
              fontSize: 14,
              fontWeight: 500,
              mt: 1,
            },
            "& .MuiStepLabel-label.Mui-active": {
              color: theme.palette.primary.dark,
              fontWeight: 600,
            },
            "& .MuiStepLabel-label.Mui-completed": {
              color: theme.palette.secondary.main,
            },
          }}
        >
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;

            return (
              <Step key={index} completed={isCompleted}>
                <StepLabel
                  onClick={() => handleStepClick(index, step.label)}
                  sx={{ cursor: "pointer", "&:hover": { opacity: 0.85 } }}
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: isActive
                          ? theme.palette.primary.main
                          : isCompleted
                          ? theme.palette.primary.light
                          : "transparent",
                        border:
                          !isActive && !isCompleted
                            ? `2px solid ${theme.palette.primary.main}`
                            : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s",
                      }}
                    >
                      {isCompleted ? (
                        <Iconify
                          icon="mdi:check"
                          width={22}
                          height={22}
                          color={theme.palette.common.white}
                        />
                      ) : (
                        <Iconify
                          icon={step.icon}
                          width={22}
                          height={22}
                          color={
                            isActive
                              ? theme.palette.common.white
                              : theme.palette.primary.main
                          }
                        />
                      )}
                    </Box>
                  )}
                >
                  {step.label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {/* ✅ Title Section */}
        <Box textAlign="center" mb={5}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "primary.dark", mb: 1 }}
          >
            Congrats, You are eligible for EB-3 Visa
          </Typography>
          <Typography color="text.secondary">
            We have found that you are eligible for the EB-3 Visa, now select
            your Employer and complete the form.
          </Typography>
        </Box>
        {/* ✅ Vacancy List
        <VacancyList vacancyList={vacancy} /> */}
      </Box>
    </DashboardContent>
  );
}
