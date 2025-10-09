import { fetcher, poster } from "src/lib";

import { endpoints } from "./endpoints";

export const fetchProfile = async () => {
  try {
    const response = await fetcher(endpoints.profile.get);

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const updateOrganization = async (orgData) => {
  try {
    const response = await poster(endpoints.profile.update, orgData);

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
