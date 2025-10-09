import { reportSlice } from "../reducer/reports/reports-slice";

export const {
  fetchReportRequest,
  fetchReportSuccess,
  fetchReportFailure,
  fetchTransactionRequest,
  fetchTransactionSuccess,
  fetchTransactionFailure,
  fetchSmsRequest,
  fetchSmsSuccess,
  fetchSmsFailure,
  fetchTopupRequest,
  fetchTopupSuccess,
  fetchTopupFailure,
  fetchPackageRequest,
  fetchPackageSuccess,
  fetchPackageFailure,
  fetchCreditRequest,
  fetchCreditSuccess,
  fetchCreditFailure,
} = reportSlice.actions;
