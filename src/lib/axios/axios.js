import axios from "axios";

import { CONFIG } from "src/global-config";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong!"
    )
);

// ----------------------------------------------------------------------

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error("Failed to fetch:", error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const poster = async (args, data) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  try {
    const response = data
      ? await axiosInstance.post(url, data, { ...config })
      : await axiosInstance.post(url, { ...config });

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

// ----------------------------------------------------------------------

export const deleter = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  try {
    const response = await axiosInstance.delete(url, { ...config });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const downloader = async (url, fallbackFilename = "download.xlsx") => {
  try {
    const response = await axiosInstance.get(url, {
      responseType: "blob",
    });

    const blob = new Blob([response.data]);
    const blobUrl = window.URL.createObjectURL(blob);

    const disposition = response.headers["content-disposition"];

    const extractedFilename = disposition
      ?.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)?.[1]
      ?.replace(/['"]/g, "");

    const filename = extractedFilename || fallbackFilename;

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error(error);

    throw error;
  }
};
