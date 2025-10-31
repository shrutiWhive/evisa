import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  documents: [],
  error: null,
  filters: {
    vacancy_id: "",
    status: "",
  },
};

export const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    fetchDocumentsRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
      // optional filters payload: { vacancy_id, status }
      if (action.payload) {
        state.filters = { ...state.filters, ...action.payload };
      }
    },

    fetchDocumentsSuccess: (state, action) => {
      state.isLoading = false;
      state.documents = Array.isArray(action.payload) ? action.payload : [];
    },

    fetchDocumentsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to fetch contracts";
    },
    
  },
});
