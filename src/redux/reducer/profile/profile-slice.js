import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  profile: {},
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    fetchProfileRequest: (state) => {
      state.isLoading = true;
    },

    fetchProfileSuccess: (state, action) => {
      state.isLoading = false;

      state.profile = action.payload;
    },

    fetchProfileFailure: (state) => {
      state.isLoading = false;
    },
    updateOrg: (state, action) => {
      state.profile = action.payload;

    },
  },
});
