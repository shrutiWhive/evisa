import Grid from "@mui/material/Grid2";

import { DashboardContent } from "src/layouts/dashboard";
import { SeoIllustration } from "src/assets/illustrations";

import { useGetAppData } from "src/api";

import { AppWelcome } from "../app-welcome";
import { AppWidgetSummary } from "../app-widget-summary";
import { AppCarousel } from "../app-carousel";
import { getUserToken } from "src/lib/apollo/utils";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import CountdownTimer from "src/components/count-timer";
import { paths } from "src/routes/paths";

// ----------------------------------------------------------------------

export const STATIC_SLIDES = [
  {
    id: 1,
    title: "Smart Enrolls",
    coverUrl:
      "https://cdn.corporatefinanceinstitute.com/assets/smart-goal-1.jpeg",
    description: "This is a mock description.",
  },
  {
    id: 2,
    title: "Smart Pipeline",
    coverUrl:
      "https://cdn.corporatefinanceinstitute.com/assets/smart-goal-1.jpeg",
    description: "This is a mock description.",
  },
  {
    id: 3,
    title: "Leads Enrollment",
    coverUrl:
      "https://cdn.corporatefinanceinstitute.com/assets/smart-goal-1.jpeg",
    description: "This is a mock description.",
  },
];

export function AppView() {
  const token = getUserToken();

  const { app } = useGetAppData(token);
  const campaigns = app.current_campaigns || [];

  const [selectedCampaignId, setSelectedCampaign] = useState("");

  useEffect(() => {
    if (campaigns.length > 0 && !selectedCampaignId) {
      setSelectedCampaign(campaigns[0].id);
    }
  }, [campaigns, selectedCampaignId]);

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId);

  let totalDuration = 0;
  let formattedStartDate = "";
  let formattedEndDate = "";

  if (selectedCampaign) {
    const startDate = new Date(selectedCampaign.start_date.replace(" ", "T"));
    const endDate = new Date(selectedCampaign.end_date.replace(" ", "T"));

    const isStartValid = !isNaN(startDate.getTime());
    const isEndValid = !isNaN(endDate.getTime());

    if (isStartValid && isEndValid) {
      totalDuration = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      formattedStartDate = dayjs(
        selectedCampaign.start_date.replace(" ", "T")
      ).format("MMMM D, YYYY");
      formattedEndDate = dayjs(
        selectedCampaign.end_date.replace(" ", "T")
      ).format("MMMM D, YYYY");
    } else {
      totalDuration = 0;
      formattedStartDate = "Invalid Date";
      formattedEndDate = "Invalid Date";
    }
  }

  const {
    balance,
    total_campaigns,
    total_leads,
    total_form_templates,
    total_users,
    total_rewarded,
    total_leads_today,
    sliders = [],
  } = app || {};
  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <AppWelcome
            title={`Welcome back 👋 \n Smart Enrolls`}
            img={<SeoIllustration hideBackground />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AppCarousel data={sliders} />
        </Grid>
      </Grid>
      {campaigns.length === 0 ? (
        <Box
          sx={{
            mt: 5,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <SeoIllustration sx={{ maxWidth: 360 }} />
          <Box>
            <Typography variant="h5" gutterBottom>
              No Campaigns Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create a campaign to view statistics and manage leads.
            </Typography>
          </Box>
          <Button
            variant="contained"
             href={paths.dashboard.campaign.create}
            sx={{ mt: 2 }}
          >
            Create Campaign
          </Button>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2,
              width: "100%",
            }}
          >
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Select Campaign</InputLabel>
              <Select
                labelId="campaign-select-label"
                value={selectedCampaignId}
                label="Select Campaign"
                onChange={(e) => setSelectedCampaign(e.target.value)}
              >
                {campaigns.length === 0 && (
                  <MenuItem value="" disabled>
                    No campaigns found
                  </MenuItem>
                )}
                {campaigns.map(({ id, name }) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {selectedCampaign && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <AppWidgetSummary
                  title="Total Active Campaigns"
                  total={campaigns.length || 0}
                  color="success"
                  icon="solar:sale-bold"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <AppWidgetSummary
                  title="Total Leads"
                  total={selectedCampaign.total_leads || 0}
                  color="info"
                  icon="mdi:briefcase-person-outline"
                />
              </Grid>

              {/* <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <AppWidgetSummary
              title="Total Users"
              total={total_users || 0}
              color="warning"
              icon="solar:sale-bold"
            />
          </Grid> */}

              {/* <Grid size={{ xs: 12, sm: 6, md: 3 }}>
           <AppWidgetSummary
             title="Balance"
             total={balance || 0}
             color="secondary"
             icon="solar:sale-bold"
           />
         </Grid> */}

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <AppWidgetSummary
                  title="Total Credit Rewarded"
                  total={selectedCampaign?.rewarded_amount || 0}
                  color="warning"
                  icon="mdi:wallet-giftcard"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <AppWidgetSummary
                  title="Total rewarded Leads"
                  total={selectedCampaign?.total_rewarded_leads || 0}
                  color="error"
                  icon="mdi:gift"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <AppWidgetSummary
                  title="Total Duration"
                  total={totalDuration}
                  color="primary"
                  icon="mdi:calendar-month"
                  date={`${formattedStartDate} - ${formattedEndDate}`}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <AppWidgetSummary
                  title="Remaining Time"
                  days={`${Math.floor(
                    selectedCampaign.remaining_time / (3600 * 24)
                  )}d`}
                  color="secondary"
                  icon="mdi:timer-alert-outline"
                  date={
                    <CountdownTimer seconds={selectedCampaign.remaining_time} />
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <AppWidgetSummary
                  title="Total converted Leads"
                  total={selectedCampaign?.total_converted_leads || 0}
                  color="error"
                  icon="solar:sale-bold"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <AppWidgetSummary
                  title="Total lost Leads"
                  total={selectedCampaign?.total_lost_leads || 0}
                  color="error"
                  icon="mdi:close-octagon-outline"
                />
              </Grid>
            </Grid>
          )}
        </>
      )}
    </DashboardContent>
  );
}
