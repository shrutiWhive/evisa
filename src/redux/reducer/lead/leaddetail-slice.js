import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  leadDetail: {},
  error: false,
  activityDetail: [],
  leadNotes: [],
  followUp: [],
  selectedLeadId: null,
  pageIndex: 0,
  pageSize: 5,
  status: "",
};



export const leadSlice = createSlice({
  name: "lead",
  initialState,
  reducers: {
    fetchLeadDetailRequest: (state) => {
      state.isLoading = true;

      state.leadDetail = {};

      state.error = false;
    },

    fetchLeadDetailSuccess: (state, action) => {
      state.isLoading = false;

      state.leadDetail = action.payload;

      state.leadNotes = action.payload.lead_notes;
      state.followUp = action.payload.lead_followups;
    },

    fetchLeadDetailFailure: (state) => {
      state.isLoading = false;

      state.leadDetail = {};

      state.error = true;
    },

    fetchActivityDetailRequest: (state) => {
      state.isLoading = true;

      state.activityDetail = [];

      state.error = false;
    },

    fetchActivityDetailSuccess: (state, action) => {
      state.isLoading = false;

      state.activityDetail = action.payload;
    },

    fetchActivityDetailFailure: (state) => {
      state.isLoading = false;

      state.activityDetail = [];

      state.error = true;
    },

    setActivityDetail: (state, action) => {
      state.activityDetail = [action.payload, ...state.activityDetail];
    },

    setLeadNotes: (state, action) => {
      state.leadNotes = action.payload;
    },

    setLeadFollowUp: (state, action) => {
      const { leadId, followUpData } = action.payload;
      state.followUp = {
        ...state.followUp,
        [String(leadId)]: followUpData,
      };
    },

    setSelectedLeadId: (state, action) => {
      state.selectedLeadId = action.payload;
    },
    
    setPaginationState: (state, action) => {
      const { pageIndex, pageSize } = action.payload;
      state.pageIndex = pageIndex;
      state.pageSize = pageSize;
    },

    setStatus(state, action) {
      state.status = action.payload;
    },
    clearStatus(state) {
      state.status = "";
    },
    
  },
});
