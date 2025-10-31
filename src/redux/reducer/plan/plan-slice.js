import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  financePlan: [],
};

export const planSlice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    fetchFinancePlanRequest: (state) => {
      state.isLoading = true;
    },

    fetchFinancePlanSuccess: (state, action) => {
      state.isLoading = false;

      state.financePlan = action.payload;
    },

    fetchFinancePlanFailure: (state) => {
      state.isLoading = false;
    },
    
  },
});
