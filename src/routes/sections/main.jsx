import { Outlet } from "react-router";
import { lazy, Suspense } from "react";

import { MainLayout } from "src/layouts/main";

import { SplashScreen } from "src/components/loading-screen";
import { DashboardLayout } from "src/layouts/dashboard";

// ----------------------------------------------------------------------

const CampaignFormPage = lazy(() => import("src/pages/campaign/form"));

export const mainRoutes = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        element: (
          <MainLayout>
            <Outlet />
          </MainLayout>
        ),

        children: [
        
          {
            path: "campaign",
            children: [{ path: ":id/form", element: <CampaignFormPage /> }],
          },
        ],
      },
    ],
  },
];
