import { documentsSlice } from "../reducer/documents/documents-slice";

export const {
  fetchDocumentsRequest,
  fetchDocumentsSuccess,
  fetchDocumentsFailure,
} = documentsSlice.actions;
