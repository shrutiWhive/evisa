import { useCallback } from "react";

import Chip from "@mui/material/Chip";

import {
  chipProps,
  FiltersBlock,
  FiltersResult,
} from "src/components/filters-result";

// ----------------------------------------------------------------------

export function AppointmentTimeSlotTableFiltersResult({
  filters,
  onResetPage,
  totalResults,
  sx,
}) {
  const {
    state: currentFilters,
    setState: updateFilters,
    resetState: resetFilters,
  } = filters;

  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    updateFilters({ keyword: "" });
  }, [onResetPage, updateFilters]);

  const handleReset = useCallback(() => {
    onResetPage();
    resetFilters();
  }, [onResetPage, resetFilters]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
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
