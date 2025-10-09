import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  appointmentCategories: [],
};

export const appointmentCategorySlice = createSlice({
  name: "appointmentCategory",
  initialState,
  reducers: {
    fetchAppointmentCategoriesRequest: (state) => {
      state.isLoading = true;

      state.appointmentCategories = [];
    },

    fetchAppointmentCategoriesSuccess: (state, action) => {
      state.isLoading = false;

      state.appointmentCategories = action.payload;
    },

    fetchAppointmentCategoriesFailure: (state) => {
      state.isLoading = false;
    },
  },
});
