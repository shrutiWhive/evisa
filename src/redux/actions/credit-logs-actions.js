import { creditlogSlice } from "../reducer/credit-logs/creditlogs-slice";

export const {
    fetchCreditLogsRequest,
    fetchCreditLogsSuccess,
    fetchCreditLogsFailure,
} = creditlogSlice.actions;
