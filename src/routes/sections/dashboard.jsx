import { Outlet } from "react-router";
import { lazy, Suspense } from "react";

import { DashboardLayout } from "src/layouts/dashboard";

import { LoadingScreen } from "src/components/loading-screen";

import { AuthGuard } from "src/auth/guard";

import { usePathname } from "../hooks";

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import("src/pages/dashboard"));

// Campaign
const CampaignCreatePage = lazy(() =>
  import("src/pages/dashboard/campaign/create")
);
const CampaignListPage = lazy(() =>
  import("src/pages/dashboard/campaign/list")
);
const CampaignDetailPage = lazy(() =>
  import("src/pages/dashboard/campaign/detail")
);
const CampaignEditPage = lazy(() =>
  import("src/pages/dashboard/campaign/edit")
);
const CampaignLeadDetailLeadsPage = lazy(() =>
  import("src/pages/dashboard/campaign/leads")
);

// Form Template

const FormTemplateCreatePage = lazy(() =>
  import("src/pages/dashboard/form-template/create")
);
const FormTemplateListPage = lazy(() =>
  import("src/pages/dashboard/form-template/list")
);
const FormTemplateDetailPage = lazy(() =>
  import("src/pages/dashboard/form-template/detail")
);
const FormTemplateEditPage = lazy(() =>
  import("src/pages/dashboard/form-template/edit")
);

// Profile
const ProfilePage = lazy(() => import("src/pages/dashboard/profile/profile"));

// Profile
const TransactionListPage = lazy(() =>
  import("src/pages/dashboard/transaction/list")
);

const LeadDetailPage = lazy(() => import("src/pages/lead/lead"));

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

// Appointment
const AppointmentListPage = lazy(() =>
  import("src/pages/dashboard/appointment/list")
);

// Appointment Category
const AppointmentCategoryListPage = lazy(() =>
  import("src/pages/dashboard/appointment-category/list")
);

// Appointment Time Slot
const AppointmentTimeSlotListPage = lazy(() =>
  import("src/pages/dashboard/appointment-time-slot/list")
);

//Credit Logs
const CreditLogsListPage = lazy(() =>
  import("src/pages/dashboard/credit-logs/list")
);

// Attendance
const AttendanceListPage = lazy(() =>
  import("src/pages/dashboard/attendance/list")
);

// TeamReport
const TeamReportListPage = lazy(() =>
  import("src/pages/dashboard/team-report/list")
);
// TransactionReport
const TransactionReportListPage = lazy(() =>
  import("src/pages/dashboard/transaction-report/list")
);

// SMS Report
const SmsReportListPage = lazy(() =>
  import("src/pages/dashboard/sms-report/list")
);

// Topup Report
const TopupReportListPage = lazy(() =>
  import("src/pages/dashboard/topup-report/list")
);

// Package Report
const PackageReportListPage = lazy(() =>
  import("src/pages/dashboard/package-report/list")
);

// Credit Report
const CreditReportListPage = lazy(() =>
  import("src/pages/dashboard/credit-report/list")
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
        path: "campaign",
        children: [
          { index: true, element: <CampaignListPage /> },
          { path: "create", element: <CampaignCreatePage /> },
          { path: ":id", element: <CampaignDetailPage /> },
          { path: ":id/edit", element: <CampaignEditPage /> },
          { path: ":id/leads", element: <CampaignLeadDetailLeadsPage /> },
        ],
      },

      {
        path: "form-template",
        children: [
          { index: true, element: <FormTemplateListPage /> },
          { path: "create", element: <FormTemplateCreatePage /> },
          { path: ":id", element: <FormTemplateDetailPage /> },
          { path: ":id/edit", element: <FormTemplateEditPage /> },
        ],
      },

      { path: "transaction", element: <TransactionListPage /> },

      { path: "profile", element: <ProfilePage /> },

      { path: "lead-detail/:id", element: <LeadDetailPage /> },

      {
        path: "employee",
        children: [
          { index: true, element: <EmployeeListPage /> },
          { path: "create", element: <EmployeeCreatePage /> },
          { path: ":id", element: <EmployeeDetailPage /> },
          { path: ":id/edit", element: <EmployeeEditPage /> },
        ],
      },

      {
        path: "appointment",
        children: [
          { index: true, element: <AppointmentListPage /> },
          { path: "category", element: <AppointmentCategoryListPage /> },
          { path: "time-slot", element: <AppointmentTimeSlotListPage /> },
        ],
      },

      {
        path: "credit-logs",
        children: [{ index: true, element: <CreditLogsListPage /> }],
      },

      {
        path: "attendance-report",
        children: [{ index: true, element: <AttendanceListPage /> }],
      },

      {
        path: "reports",
        children: [
          // { index: true, element: <TeamReportListPage /> },
          { index: true, path: "team-report", element: <TeamReportListPage /> },
          {
            path: "transaction-report",
            element: <TransactionReportListPage />,
          },
          { path: "sms-report", element: <SmsReportListPage /> },
          { path: "topup-report", element: <TopupReportListPage /> },
          { path: "package-report", element: <PackageReportListPage /> },
          { path: "credit-report", element: <CreditReportListPage /> },
        ],
      },
    ],
  },
];
