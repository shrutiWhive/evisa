import axios from "axios";

import { CONFIG } from "src/global-config";

// ----------------------------------------------------------------------

const axiosInstanceHR = axios.create({
  baseURL: CONFIG.serverUrlHR,
  headers: {
    Organization:
      "V2Fsa2VycyBIaXZlIFB2dC4gTHRkLlNhdHRhbGUsIEthdGhtYW5kdUdhdXJhdiBQYW5kZXl2MGVBZG9lQXhRT2ZkRlR5Wm8ydUhUV1RhMVFhbjg=",
  },
});

axiosInstanceHR.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong!"
    )
);

// ----------------------------------------------------------------------

export default axiosInstanceHR;

// ----------------------------------------------------------------------

export const fetcherHr = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstanceHR.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error("Failed to fetch:", error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const posterHr = async (args, data) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  try {
    const response = data
      ? await axiosInstanceHR.post(url, data, { ...config })
      : await axiosInstanceHR.post(url, { ...config });

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

