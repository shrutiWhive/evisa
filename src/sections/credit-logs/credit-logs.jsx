import { useState, useEffect } from "react";
import { useSetState } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";

import { paths } from "src/routes/paths";

import { fIsAfter, fIsBetween } from "src/utils/format-time";

import { DashboardContent } from "src/layouts/dashboard";

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
} from "src/components/table";

import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { selectAppointmentState, selectCreditLogs } from "src/redux/selectors";
import { fetchCreditLogsRequest } from "src/redux/actions/credit-logs-actions";
import { CreditLogsTableToolbar } from "./creditlogs-table-toolbar";
import { AppointmentTableFiltersResult } from "../appointment/appointment-table-filters-result";
import { CreditLogsTableRow } from "./credit-logs-table-row";
import { CreditLogsTableFiltersResult } from "./credit-logs-filter-result";

const TABLE_HEAD = [
  { id: "sn", label: "SN" },
  { id: "date", label: "Date" },
  { id: "particulars", label: "Particulars" },
  { id: "campaign", label: "Campaign" },
  { id: "reference", label: "Reference" },
  { id: "credit", label: "Credit" },
  { id: "debit", label: "Debit" },
];

// ----------------------------------------------------------------------

export function CreditLogView() {
  const table = useTable();

  const dispatch = useAppDispatch();

  const { creditlogs } = useAppSelector(selectCreditLogs);

  useEffect(() => {
    dispatch(fetchCreditLogsRequest());
  }, [dispatch]);

  const filters = useSetState({
    description: "",
    // role: [],
    startDate: null,
    endDate: null,
  });

  const { state: currentFilters, setState: updateFilters } = filters;

  const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

  const dataFiltered = applyFilter({
    inputData: creditlogs,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
    dateError,
  });
  const canReset =
    !!currentFilters.description ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "Credit Log",
            href: paths.dashboard.creditLogs.root,
          },
          { name: "List" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <CreditLogsTableToolbar
          filters={filters}
          onResetPage={table.onResetPage}
        />

        {canReset && (
          <CreditLogsTableFiltersResult
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
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, index) => (
                    <CreditLogsTableRow
                      key={row.id}
                      serialNumber={index + 1}
                      row={row}
                    />
                  ))}

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
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { description, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (description) {
    inputData = inputData.filter((user) =>
      user.description.toLowerCase().includes(description.toLowerCase())
    );
  }

  // if (role.length) {
  //   inputData = inputData.filter((user) => role.includes(user.role));
  // }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) =>
        fIsBetween(order.created_at, startDate, endDate)
      );
    }
  }

  return inputData;
}
