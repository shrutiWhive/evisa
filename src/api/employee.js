import { fetcher, poster } from "src/lib";

import { endpoints } from "./endpoints";

export const fetchEmployees = async () => {
  try {
    const response = await fetcher(endpoints.employee.list);

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const fetchEmployeeDetail = async (id) => {
  try {
    const response = await fetcher(endpoints.employee.detail(id));

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const createEmployee = async (data) => {
  try {
    const response = await poster(endpoints.employee.create, data);

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const updateEmployee = async (id, data) => {
  try {
    const response = await poster(endpoints.employee.update(id), data);

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};
