import { useEffect } from "react";

import { paths } from "src/routes/paths";

import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { selectFormTemplateState } from "src/redux/selectors";
import { fetchFormTemplateDetailRequest } from "src/redux/actions";

import { DashboardContent } from "src/layouts/dashboard";

import { FormTemplateDetailToolbar } from "../form-template-detail-toolbar";
import { FormTemplateDetail } from "../form-template-detail";
import { FormTemplateDetailSkeleton } from "../form-template-skeleton";

export function FormTemplateDetailView({ id }) {
  const dispatch = useAppDispatch();

  const { formTemplateDetail, isLoading } = useAppSelector(
    selectFormTemplateState
  );
  const { name, description, is_active, created_at, fields, featured_image } =
    formTemplateDetail;

  useEffect(() => {
    dispatch(fetchFormTemplateDetailRequest(id));
  }, [dispatch, id]);

  const renderLoading = () => <FormTemplateDetailSkeleton />;

  const renderFormDetail = () => (
    <>
      <FormTemplateDetailToolbar
        status={is_active ? "Active" : "Inactive"}
        createdAt={created_at}
        name={name}
        backHref={paths.dashboard.formTemplate.root}
        editHref={paths.dashboard.formTemplate.edit(id)}
      />

      <FormTemplateDetail description={description} fields={fields || []} featuredImage ={featured_image} />
    </>
  );

  return (
    <DashboardContent>
      {isLoading ? renderLoading() : renderFormDetail()}
    </DashboardContent>
  );
}
