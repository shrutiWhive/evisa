import { appointmentSlice } from "../reducer/appointment/appointment-slice";

export const {
  fetchAppointmentsRequest,
  fetchAppointmentsSuccess,
  fetchAppointmentsFailure,
} = appointmentSlice.actions;
