import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  campaignDetail: {},
  error: false,
};

export const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    fetchCampaignDetailRequest: (state) => {
      state.isLoading = true;

      state.campaignDetail = {};

      state.error = false;
    },

    fetchCampaignDetailSuccess: (state, action) => {
      state.isLoading = false;

      state.campaignDetail = action.payload;
    },

    fetchCampaignDetailFailure: (state) => {
      state.isLoading = false;

      state.campaignDetail = {};

      state.error = true;
    },
  },
});
