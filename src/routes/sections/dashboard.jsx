import { Outlet } from "react-router";
import { lazy, Suspense } from "react";

import { DashboardLayout } from "src/layouts/dashboard";

import { LoadingScreen } from "src/components/loading-screen";

import { AuthGuard } from "src/auth/guard";

import { usePathname } from "../hooks";

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import("src/pages/dashboard"));

const VacancyDetailPage = lazy(() =>
  import("src/pages/dashboard/vacancy/detail")
);

// Profile
const ProfilePage = lazy(() => import("src/pages/dashboard/profile/profile"));

// Employee
const EmployeeCreatePage = lazy(() =>
  import("src/pages/dashboard/employee/create")
);
const EmployeeListPage = lazy(() =>
  import("src/pages/dashboard/employee/list")
);
const EmployeeDetailPage = lazy(() =>
  import("src/pages/dashboard/employee/detail")
);
const EmployeeEditPage = lazy(() =>
  import("src/pages/dashboard/employee/edit")
);

// ----------------------------------------------------------------------

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const dashboardLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: "dashboard",
    element: <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      { index: true, element: <IndexPage /> },

      {
        path: "vacancy-detail",
        children: [{ path: ":id", element: <VacancyDetailPage /> }],
      },

      {
        path: "employee",
        children: [
          { index: true, element: <EmployeeListPage /> },
          { path: "create", element: <EmployeeCreatePage /> },
          { path: ":id", element: <EmployeeDetailPage /> },
          { path: ":id/edit", element: <EmployeeEditPage /> },
        ],
      },
    ],
  },
];
