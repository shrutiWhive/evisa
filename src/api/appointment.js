import { fetcher, poster } from "src/lib";

import { endpoints } from "./endpoints";

// ----------------------------------------------------------------------

export const fetchAppointmentDate = async () => {
  try {
    const response = await fetcher(endpoints.appointment.list);

    return response.data || [];
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const createAppointment = async (data) => {
  try {
    const response = await poster(endpoints.appointment.create, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const updateAppointmentTimeSlot = async (id, data) => {
  try {
    const response = await poster(
      endpoints.appointment.timeSlot.update(id),
      data
    );

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};
