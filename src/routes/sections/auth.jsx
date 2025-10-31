import { Outlet } from "react-router";
import { lazy, Suspense } from "react";

import { AuthCenteredLayout } from "src/layouts/auth-centered";

import { SplashScreen } from "src/components/loading-screen";

import { AuthGuard, GuestGuard } from "src/auth/guard";
import { FormCenteredLayout } from "src/layouts/auth-centered/form-layout";

// ----------------------------------------------------------------------

const SignInPage = lazy(() => import("src/pages/auth/sign-in"));
const SignUpPage = lazy(() => import("src/pages/auth/sign-up"));
const EligibilityPage = lazy(() =>
  import("src/pages/auth/eligibility-form/eligibility-form")
);

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: "auth",
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        path: "sign-in",
        element: (
          <GuestGuard>
            <AuthCenteredLayout
              slotProps={{
                section: { title: "Book an Appointment" },
              }}
            >
              <SignInPage />
            </AuthCenteredLayout>
          </GuestGuard>
        ),
      },
      {
        path: "sign-up",
        element: (
          <GuestGuard>
            <AuthCenteredLayout>
              <SignUpPage />
            </AuthCenteredLayout>
          </GuestGuard>
        ),
      },

      {
        path: "register-step-form",
        element: (
          <AuthGuard>
            <FormCenteredLayout>
              <EligibilityPage />
            </FormCenteredLayout>
          </AuthGuard>
        ),
      },
    ],
  },
];
