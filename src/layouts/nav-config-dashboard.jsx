import { paths } from "src/routes/paths";

import { SvgColor } from "src/components/svg-color";

// ----------------------------------------------------------------------

export const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} />
);

// export const formatNavData = (item) => ({
//   title: item.menu_name,
//   path: item.route,
//   icon: icon(item.icon),
//   children: item.children.length
//     ? [...item.children]
//         .sort((a, b) => a.position - b.position)
//         .map(formatNavData)
//     : null,
//   isactive: item.is_active,
// });

export const formatNavData = (item) => {
  if (!item.is_active) return null; // Skip inactive items

  const children = (item.children || [])
    .filter((child) => child.is_active) // Only active children
    .sort((a, b) => a.position - b.position)
    .map(formatNavData)
    .filter(Boolean); // Remove nulls from the map

  return {
    title: item.menu_name,
    path: item.route,
    icon: icon(item.icon),
    children: children.length ? children : null,
    isactive: item.is_active,
  };
};

const ICONS = {
  tour: icon("ic-tour"),
  file: icon("ic-file"),
  invoice: icon("ic-invoice"),
  dashboard: icon("ic-dashboard"),
  user: icon("ic-user"),
  appointment: icon("ic-job"),
  logs: icon("ic-logs"),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    items: [
      { title: "Dashboard", path: paths.dashboard.root, icon: ICONS.dashboard },
      {
        title: "Form Templates",
        path: paths.dashboard.formTemplate.root,
        icon: ICONS.file,
      },

      {
        title: "Campaigns",
        path: paths.dashboard.campaign.root,
        icon: ICONS.tour,
      },

      {
        title: "Transaction History",
        path: paths.dashboard.transaction.root,
        icon: ICONS.invoice,
      },

      {
        title: "Employee",
        path: paths.dashboard.employee.root,
        icon: ICONS.user,
      },

      {
        title: "Appointments",
        path: paths.dashboard.appointment.root,
        icon: ICONS.appointment,
        children: [
          { title: "Appointments", path: paths.dashboard.appointment.root },
          { title: "Categories", path: paths.dashboard.appointment.category },
          { title: "Time Slots", path: paths.dashboard.appointment.timeSlot },
        ],
      },
      {
        title: "Credit Logs",
        path: paths.dashboard.creditLogs.root,
        icon: ICONS.logs,
      },

      {
        title: "Attendance",
        path: paths.dashboard.attendance.root,
        icon: ICONS.appointment,
      },

      {
        title: "Reports",
        path: paths.dashboard.reports.root,
        icon: ICONS.appointment,
        children: [
          { title: "TeamReports", path: paths.dashboard.reports.root },
          {
            title: "TransactionReports",
            path: paths.dashboard.reports.transaction,
          },
          {
            title: "SMSReports",
            path: paths.dashboard.reports.smsReport,
          },
          {
            title: "TopupReports",
            path: paths.dashboard.reports.topup,
          },
          {
            title: "PackageReports",
            path: paths.dashboard.reports.packageReport,
          },
          {
            title: "CreditReports",
            path: paths.dashboard.reports.creditReport,
          },
        ],
      },
    ],
  },
];
