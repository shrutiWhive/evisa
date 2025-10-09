import { fetcher } from "src/lib";
import { endpoints } from "./endpoints";

export const fetchTeamReport = async () => {
  try {
    const response = await fetcher(endpoints.reports.teamReports);

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const fetchTransactionReport = async () => {
    try {
      const response = await fetcher(endpoints.reports.transactions);
  
      return response.data;
    } catch (error) {
      console.error(error);
  
      throw error;
    }
  };

  export const fetchSmsReport = async () => {
    try {
      const response = await fetcher(endpoints.reports.sms);
  
      return response.data;
    } catch (error) {
      console.error(error);
  
      throw error;
    }
  };

  export const fetchTopupReport = async () => {
    try {
      const response = await fetcher(endpoints.reports.topup);
  
      return response.data;
    } catch (error) {
      console.error(error);
  
      throw error;
    }
  };

  export const fetchPackageReport = async () => {
    try {
      const response = await fetcher(endpoints.reports.package);
  
      return response.data;
    } catch (error) {
      console.error(error);
  
      throw error;
    }
  };

  export const fetchCreditReport = async () => {
    try {
      const response = await fetcher(endpoints.reports.credit);
  
      return response.data;
    } catch (error) {
      console.error(error);
  
      throw error;
    }
  };