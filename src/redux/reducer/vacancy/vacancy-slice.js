import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  vacancy: [],
  selectedVacancyId: null,
};

export const vacancySlice = createSlice({
  name: "vacancy",
  initialState,
  reducers: {
    fetchVacancyRequest: (state) => {
      state.isLoading = true;

      state.vacancy = [];
    },

    fetchVacancySuccess: (state, action) => {
      state.isLoading = false;

      state.vacancy = action.payload;
    },

    fetchVacancyFailure: (state) => {
      state.isLoading = false;
    },

    setSelectedVacancyId: (state, action) => {
      state.selectedVacancyId = action.payload;
    },

    clearSelectedVacancyId: (state) => {
      state.selectedVacancyId = null;
    },
  },
});
