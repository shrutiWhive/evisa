import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  siteSetting: {},
};

export const siteSettingSlice = createSlice({
  name: "siteSetting",
  initialState,
  reducers: {
    fetchSiteSettingRequest: (state) => {
      state.isLoading = true;
    },

    fetchSiteSettingSuccess: (state, action) => {
      state.isLoading = false;

      state.siteSetting = action.payload;
    },

    fetchSiteSettingFailure: (state) => {
      state.isLoading = false;
    },
  },
});
