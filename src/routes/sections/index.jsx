import { lazy, Suspense } from "react";

import { MainLayout } from "src/layouts/main";

import { SplashScreen } from "src/components/loading-screen";

import { authRoutes } from "./auth";
import { mainRoutes } from "./main";
import { dashboardRoutes } from "./dashboard";
import { onBoardingRoutes } from "./onboarding";

// ----------------------------------------------------------------------

const HomePage = lazy(() => import("src/pages/home"));
const Page404 = lazy(() => import("src/pages/error/404"));

export const routesSection = [
  {
    path: "/",
    /**
     * @skip homepage
     * import { Navigate } from "react-router";
     * import { CONFIG } from 'src/global-config';
     *
     * element: <Navigate to={CONFIG.auth.redirectPath} replace />,
     * and remove the element below:
     */
    element: (
      <Suspense fallback={<SplashScreen />}>
        <MainLayout>
          <HomePage />
        </MainLayout>
      </Suspense>
    ),
  },

  // Auth
  ...authRoutes,

  // Dashboard
  ...dashboardRoutes,

  // Main
  ...mainRoutes,

  //onBoarding
  ...onBoardingRoutes,

  // No match
  { path: "*", element: <Page404 /> },
];
