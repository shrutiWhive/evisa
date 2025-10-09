import useSWR from "swr";
import { useMemo } from "react";

import { fetcher } from "src/lib";

import { endpoints } from "./endpoints";

export function useGetRewardTypes() {
  const { data, isLoading, error } = useSWR(endpoints.reward.type, fetcher);

  const memoizedValue = useMemo(
    () => ({
      rewardTypes: data?.data || [],
      rewardTypesLoading: isLoading,
      rewardTypesError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

export function useGetTelecommunicationProviders() {
  const { data, isLoading, error } = useSWR(
    endpoints.telecommunication.providers,
    fetcher
  );

  const memoizedValue = useMemo(
    () => ({
      telecommunicationProviders: data?.data || [],
      telecommunicationProvidersLoading: isLoading,
      telecommunicationProvidersError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

export function useGetNcellDataPacks() {
  const { data, isLoading, error } = useSWR(
    endpoints.telecommunication.dataPack.ncell,
    fetcher
  );

  const memoizedValue = useMemo(
    () => ({
      ncellDataPacks: data?.data || [],
      ncellDataPacksLoading: isLoading,
      ncellDataPacksError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

export function useGetNtcDataPacks() {
  const { data, isLoading, error } = useSWR(
    endpoints.telecommunication.dataPack.ntc,
    fetcher
  );

  const memoizedValue = useMemo(
    () => ({
      ntcDataPacks: data?.data || [],
      ntcDataPacksLoading: isLoading,
      ntcDataPacksError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

export function useGetTopUpAmounts() {
  const { data, isLoading, error } = useSWR(
    endpoints.telecommunication.topUpAmount,
    fetcher
  );

  const memoizedValue = useMemo(
    () => ({
      topUpAmounts: data?.data || [],
      topUpAmountsLoading: isLoading,
      topUpAmountsError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}
