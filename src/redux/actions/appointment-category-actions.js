import { appointmentCategorySlice } from "../reducer/appointment-category/appointment-category-slice";

export const {
  fetchAppointmentCategoriesRequest,
  fetchAppointmentCategoriesSuccess,
  fetchAppointmentCategoriesFailure,
} = appointmentCategorySlice.actions;
