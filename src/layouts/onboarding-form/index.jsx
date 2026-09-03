import { Box, Divider, Button, Stack, Typography } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { OnboardingHeader } from "src/components/onboarding/OnboardingHeader";
import { OnboardingSidebar } from "src/components/onboarding/OnboardingSidebar";
import { VacancyDetailsCard } from "src/components/onboarding/VacancyDetailsCard";
import { OnboardingStepRenderer } from "src/components/onboarding/OnboardingStepRenderer";
import { processingInformationSchema } from "src/components/onboarding/forms/ProcessingInformation";
import { mainApplicantSchema } from "src/components/onboarding/forms/MainApplicantDetails";
import { academicInformationSchema } from "src/components/onboarding/forms/AcademicInformation";
import { englishLanguageProficiencySchema } from "src/components/onboarding/forms/Englishlanguage";
import { pastWorkExperiencesSchema } from "src/components/onboarding/forms/PastWorkExperiences";
import { emergencyContactSchema } from "src/components/onboarding/forms/EmergencyContactInformation";
import { inadmissibilitySchema } from "src/components/onboarding/forms/Inadmissibility";
import { healthSchema } from "src/components/onboarding/forms/Health";
import { visaRejectionSchema } from "src/components/onboarding/forms/VisaRejection";
import { immigrationIncidentSchema } from "src/components/onboarding/forms/ImmigrationIncident";
import { criminalRecordSchema } from "src/components/onboarding/forms/CriminalRecords";

import { ONBOARDING_STEPS } from "src/constant/onboardingSteps";
import { useGetCountryCode, useGetEligibilityData } from "src/api";
import { useGetVacancyDetail } from "src/api/vacancy";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { fetchOnBoardingRequest, fetchProfileRequest } from "src/redux/actions";

// Import custom hooks
import { useOnboardingPersistence } from "src/hooks/useOnboardingPersistence";
import { useOnboardingFormData } from "src/hooks/useOnboardingFormData";
import { useOnboardingSave } from "src/hooks/useOnboardingSave";
import { useOnboardingNavigation } from "src/hooks/useOnboardingNavigation";
import { useGetStepDescription } from "src/api/onboardingform";

const COMPLETED_ONBOARDING_STATUSES = new Set([
  "completed",
  "complete",
  "filled",
  "submitted",
  "pending",
  "approved",
  "in review",
  "in_review",
]);

const isCompletedStatus = (status) =>
  COMPLETED_ONBOARDING_STATUSES.has(String(status || "").toLowerCase());

const hasCompletedOnboardingForm = (onBoarding) => {
  if (!onBoarding || Object.keys(onBoarding).length === 0) {
    return false;
  }

  if (
    [
      onBoarding.status,
      onBoarding.form_status,
      onBoarding.onboarding_status,
      onBoarding.onboarding_form_status,
    ].some(isCompletedStatus)
  ) {
    return true;
  }

  return Boolean(onBoarding.healthRecord);
};

const normalizeStepIdentifier = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function OnboardingLayout() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const { country } = useGetCountryCode();

  const selectedVacancyId = useAppSelector(
    (state) => state.vacancy.selectedVacancyId,
  );

  console.log("🔍 Vacancy ID:", { selectedVacancyId });

  // Fetch vacancy data
  const { vacancyDetail } = useGetVacancyDetail(selectedVacancyId);

  const { eligibilityData } = useGetEligibilityData();

  const { onBoarding } = useAppSelector(
    (state) => state.onBoarding || { onBoarding: {} },
  );

  const { steps } = useGetStepDescription();

  const { profile } = useAppSelector(
    (state) => state.profile || { profile: null },
  );

  // Use custom hooks for persistence
  const {
    currentStep,
    setCurrentStep,
    completedSteps,
    setCompletedSteps,
    isInitialized,
    clearPersistence,
  } = useOnboardingPersistence(profile);

  // Clamp currentStep to valid range (0 to ONBOARDING_STEPS.length - 1)
  useEffect(() => {
    if (currentStep >= ONBOARDING_STEPS.length) {
      setCurrentStep(ONBOARDING_STEPS.length - 1);
    } else if (currentStep < 0) {
      setCurrentStep(0);
    }
  }, [currentStep, setCurrentStep]);

  const stepSchemas = [
    processingInformationSchema,
    mainApplicantSchema,
    academicInformationSchema,
    pastWorkExperiencesSchema,
    englishLanguageProficiencySchema,
    emergencyContactSchema,
    visaRejectionSchema,
    immigrationIncidentSchema,
    criminalRecordSchema,
    inadmissibilitySchema,
    healthSchema,
  ];

  const methods = useForm({
    resolver: zodResolver(stepSchemas[currentStep]),
    defaultValues: {
      //processing information
      adjustment_of_status: true,
      date_of_last_entry: "",
      i944_number: "",
      embassy_country_id: "",
      embassy_name: "",
      embassy_location: "",

      //main applicant
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      gender: "",
      countryOfBirth: "",
      citizenship1: "",
      citizenship2: "",

      //current address
      country: "",
      state: "",
      city: "",
      zipCode: "",
      address: "",

      //contact details
      email: "",
      phone: "",

      //marital status
      maritalStatus: "",
      clarifyMaritalStatus: "",
      countryOfMarriage: "",
      dateOfMarriage: "",

      //academic information
      hasFormalEducation: false,
      highSchool: "No",
      bachelor: "No",
      postgraduate: "No",
      master: "No",
      phd: "No",

      //english language
      writing: "",
      listening: "",
      reading: "",
      speaking: "",

      //pastwork experience
      has_work_experience: "No",
      work_experiences: [],

      //dependent
      has_dependents: "No",
      dependents: [],

      //emergency contact
      emergencyFirstName: "",
      emergencyMiddleName: "",
      emergencyLastName: "",
      emergencyPhone: "",
      degreeOfKinship: "",
      degreeOfKinshipOther: "",
      emergencyAddress: "",

      //immigration history
      hasImmigrationHistory: false,
      types: "",
      beenToUsa: "No",
      socialSecurity: "No",
      socialSecurityNumber: "",
      inUsaApplicant: "No",
      applicantName: "",
      inUsaDependent: "No",
      dependentName: "",
      i94Number: "",

      //visa
      has_visa_records: "No",
      visa_records: [],

      //visa rejection
      employee_visa_rejected: "No",
      employee_fullname: "",
      employee_visa_type: "",
      employee_rejection_reason: "",
      employee_rejection_date: "",
      dependents_visa_rejected: "No",
      dependent_fullname: "",
      dependent_visa_type: "",
      dependent_rejection_reason: "",
      dependent_rejection_date: "",

      //immigration incident
      e_overstayed_usa_visa_i94_employee: "no",
      e_overstayed_usa_visa_i94_employee_if_yes_who: "",
      e_overstayed_usa_visa_i94_dependents: "no",
      e_overstayed_usa_visa_i94_dependents_if_yes_who: "",
      eb_unlawfully_present_usa_employee: "no",
      eb_unlawfully_present_usa_employee_if_yes_who: "",
      eb_unlawfully_present_usa_dependents: "no",
      eb_unlawfully_present_usa_dependents_if_yes_who: "",
      eb_denied_entry_usa_employee: "no",
      eb_denied_entry_usa_employee_if_yes: "",
      eb_denied_entry_usa_dependents: "no",
      eb_denied_entry_usa_dependents_if_yes: "",
      eb_deported_from_any_country_employee: "no",
      eb_deported_from_any_country_employee_if_yes: "",
      eb_deported_from_any_country_dependents: "no",
      eb_deported_from_any_country_dependents_if_yes: "",
      ebb_imr_judge_h_ofcr_employee: "no",
      ebb_imr_judge_h_ofcr_employee_if_yes: "",
      ebb_imr_judge_h_ofcr_dependents: "no",
      ebb_imr_judge_h_ofcr_dependents_if_yes: "",

      //criminal records
      criminal_record_employee: "No",
      criminal_record_dependents: "No",
      criminal_records: [],

      //inadmissibility
      has_inadmissibility: "No",
      inadmissibility_records: [],

      //health
      hasSTD: "no",
      hasStdDependent: "no",
      hasTb: "no",
      hasTbDependent: "no",
      hasInsurance: "no",
      hasInsuranceDependent: "no",
      agree_to_terms: false,
    },
    mode: "onChange",
  });

  const currentStepDescription = useMemo(() => {
    const currentStepName = ONBOARDING_STEPS[currentStep]?.label;
    const currentStepIdentifier = normalizeStepIdentifier(currentStepName);

    return (
      steps.find((step) => {
        if (step.is_active === 0) {
          return false;
        }

        return [step.name, step.slug].some(
          (identifier) =>
            normalizeStepIdentifier(identifier) === currentStepIdentifier,
        );
      })?.description || ""
    );
  }, [currentStep, steps]);

  useEffect(() => {
    dispatch(fetchProfileRequest());
    dispatch(fetchOnBoardingRequest());
  }, [dispatch]);

  // Use custom hook to populate form data
  useOnboardingFormData(methods, profile, onBoarding, eligibilityData);

  useEffect(() => {
    if (!isInitialized || !hasCompletedOnboardingForm(onBoarding)) {
      return;
    }

    const allStepIndexes = ONBOARDING_STEPS.map((_, index) => index);
    const hasAllStepsCompleted = allStepIndexes.every((stepIndex) =>
      completedSteps.has(stepIndex),
    );

    if (!hasAllStepsCompleted) {
      setCompletedSteps(new Set(allStepIndexes));
      setCurrentStep(0);
    }
  }, [
    completedSteps,
    isInitialized,
    onBoarding,
    setCompletedSteps,
    setCurrentStep,
  ]);

  // Use custom hook to save step data
  const { saveCurrentStepData } = useOnboardingSave(
    methods,
    profile,
    dispatch,
    fetchOnBoardingRequest,
    selectedVacancyId,
  );

  const { handleSubmit } = methods;

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const oncloseLayout = () => {
    router.push(paths.dashboard.root);
  };

  const onSubmit = (data) => {
    console.log("✅ Final Submission:", data);
  };

  // Use custom hook for navigation
  const { goNext, goPrev, handleSidebarNavigation } = useOnboardingNavigation(
    currentStep,
    setCurrentStep,
    completedSteps,
    setCompletedSteps,
    methods,
    saveCurrentStepData,
    clearPersistence,
    handleSubmit,
    onSubmit,
  );

  // Guard: Don't render if currentStep is invalid
  if (
    !isInitialized ||
    currentStep === undefined ||
    currentStep < 0 ||
    currentStep >= ONBOARDING_STEPS.length
  ) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography>Loading onboarding form...</Typography>
      </Box>
    );
  }

  return (
    <FormProvider {...methods}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        <OnboardingHeader
          onMenuClick={handleDrawerToggle}
          onClose={oncloseLayout}
        />

        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <OnboardingSidebar
            mobileOpen={mobileOpen}
            onClose={handleDrawerToggle}
            onItemClick={handleSidebarNavigation}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />

          <Box
            component="form"
            sx={{
              flexGrow: 1,
              p: { xs: 2, md: 4 },
              backgroundColor: (theme) => theme.palette.grey[100],
              color: (theme) => theme.palette.primary.contrastText,
              overflowY: "auto",
              maxHeight: "calc(100vh - 64px)",
            }}
          >
            {/* Vacancy Details Card - Shown on all steps */}
            <VacancyDetailsCard vacancyDetail={vacancyDetail} />

            <Box
              sx={{
                backgroundColor: "primary.main",
                borderRadius: 2,
                p: 4,
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: currentStepDescription ? 1 : 3,
                  fontWeight: 600,
                  textAlign: "center",
                  color: "primary.contrastText",
                }}
              >
                {ONBOARDING_STEPS[currentStep]?.label || "Loading..."}
              </Typography>

              {currentStepDescription && (
                <Box
                  sx={{
                    mb: 3,
                    mx: "auto",
                    maxWidth: 760,
                    color: "rgba(255,255,255,0.78)",
                    textAlign: "center",
                    typography: "body2",
                    "& p": { m: 0 },
                  }}
                  dangerouslySetInnerHTML={{ __html: currentStepDescription }}
                />
              )}

              <OnboardingStepRenderer
                currentStep={currentStep}
                vacancyDetail={vacancyDetail}
                country={country}
                selectedVacancyId={selectedVacancyId}
                dependents={onBoarding?.dependents || []}
              />

              <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", my: 4 }} />

              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mt: 2 }}
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  disabled={currentStep === 0}
                  onClick={goPrev}
                >
                  Previous
                </Button>

                <Button variant="contained" color="secondary" onClick={goNext}>
                  {currentStep === ONBOARDING_STEPS.length - 1
                    ? "Submit"
                    : "Next"}
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
}
