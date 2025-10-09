import { useCallback } from "react";

import { Chip } from "@mui/material";

import { fDateRangeShortLabel } from "src/utils/format-time";

import {
  chipProps,
  FiltersBlock,
  FiltersResult,
} from "src/components/filters-result";

// ----------------------------------------------------------------------

export function CampaignDetailLeadsTableFiltersResult({
  filters,
  onResetPage,
  totalResults,
  //
  onRemoveStatus,
  sx,
}) {
  const {
    state: currentFilters,
    setState: updateFilters,
    resetState: resetFilters,
  } = filters;

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    updateFilters({ status: "all" });
    onRemoveStatus();
  }, [onResetPage, updateFilters]);

  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    updateFilters({ keyword: "" });
  }, [onResetPage, updateFilters]);

  const handleRemoveDate = useCallback(() => {
    onResetPage();
    updateFilters({ startDate: null, endDate: null });
  }, [onResetPage, updateFilters]);

  const handleReset = useCallback(() => {
    onResetPage();
    resetFilters();
    onRemoveStatus();
  }, [onResetPage, resetFilters]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Status:" isShow={!!currentFilters.status}>
        <Chip
          {...chipProps}
          label={currentFilters.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: "capitalize" }}
        />
      </FiltersBlock>

      <FiltersBlock
        label="Date:"
        isShow={Boolean(currentFilters.startDate && currentFilters.endDate)}
      >
        <Chip
          {...chipProps}
          label={fDateRangeShortLabel(
            currentFilters.startDate,
            currentFilters.endDate
          )}
          onDelete={handleRemoveDate}
        />
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!currentFilters.keyword}>
        <Chip
          {...chipProps}
          label={currentFilters.keyword}
          onDelete={handleRemoveKeyword}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
