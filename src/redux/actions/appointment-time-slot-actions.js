import { appointmentTimeSlotSlice } from "../reducer/appointment-time-slot/appointment-time-slot-slice";

export const {
  fetchAppointmentTimeSlotsRequest,
  fetchAppointmentTimeSlotsSuccess,
  fetchAppointmentTimeSlotsFailure,
} = appointmentTimeSlotSlice.actions;
