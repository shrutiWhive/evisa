import OnboardingLayout from "src/layouts/onboarding-form";
import { Step1Page } from "src/pages/onboarding-form/step1";
import { Step2Page } from "src/pages/onboarding-form/step2";

export const onBoardingRoutes = [
  {
    element: <OnboardingLayout />,
    children: [
      { path: "apply", element: <Step1Page /> },
      { path: "apply/step2", element: <Step2Page /> },
      // add more steps here
    ],
  },
];
