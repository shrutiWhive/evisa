import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, poster } from "src/lib";

import { endpoints } from "./endpoints";

export const createFormTemplate = async (data) => {
  try {
    const response = await poster(endpoints.formTemplate.create, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const fetchFormTemplates = async () => {
  try {
    const response = await fetcher(endpoints.formTemplate.list);

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const fetchFormTemplateDetail = async (id) => {
  try {
    const response = await fetcher(endpoints.formTemplate.detail(id));

    return response.data[0];
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const fetchValidationRules = async () => {
  try {
    const response = await fetcher(endpoints.formTemplate.validationRule);

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const updateFormTemplate = async (id, data) => {
  try {
    const response = await poster(endpoints.formTemplate.update(id), data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};
