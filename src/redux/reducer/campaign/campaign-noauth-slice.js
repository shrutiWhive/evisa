import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  campaignDetailNoAuth: {},
  error: false,
};

export const campaignNoAuthSlice = createSlice({
  name: "campaignnoauth",
  initialState,
  reducers: {
    fetchCampaignDetailRequestNoAuth: (state) => {
      state.isLoading = true;

      state.campaignDetailNoAuth = {};

      state.error = false;
    },

    fetchCampaignDetailSuccessNoAuth: (state, action) => {
      state.isLoading = false;

      state.campaignDetailNoAuth = action.payload;
    },

    fetchCampaignDetailFailureNoAuth: (state) => {
      state.isLoading = false;

      state.campaignDetailNoAuth = {};

      state.error = true;
    },
  },
});
