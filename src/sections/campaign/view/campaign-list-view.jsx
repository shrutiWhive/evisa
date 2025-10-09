import { useCallback } from "react";
import { useSetState, useBoolean } from "minimal-shared/hooks";

import {
  Tab,
  Tabs,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { DashboardContent } from "src/layouts/dashboard";

import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { EmptyContent } from "src/components/empty-content";

import { CampaignList } from "../campaign-list";
import { CampaignFiltersResult } from "../campaign-filters-result";
import { CampaignQRCode } from "../campaign-qr-code";

import { useGetCampaigns } from "src/api";

// ----------------------------------------------------------------------

export function CampaignListView() {
  const filters = useSetState({ name: "", status: "all" });

  const openQRCodeDialog = useBoolean();

  const { campaigns, campaignsLoading } = useGetCampaigns();

  const { state: currentFilters, setState: updateFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: campaigns,
    filters: currentFilters,
  });

  const canReset = !!currentFilters.name || currentFilters.status !== "all";

  const notFound = !dataFiltered.length && canReset;

  const handleFilterName = useCallback(
    (event) => {
      updateFilters({ name: event.target.value });
    },
    [updateFilters]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      updateFilters({ status: newValue });
    },
    [updateFilters]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Campaign", href: paths.dashboard.campaign.root },
            { name: "List" },
          ]}
          // action={
          //   <Button
          //     component={RouterLink}
          //     href={paths.dashboard.campaign.create}
          //     variant="contained"
          //     startIcon={<Iconify icon="mingcute:add-line" />}
          //   >
          //     Create campaign
          //   </Button>
          // }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: { xs: 3, md: 5 },
          }}
        >
          <Tabs value={currentFilters.status} onChange={handleFilterStatus}>
            {["all", "active", "inactive"].map((tab) => (
              <Tab
                key={tab}
                iconPosition="end"
                value={tab}
                label={tab}
                icon={
                  <Label
                    variant={
                      ((tab === "all" || tab === currentFilters.status) &&
                        "filled") ||
                      "soft"
                    }
                    color={
                      (tab === "active" && "success") ||
                      (tab === "inactive" && "error") ||
                      "default"
                    }
                  >
                    {tab === "all" && campaigns.length}
                    {tab === "active" &&
                      campaigns.filter((post) => post.is_active === 1).length}
                    {tab === "inactive" &&
                      campaigns.filter((post) => post.is_active !== 1).length}
                  </Label>
                }
                sx={{ textTransform: "capitalize" }}
              />
            ))}
          </Tabs>

          <TextField
            value={currentFilters.name}
            onChange={handleFilterName}
            placeholder="Search campaign ..."
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Iconify
                      icon="eva:search-fill"
                      sx={{ color: "text.disabled" }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {canReset && (
          <CampaignFiltersResult
            filters={filters}
            totalResults={dataFiltered.length}
            sx={{ mb: { xs: 3, md: 5 } }}
          />
        )}

        {notFound && <EmptyContent filled sx={{ py: 10 }} />}

        <CampaignList campaigns={dataFiltered} loading={campaignsLoading} />
      </DashboardContent>

      {/* <Dialog
        fullWidth
        maxWidth="xs"
        open={openQRCodeDialog.value}
        onClose={openQRCodeDialog.onFalse}
      ></Dialog> */}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters }) {
  const { name, status } = filters;

  if (name) {
    inputData = inputData.filter((campaign) =>
      campaign.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== "all") {
    const isActive = status === "active" ? 1 : 0;

    inputData = inputData.filter((campaign) => campaign.is_active === isActive);
  }

  return inputData;
}
