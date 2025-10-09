import { fetcher } from "src/lib";
import { endpoints } from "./endpoints";

export const fetchSiteSetting = async () => {
  try {
    const response = await fetcher(endpoints.siteSettings.get);

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};