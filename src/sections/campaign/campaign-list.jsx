import { Box, Pagination, paginationClasses } from "@mui/material";

import { paths } from "src/routes/paths";

import { CampaignItemSkeleton } from "./campaign-skeleton";
import { CampaignItem } from "./campaign-item";
import { RouterLink } from "src/routes/components";

// ----------------------------------------------------------------------

export function CampaignList({ campaigns, loading }) {
  const renderLoading = () => <CampaignItemSkeleton />;
  const newCampaignBoxHeight = campaigns.length === 0 ? 170 : "auto";
  const renderList = () => [
    <Box
      key="add-template"
      component={RouterLink}
      href={paths.dashboard.campaign.create}
      sx={{
        height: newCampaignBoxHeight,
        border: "2px dashed",
        borderColor: "primary.main",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        color: "primary.main",
        typography: "subtitle1",
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
      // onClick={() => {
      //   window.location.href = paths.dashboard.formTemplate.create;
      // }}
    >
      + New Campaign
    </Box>,
    campaigns.map((campaign, index) => (
      <CampaignItem
        key={campaign.id}
        campaign={campaign}
        index={index}
        // sx={{
        //   backgroundColor: index % 3 ? "#fbe9e7" : "#eceff1",
        // }}
        detailsHref={paths.dashboard.campaign.detail(campaign.id)}
        editHref={paths.dashboard.campaign.edit(campaign.id)}
        leadNurturing={paths.dashboard.campaign.leadDetails(campaign.id)}
      />
    )),
  ];
  return (
    <>
      <Box
        sx={{
          gap: 3,
          display: "grid",
          gridTemplateColumns: { xs: "repeat(1, 1fr)", md: "repeat(2, 1fr)" },
        }}
      >
        {loading ? renderLoading() : renderList()}
      </Box>

      {/* {campaigns.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: "center" },
          }}
        />
      )} */}
    </>
  );
}
