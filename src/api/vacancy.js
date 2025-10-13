import { useMemo } from "react";
import useSWR from "swr";
import { endpoints } from "./endpoints";
import { fetcher } from "src/lib";

export function useGetVacancy() {
  const url = endpoints.vacancy.list;

  const { data, isLoading, error } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      vacancy: data?.data || [],
      vacancyLoading: isLoading,
      vacancyError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}


export function useGetVacancyDetail(id) {
  const url = endpoints.vacancy.detail(id);

  const { data, isLoading, error } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      vacancyDetail: data?.data || {},
      vacancyLoading: isLoading,
      vacancyError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

// export const fetchVacancyDetail = async (id) => {
//   try {
//     const response = await fetcher(endpoints.vacancy.detail(id));

//     return response.data;
//   } catch (error) {
//     console.error(error);

//     throw error;
//   }
// };