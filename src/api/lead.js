import { fetcher, poster } from "src/lib";

import { endpoints } from "./endpoints";
import useSWR from "swr";
import { useMemo } from "react";

export const createLead = async (data) => {
  try {
    const response = await poster(endpoints.lead.create, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const fetchLeadDetail = async (id) => {
  try {
    const response = await fetcher(endpoints.lead.detail(id));

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export function useGetLeadDetail(id) {
  const url = endpoints.lead.detail(id);

  const { data, isLoading, error, mutate } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      lead: data?.data || {},
      leadLoading: isLoading,
      leadError: error,
      mutateLead: mutate,
    }),
    [data, isLoading, error]
  );

  return memoizedValue;
}

export const createLeadActivity = async (id, data) => {
  try {
    const response = await poster(endpoints.lead.createActivity(id), data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const fetchActivityDetail = async (id) => {
  try {
    const response = await fetcher(endpoints.lead.activityList(id));

    return response.data || [];
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const updateLeadStatus = async (id, data) => {
  try {
    const response = await poster(endpoints.lead.updateStatus(id), data);

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const createLeadNotes = async (id, data) => {
  try {
    const response = await poster(endpoints.lead.createNotes(id), data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const updateLeadNotes = async (id, data) => {
  try {
    const response = await poster(endpoints.lead.updateNotes(id), data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const reRewardLeads = async (id) => {
  try {
    const response = await poster(endpoints.lead.rewardLeads(id));

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const followupLeads = async (id, data) => {
  try {
    const response = await poster(endpoints.lead.followupLeads(id), data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};
