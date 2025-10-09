import { fetcher, poster } from "src/lib";

import { endpoints } from "./endpoints";

// ----------------------------------------------------------------------

export const fetchAppointments = async () => {
  try {
    const response = await fetcher(endpoints.appointment.list);

    return response.data || [];
  } catch (error) {
    console.error(error);

    throw error;
  }
};

// ----------------------------------------------------------------------

export const fetchAppointmentCategories = async () => {
  try {
    const response = await fetcher(endpoints.appointment.category.list);

    return response.data || [];
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const createAppointmentCategory = async (data) => {
  try {
    const response = await poster(endpoints.appointment.category.create, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const updateAppointmentCategory = async (id, data) => {
  try {
    const response = await poster(
      endpoints.appointment.category.update(id),
      data
    );

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

// ----------------------------------------------------------------------

export const fetchAppointmentTimeSlots = async () => {
  try {
    const response = await fetcher(endpoints.appointment.timeSlot.list);

    return response.data || [];
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const createAppointmentTimeSlot = async (data) => {
  try {
    const response = await poster(endpoints.appointment.timeSlot.create, data);

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
