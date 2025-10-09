import { useCallback } from "react";

import Chip from "@mui/material/Chip";

import { fDateRangeShortLabel } from "src/utils/format-time";

import {
  chipProps,
  FiltersBlock,
  FiltersResult,
} from "src/components/filters-result";

// ----------------------------------------------------------------------

export function TeamReportTableFiltersResult({
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
    updateFilters({ name: "" });
  }, [onResetPage, updateFilters]);

  //   const handleRemoveRole = useCallback(
  //     (inputValue) => {
  //       const newValue = currentFilters.role.filter(
  //         (item) => item !== inputValue
  //       );

  //       onResetPage();
  //       updateFilters({ role: newValue });
  //     },
  //     [onResetPage, updateFilters, currentFilters.role]
  //   );

  const handleRemoveDate = useCallback(() => {
    onResetPage();
    updateFilters({ startDate: null, endDate: null });
  }, [onResetPage, updateFilters]);

  const handleReset = useCallback(() => {
    onResetPage();
    resetFilters();
  }, [onResetPage, resetFilters]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      {/* <FiltersBlock label="Role:" isShow={!!currentFilters.role.length}>
        {currentFilters.role.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveRole(item)}
          />
        ))}
      </FiltersBlock> */}

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

      <FiltersBlock label="Keyword:" isShow={!!currentFilters.name}>
        <Chip
          {...chipProps}
          label={currentFilters.name}
          onDelete={handleRemoveKeyword}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
