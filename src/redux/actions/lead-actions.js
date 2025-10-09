import { leadSlice } from "../reducer/lead/leaddetail-slice";

export const {
  fetchLeadDetailRequest,
  fetchLeadDetailSuccess,
  fetchLeadDetailFailure,
  setActivityDetail,
  setLeadNotes,
  setLeadFollowUp,
  fetchActivityDetailRequest,
  fetchActivityDetailSuccess,
  fetchActivityDetailFailure,
  setSelectedLeadId,
  setPaginationState,
  setStatus,
  clearStatus,
} = leadSlice.actions;
