import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  formTemplates: [],
  formTemplateDetail: {},
  validationRules: [],
};

export const formTemplateSlice = createSlice({
  name: "formTemplate",
  initialState,
  reducers: {
    fetchFormTemplatesRequest: (state) => {
      state.isLoading = true;

      state.formTemplates = [];
    },

    fetchFormTemplatesSuccess: (state, action) => {
      state.isLoading = false;

      state.formTemplates = action.payload;
    },

    fetchFormTemplatesFailure: (state) => {
      state.isLoading = false;

      state.formTemplates = [];
    },

    fetchFormTemplateDetailRequest: (state) => {
      state.isLoading = true;

      state.formTemplateDetail = {};
    },

    fetchFormTemplateDetailSuccess: (state, action) => {
      state.isLoading = false;

      state.formTemplateDetail = action.payload;
    },

    fetchFormTemplateDetailFailure: (state) => {
      state.isLoading = false;

      state.formTemplateDetail = {};
    },

    fetchValidationRulesRequest: (state) => {
      state.validationRules = [];
    },

    fetchValidationRulesSuccess: (state, action) => {
      state.validationRules = action.payload;
    },

    fetchValidationRulesFailure: (state) => {
      state.validationRules = [];
    },
  },
});
