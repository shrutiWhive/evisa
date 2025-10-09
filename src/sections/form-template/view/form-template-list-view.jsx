import { useCallback, useEffect } from "react";
import { useSetState } from "minimal-shared/hooks";

import {
  Tab,
  Tabs,
  Button,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { fetchFormTemplatesRequest } from "src/redux/actions";

import { DashboardContent } from "src/layouts/dashboard";

import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { Iconify } from "src/components/iconify";
import { Label } from "src/components/label";
import { EmptyContent } from "src/components/empty-content";

import { FormTemplateList } from "../form-template-list";
import { FormTemplateFiltersResult } from "../form-template-filters-result";

export function FormTemplateListView() {
  const filters = useSetState({ name: "", status: "all" });

  const { state: currentFilters, setState: updateFilters } = filters;

  const dispatch = useAppDispatch();

  const { formTemplates, isLoading } = useAppSelector(
    (state) => state.formTemplate
  );

  const dataFiltered = applyFilter({
    inputData: formTemplates,
    filters: currentFilters,
  });

  const canReset = !!currentFilters.name || currentFilters.status !== "all";

  const notFound = !dataFiltered.length && canReset;

  useEffect(() => {
    dispatch(fetchFormTemplatesRequest());
  }, [dispatch]);

  const handleFilterName = useCallback(
    (event) => {
      updateFilters({ name: event.target.value });
    },
    [updateFilters]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      updateFilters({ status: newValue });
    },
    [updateFilters]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "Form Template", href: paths.dashboard.formTemplate.root },
          { name: "List" },
        ]}
        // action={
        //   <Button
        //     component={RouterLink}
        //     href={paths.dashboard.formTemplate.create}
        //     variant="contained"
        //     startIcon={<Iconify icon="mingcute:add-line" />}
        //   >
        //     New form template
        //   </Button>
        // }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: { xs: 3, md: 5 },
        }}
      >
        <Tabs value={currentFilters.status} onChange={handleFilterStatus}>
          {["all", "active", "inactive"].map((tab) => (
            <Tab
              key={tab}
              iconPosition="end"
              value={tab}
              label={tab}
              icon={
                <Label
                  variant={
                    ((tab === "all" || tab === currentFilters.status) &&
                      "filled") ||
                    "soft"
                  }
                  color={
                    (tab === "active" && "success") ||
                    (tab === "inactive" && "error") ||
                    "default"
                  }
                >
                  {tab === "all" && formTemplates.length}
                  {tab === "active" &&
                    formTemplates.filter((template) => template.is_active === 1)
                      .length}
                  {tab === "inactive" &&
                    formTemplates.filter((template) => template.is_active !== 1)
                      .length}
                </Label>
              }
              sx={{ textTransform: "capitalize" }}
            />
          ))}
        </Tabs>

        <TextField
          value={currentFilters.name}
          onChange={handleFilterName}
          placeholder="Search template ..."
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: "text.disabled" }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {canReset && (
        <FormTemplateFiltersResult
          filters={filters}
          totalResults={dataFiltered.length}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
      )}

      {notFound && <EmptyContent filled sx={{ py: 10 }} />}

      <FormTemplateList formTemplates={dataFiltered} loading={isLoading} />
    </DashboardContent>
  );
}

function applyFilter({ inputData, filters }) {
  const { name, status } = filters;

  if (name) {
    inputData = inputData.filter((template) =>
      template.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== "all") {
    const isActive = status === "active" ? 1 : 0;

    inputData = inputData.filter((template) => template.is_active === isActive);
  }

  return inputData;
}
