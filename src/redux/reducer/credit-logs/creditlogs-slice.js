import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  creditlogs: [],
};

export const creditlogSlice = createSlice({
  name: "creditlogs",
  initialState,
  reducers: {
    fetchCreditLogsRequest: (state) => {
      state.isLoading = true;

      state.creditlogs = [];
    },

    fetchCreditLogsSuccess: (state, action) => {
      state.isLoading = false;

      state.creditlogs = action.payload;
    },

    fetchCreditLogsFailure: (state) => {
      state.isLoading = false;
    },
  },
});
