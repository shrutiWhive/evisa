import useSWR from "swr";
import { useMemo } from "react";

import { fetcher } from "src/lib";

import { endpoints } from "./endpoints";

export function useGetTransactions() {
  const url = endpoints.transaction.list;

  const { data, isLoading, error } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      transactions: data?.data || [],
      transactionsLoading: isLoading,
      transactionsError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}
