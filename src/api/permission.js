import { fetcher, poster } from "src/lib";

import { endpoints } from "./endpoints";

// ----------------------------------------------------------------------

export const fetchAllPermissions = async () => {
  try {
    const response = await fetcher(endpoints.permission.allPermission);

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const fetchCurrentUserPermissions = async () => {
  try {
    const response = await fetcher(endpoints.permission.currentUserPermission);

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const fetchSelectedEmployeePermissions = async (employeeId) => {
  try {
    const response = await fetcher(
      endpoints.permission.selectedEmployeePermission(employeeId)
    );

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const updateSelectedEmployeePermissions = async (data) => {
  try {
    const response = await poster(
      endpoints.permission.updateSelectedEmployeePermission,
      data
    );

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};
