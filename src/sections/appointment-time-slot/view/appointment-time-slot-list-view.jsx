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
import { fetchAppointmentTimeSlotsRequest } from "src/redux/actions";
import { selectAppointmentTimeSlotState } from "src/redux/selectors";

import { AppointmentTimeSlotTableRow } from "../appointment-time-slot-table-row";
import { AppointmentTimeSlotTableToolbar } from "../appointment-time-slot-table-toolbar";
import { AppointmentTimeSlotTableFiltersResult } from "../appointment-time-slot-table-filters-result";
import { AppointmentTimeSlotNewEditForm } from "../appointment-time-slot-new-edit-form";

const TABLE_HEAD = [
  { id: "sn", label: "SN" },
  { id: "start_time", label: "Start Time" },
  { id: "end_time", label: "End Time" },
  { id: "max_bookings", label: "Max Bookings" },
  { id: "" },
];

// ----------------------------------------------------------------------

export function AppointmentTimeSlotListView() {
  const table = useTable();

  const openCreateEditTimeSlotForm = useBoolean();

  const dispatch = useAppDispatch();

  const { appointmentTimeSlots, isLoading } = useAppSelector(
    selectAppointmentTimeSlotState
  );

  const [selectedTimeSlot, setSelectedTimeSlot] = useState();

  useEffect(() => {
    dispatch(fetchAppointmentTimeSlotsRequest());
  }, [dispatch]);

  const filters = useSetState({
    keyword: "",
  });

  const { state: currentFilters, setState: updateFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: appointmentTimeSlots,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const canReset = !!currentFilters.keyword;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleEdit = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);

    openCreateEditTimeSlotForm.onTrue();
  };

  const handleClearSelectedTimeSlot = () => {
    setSelectedTimeSlot();
  };

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            {
              name: "Appointment Time Slot",
              href: paths.dashboard.transaction.root,
            },
            { name: "List" },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={openCreateEditTimeSlotForm.onTrue}
            >
              Add Time Slot
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <AppointmentTimeSlotTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
          />

          {canReset && (
            <AppointmentTimeSlotTableFiltersResult
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
                        <AppointmentTimeSlotTableRow
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

      <AppointmentTimeSlotNewEditForm
        open={openCreateEditTimeSlotForm.value}
        onClose={openCreateEditTimeSlotForm.onFalse}
        //
        selectedTimeSlot={selectedTimeSlot}
        onClearSelectedTimeSlot={handleClearSelectedTimeSlot}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { keyword } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (keyword) {
    inputData = inputData.filter((slot) =>
      String(slot.max_bookings).toLowerCase().includes(keyword.toLowerCase())
    );
  }

  return inputData;
}
