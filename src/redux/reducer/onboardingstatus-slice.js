import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  onBoarding: {},
};

export const onBoardingSlice = createSlice({
  name: "onBoarding",
  initialState,
  reducers: {
    fetchOnBoardingRequest: (state) => {
      state.isLoading = true;
    },

    fetchOnBoardingSuccess: (state, action) => {
      state.isLoading = false;

      state.onBoarding = action.payload;
    },

    fetchOnBoardingFailure: (state) => {
      state.isLoading = false;
    },
  },
});
