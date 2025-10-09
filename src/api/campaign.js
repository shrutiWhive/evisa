import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, poster, downloader } from "src/lib";

import { endpoints } from "./endpoints";

export function useGetCampaigns() {
  const url = endpoints.campaign.list;

  const { data, isLoading, error } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      campaigns: data?.data || [],
      campaignsLoading: isLoading,
      campaignsError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

export const fetchCampaignDetail = async (id) => {
  try {
    const response = await fetcher(endpoints.campaign.detail(id));

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

//without authentication
export const fetchCampaignDetailWithoutAuth = async (id) => {
  try {
    const response = await fetcher(endpoints.campaign.authDetail(id));

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export function useGetCampaignDetail(id) {
  const url = endpoints.campaign.detail(id);

  const { data, isLoading, error } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      campaign: data?.data || {},
      campaignLoading: isLoading,
      campaignError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

export const createCampaign = async (data) => {
  try {
    const response = await poster(endpoints.campaign.create, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const updateCampaign = async (id, data) => {
  try {
    const response = await poster(endpoints.campaign.update(id), data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const sendEmailToLeads = async (data) => {
  try {
    const response = await poster(endpoints.campaign.sendEmail, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const sendSmsToLeads = async (data) => {
  try {
    const response = await poster(endpoints.campaign.sendSms, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};


export const exportCampaignLeads = async (id) => {
  try {
    await downloader(
      endpoints.campaign.exportLeadList(id),
      `campaign-${id}-leads.xlsx`
    );
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const exportLeadTemplate = async (id) => {
  try {
    await downloader(
      endpoints.campaign.exportLeadTemplate(id),
      `lead-${id}-template.xlsx`
    );
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const importLeads = async (campaignId, file) => {
  // const formData = new FormData();
  // formData.append("file", file);

  try {
    const response = await poster(
     endpoints.campaign.importLeadList(campaignId),
      file,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Import failed:", error);
    throw error;
  }
};
