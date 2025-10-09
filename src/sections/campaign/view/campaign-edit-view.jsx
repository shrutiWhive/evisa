import { paths } from "src/routes/paths";

import { DashboardContent } from "src/layouts/dashboard";

import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

import { useGetCampaignDetail } from "src/api";

import { CampaignNewEditForm } from "../campaign-new-edit-form";

// ----------------------------------------------------------------------

export function CampaignEditView({ id }) {
  const { campaign } = useGetCampaignDetail(id);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "Campaign", href: paths.dashboard.campaign.root },
          { name: campaign?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CampaignNewEditForm currentCampaign={campaign} />
    </DashboardContent>
  );
}
