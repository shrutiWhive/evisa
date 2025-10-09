import { paths } from "src/routes/paths";

import { DashboardContent } from "src/layouts/dashboard";

import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

import { EmployeeNewEditForm } from "../employee-new-edit-form";

// ----------------------------------------------------------------------

export function EmployeeCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Add a new employee"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "Employee", href: paths.dashboard.employee.root },
          { name: "New Employee" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <EmployeeNewEditForm />
    </DashboardContent>
  );
}
