import useSWR from "swr";
import { endpoints } from "./endpoints";
import { useMemo } from "react";
import { fetcher, poster } from "src/lib";
import { deleter } from "src/lib/axios/axios";

export function useGetDocument() {
  const url = endpoints.document.list;

  const { data, isLoading, error, mutate } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      documents: data?.data || [],
      documentLoading: isLoading,
      documentError: error,
      mutateDocument: mutate,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

export const addDocuments = async (data) => {
  try {
    const response = await poster(endpoints.document.store, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const delDocument = async (id) => {
  try {
    const response = await deleter(endpoints.document.delete(id));

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export function useGetContract() {
  const url = endpoints.contract.show;

  const { data, isLoading, error } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      contract: data?.data || [],
      contractLoading: isLoading,
      contractError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

export function useGetContractList() {
  const url = endpoints.contract.list;

  const { data, isLoading, error, mutate } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      contractList: data?.data || [],
      contractListLoading: isLoading,
      contractListError: error,
      contractMutate: mutate,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

export const addContract = async (data) => {
  try {
    const response = await poster(endpoints.contract.upload, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};
