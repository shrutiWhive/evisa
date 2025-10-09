import { useEffect } from "react";

import { paths } from "src/routes/paths";

import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { selectFormTemplateState } from "src/redux/selectors";
import { fetchFormTemplateDetailRequest } from "src/redux/actions";

import { DashboardContent } from "src/layouts/dashboard";

import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

import { FormTemplateNewEditForm } from "../form-template-new-edit-form";

export function FormTemplateEditView({ id }) {
  const dispatch = useAppDispatch();

  const { formTemplateDetail } = useAppSelector(selectFormTemplateState);

  useEffect(() => {
    dispatch(fetchFormTemplateDetailRequest(id));
  }, [dispatch, id]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.formTemplate.root}
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "Form Template", href: paths.dashboard.formTemplate.root },
          { name: formTemplateDetail?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <FormTemplateNewEditForm currentFormTemplate={formTemplateDetail} />
    </DashboardContent>
  );
}
