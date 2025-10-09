// ----------------------------------------------------------------------

import { fetcher } from "src/lib";
import { endpoints } from "./endpoints";

export const fetchCreditLogs = async () => {
  try {
    const response = await fetcher(endpoints.creditLogs.list);

    return response.data || [];
  } catch (error) {
    console.error(error);

    throw error;
  }
};