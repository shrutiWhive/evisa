import { useCallback } from "react";

import Chip from "@mui/material/Chip";

import {
  chipProps,
  FiltersBlock,
  FiltersResult,
} from "src/components/filters-result";
import { paths } from "src/routes/paths";

// ----------------------------------------------------------------------

export function CampaignFiltersResult({ filters, totalResults, sx }) {
  const {
    state: currentFilters,
    setState: updateFilters,
    resetState: resetFilters,
  } = filters;

  const handleRemoveKeyword = useCallback(() => {
    updateFilters({ name: "" });
  }, [updateFilters]);

  const handleRemoveStatus = useCallback(() => {
    updateFilters({ status: "all" });
  }, [updateFilters]);

  return (
    <FiltersResult
      totalResults={totalResults}
      onReset={() => resetFilters()}
      sx={sx}
    >
      <FiltersBlock label="Keyword:" isShow={!!currentFilters.name}>
        <Chip
          {...chipProps}
          label={currentFilters.name}
          onDelete={handleRemoveKeyword}
        />
      </FiltersBlock>

      <FiltersBlock label="Status:" isShow={currentFilters.status !== "all"}>
        <Chip
          {...chipProps}
          label={currentFilters.status}
          onDelete={handleRemoveStatus}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
