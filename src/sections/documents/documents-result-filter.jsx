import { useCallback } from "react";
import Chip from "@mui/material/Chip";
import {
  chipProps,
  FiltersBlock,
  FiltersResult,
} from "src/components/filters-result";

// ----------------------------------------------------------------------

export function DocumentsTableFiltersResult({
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

  const handleRemoveVacancy = useCallback(() => {
    onResetPage();
    updateFilters({ vacancy_id: "" });
  }, [onResetPage, updateFilters]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    updateFilters({ status: "" });
  }, [onResetPage, updateFilters]);

  const handleReset = useCallback(() => {
    onResetPage();
    resetFilters();
  }, [onResetPage, resetFilters]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Vacancy:" isShow={!!currentFilters.vacancy_id}>
        <Chip
          {...chipProps}
          label={`Vacancy ID: ${currentFilters.vacancy_id}`}
          onDelete={handleRemoveVacancy}
        />
      </FiltersBlock>

      <FiltersBlock label="Status:" isShow={!!currentFilters.status}>
        <Chip
          {...chipProps}
          label={currentFilters.status?.replace("_", " ")}
          onDelete={handleRemoveStatus}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
