import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  appointments: [],
};

export const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    fetchAppointmentsRequest: (state) => {
      state.isLoading = true;

      state.appointments = [];
    },

    fetchAppointmentsSuccess: (state, action) => {
      state.isLoading = false;

      state.appointments = action.payload;
    },

    fetchAppointmentsFailure: (state) => {
      state.isLoading = false;
    },
  },
});
