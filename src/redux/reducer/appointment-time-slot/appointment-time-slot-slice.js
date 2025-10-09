import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  appointmentTimeSlots: [],
};

export const appointmentTimeSlotSlice = createSlice({
  name: "appointmentTimeSlot",
  initialState,
  reducers: {
    fetchAppointmentTimeSlotsRequest: (state) => {
      state.isLoading = true;

      state.appointmentTimeSlots = [];
    },

    fetchAppointmentTimeSlotsSuccess: (state, action) => {
      state.isLoading = false;

      state.appointmentTimeSlots = action.payload;
    },

    fetchAppointmentTimeSlotsFailure: (state) => {
      state.isLoading = false;
    },
  },
});
