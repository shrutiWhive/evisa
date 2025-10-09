import { useEffect } from "react";

import { Stack } from "@mui/material";

import { paths } from "src/routes/paths";

import { DashboardContent } from "src/layouts/dashboard";

import { useAppDispatch } from "src/redux/hooks";
import { fetchFormTemplateDetailRequest } from "src/redux/actions";

import { useGetCampaignDetail } from "src/api";

import { CampaignDetailToolbar } from "../campaign-detail-toolbar";
import { CampaignDetailSummary } from "../campaign-detail-summary";
import { CampaignDetailSkeleton } from "../campaign-skeleton";

export function CampaignDetailView({ id }) {
  const dispatch = useAppDispatch();

  const { campaign, campaignLoading } = useGetCampaignDetail(id);

  const { name, is_active, created_at, leads, form_template_id } = campaign;

  useEffect(() => {
    if (!form_template_id) return;

    dispatch(fetchFormTemplateDetailRequest(form_template_id));
  }, [dispatch, form_template_id]);

  const renderLoading = () => <CampaignDetailSkeleton />;

  const renderCampaignDetail = () => (
    <>
      <CampaignDetailToolbar
        status={is_active ? "Active" : "Inactive"}
        createdAt={created_at}
        name={name}
        backHref={paths.dashboard.campaign.root}
        editHref={paths.dashboard.campaign.edit(id)}
        campaignId={id}
      />

      <Stack spacing={3}>
        <CampaignDetailSummary campaign={campaign} />
      </Stack>
    </>
  );

  return (
    <DashboardContent>
      {campaignLoading ? renderLoading() : renderCampaignDetail()}
    </DashboardContent>
  );
}
