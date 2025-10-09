import { paths } from "src/routes/paths";

import { DashboardContent } from "src/layouts/dashboard";

import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

import { FormTemplateNewEditForm } from "../form-template-new-edit-form";

// ----------------------------------------------------------------------

export function FormTemplateCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new form template"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "Form Template", href: paths.dashboard.formTemplate.root },
          { name: "New form template" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <FormTemplateNewEditForm />
    </DashboardContent>
  );
}
