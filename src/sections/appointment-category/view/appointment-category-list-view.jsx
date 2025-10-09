import { useState, useEffect } from "react";
import { useSetState, useBoolean } from "minimal-shared/hooks";

import { Box, Card, Table, TableBody, Button } from "@mui/material";

import { paths } from "src/routes/paths";

import { fIsAfter, fIsBetween } from "src/utils/format-time";

import { DashboardContent } from "src/layouts/dashboard";

import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  TableSkeleton,
} from "src/components/table";

import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { fetchAppointmentCategoriesRequest } from "src/redux/actions";
import { selectAppointmentCategoryState } from "src/redux/selectors";

import { AppointmentCategoryTableRow } from "../appointment-category-table-row";
import { AppointmentCategoryTableToolbar } from "../appointment-category-table-toolbar";
import { AppointmentCategoryTableFiltersResult } from "../appointment-category-table-filters-result";
import { AppointmentCategoryNewEditForm } from "../appointment-category-new-edit-form";

const TABLE_HEAD = [
  { id: "sn", label: "SN" },
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
  { id: "" },
];

// ----------------------------------------------------------------------

export function AppointmentCategoryListView() {
  const table = useTable();

  const openCreateEditCategoryForm = useBoolean();

  const dispatch = useAppDispatch();

  const { appointmentCategories, isLoading } = useAppSelector(
    selectAppointmentCategoryState
  );

  const [selectedCategory, setSelectedCategory] = useState();

  useEffect(() => {
    dispatch(fetchAppointmentCategoriesRequest());
  }, [dispatch]);

  const filters = useSetState({
    name: "",
    startDate: null,
    endDate: null,
  });

  const { state: currentFilters, setState: updateFilters } = filters;

  const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

  const dataFiltered = applyFilter({
    inputData: appointmentCategories,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
    dateError,
  });

  const canReset =
    !!currentFilters.name ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleEdit = (category) => {
    setSelectedCategory(category);

    openCreateEditCategoryForm.onTrue();
  };

  const handleClearSelectedCategory = () => {
    setSelectedCategory();
  };

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            {
              name: "Appointment Category",
              href: paths.dashboard.appointment.category,
            },
            { name: "List" },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={openCreateEditCategoryForm.onTrue}
            >
              Add Category
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <AppointmentCategoryTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
          />

          {canReset && (
            <AppointmentCategoryTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: "relative" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
            />

            <Scrollbar>
              <Table
                size={table.dense ? "small" : "medium"}
                sx={{ minWidth: 960 }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                />

                <TableBody>
                  {isLoading ? (
                    <TableSkeleton
                      rowCount={table.rowsPerPage}
                      cellCount={TABLE_HEAD.length}
                      sx={{ height: 69 }}
                    />
                  ) : (
                    dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row, index) => (
                        <AppointmentCategoryTableRow
                          key={row.id}
                          serialNumber={index + 1}
                          row={row}
                          //
                          onEdit={() => handleEdit(row)}
                        />
                      ))
                  )}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      dataFiltered.length
                    )}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      <AppointmentCategoryNewEditForm
        open={openCreateEditCategoryForm.value}
        onClose={openCreateEditCategoryForm.onFalse}
        //
        selectedCategory={selectedCategory}
        onClearSelectedCategory={handleClearSelectedCategory}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((category) =>
      category.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) =>
        fIsBetween(order.created_at, startDate, endDate)
      );
    }
  }

  return inputData;
}
