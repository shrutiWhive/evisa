import useSWR from "swr";
import { endpoints } from "./endpoints";
import { fetcher, poster } from "src/lib";
import { useMemo } from "react";

export function useGetPlan() {
  const url = endpoints.plan.list;

  const { data, isLoading, error } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      plan: data?.data || [],
      planLoading: isLoading,
      planError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

export const assignPlan = async (data) => {
  try {
    const response = await poster(endpoints.plan.assign, data);

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
