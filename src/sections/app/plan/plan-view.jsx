import {
  Box,
  Step,
  StepLabel,
  Stepper,
  Typography,
  StepConnector,
} from "@mui/material";
import { useGetPlan } from "src/api/plan";
import { PlanItem } from "./plan-item";
import { Iconify } from "src/components/iconify";
import { DashboardContent } from "src/layouts/dashboard";

export function PlanList() {
  const steps = [
    { label: "Onboarding", icon: "mdi:check-circle-outline" },
    { label: "Employer Selection", icon: "mdi:briefcase-outline" },
    { label: "Contract", icon: "mdi:file-document-outline" },
    { label: "Payment", icon: "mdi:credit-card-outline" },
  ];
  const { plan } = useGetPlan();
  return (
    <>
      {/* Stepper */}
      <Stepper
        alternativeLabel
        activeStep={1}
        connector={
          <StepConnector
            sx={{
              top: 20,
              left: "calc(-50% + 20px)",
              right: "calc(50% + 20px)",
              "& .MuiStepConnector-line": {
                borderColor: "#5DC8B9",
                borderTopWidth: 2,
              },
            }}
          />
        }
        sx={{
          mb: 6,
          "& .MuiStepLabel-label": {
            color: "#114B46",
            fontSize: 14,
            fontWeight: 500,
            mt: 1,
          },
          "& .MuiStepLabel-label.Mui-active": {
            color: "#2BA597",
            fontWeight: 600,
          },
          "& .MuiStepLabel-label.Mui-completed": {
            color: "#4F8E88",
          },
        }}
      >
        {steps.map((step, index) => (
          <Step key={index} completed={index < 1}>
            <StepLabel
              StepIconComponent={() => (
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor:
                      index === 1
                        ? "#2BA597"
                        : index < 1
                        ? "#5DC8B9"
                        : "#ffffff",
                    border: index > 1 ? "2px solid #2BA597" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 1,
                    transition: "all 0.3s ease",
                  }}
                >
                  {index < 1 ? (
                    <Iconify
                      icon="mdi:check"
                      width={22}
                      height={22}
                      color="#ffffff"
                    />
                  ) : (
                    <Iconify
                      icon={step.icon}
                      width={22}
                      height={22}
                      color={index === 1 ? "#ffffff" : "#2BA597"}
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

      <Box
        sx={{
          gap: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        {plan.map((job) => (
          <PlanItem
            key={job.id}
            job={job}
            // editHref={paths.dashboard.job.edit(job.id)}
            // detailsHref={paths.dashboard.job.details(job.id)}
            // onDelete={() => handleDelete(job.id)}
          />
        ))}
      </Box>
    </>
  );
}
