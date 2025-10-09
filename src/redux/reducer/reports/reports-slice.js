import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  teamReport: {},
  transactionReport: {},
  smsReport: {},
  topupReport: {},
  packageReport: {},
  creditReport: {},

};

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {

    // Team Report
    fetchReportRequest: (state) => {
      state.isLoading = true;

      state.teamReport = {};
    },

    fetchReportSuccess: (state, action) => {
      state.isLoading = false;

      state.teamReport = action.payload;
    },

    fetchReportFailure: (state) => {
      state.isLoading = false;
    },

    // Transaction Report

    fetchTransactionRequest: (state) => {
        state.isLoading = true;
  
        state.transactionReport = {};
      },
  
      fetchTransactionSuccess: (state, action) => {
        state.isLoading = false;
  
        state.transactionReport = action.payload;
      },
  
      fetchTransactionFailure: (state) => {
        state.isLoading = false;
      },

    // SMS Report

    fetchSmsRequest: (state) => {
      state.isLoading = true;

      state.smsReport = {};
    },

    fetchSmsSuccess: (state, action) => {
      state.isLoading = false;

      state.smsReport = action.payload;
    },

    fetchSmsFailure: (state) => {
      state.isLoading = false;
    },

    // Topup Report

     fetchTopupRequest: (state) => {
      state.isLoading = true;

      state.topupReport = {};
    },

    fetchTopupSuccess: (state, action) => {
      state.isLoading = false;

      state.topupReport = action.payload;
    },

    fetchTopupFailure: (state) => {
      state.isLoading = false;
    },

    // Package Report

     fetchPackageRequest: (state) => {
      state.isLoading = true;

      state.packageReport = {};
    },

    fetchPackageSuccess: (state, action) => {
      state.isLoading = false;

      state.packageReport = action.payload;
    },

    fetchPackageFailure: (state) => {
      state.isLoading = false;
    },

    // Credit Report

     fetchCreditRequest: (state) => {
      state.isLoading = true;

      state.creditReport = {};
    },

    fetchCreditSuccess: (state, action) => {
      state.isLoading = false;

      state.creditReport = action.payload;
    },

    fetchCreditFailure: (state) => {
      state.isLoading = false;
    },
  },
});
