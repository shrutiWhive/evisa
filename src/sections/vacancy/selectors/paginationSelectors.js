import { createSelector } from "@reduxjs/toolkit";

const leadState = (state) => state.lead;

export const selectSelectedLeadId = createSelector(
    [leadState],
    (lead) => lead.selectedLeadId
  );
  export const selectPageIndex = createSelector(
    [leadState],
    (lead) => lead.pageIndex
  );
  export const selectPageSize = createSelector(
    [leadState],
    (lead) => lead.pageSize
  );