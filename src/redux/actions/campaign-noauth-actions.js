import { campaignNoAuthSlice } from "../reducer/campaign/campaign-noauth-slice";

export const {
  fetchCampaignDetailRequestNoAuth,
  fetchCampaignDetailSuccessNoAuth,
  fetchCampaignDetailFailureNoAuth,
} = campaignNoAuthSlice.actions;
