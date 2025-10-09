import { formTemplateSlice } from "../reducer/form-template/form-template-slice";

export const {
  fetchFormTemplatesRequest,
  fetchFormTemplatesSuccess,
  fetchFormTemplatesFailure,
  //
  fetchFormTemplateDetailRequest,
  fetchFormTemplateDetailSuccess,
  fetchFormTemplateDetailFailure,
  //
  fetchValidationRulesRequest,
  fetchValidationRulesSuccess,
  fetchValidationRulesFailure,
} = formTemplateSlice.actions;
